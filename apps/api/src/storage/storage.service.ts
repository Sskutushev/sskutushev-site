import {
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * Object storage, which a read-only deployment does not have.
 *
 * Everything that writes here is behind `ENABLE_MUTATIONS`, and the published
 * site turns that off. Building the client in the constructor meant the whole
 * API refused to boot without credentials for a service it would never call —
 * so the client is built when there is something to build it from, and every
 * method refuses in the open when there is not.
 *
 * Refusing is the point. An unconfigured store that silently returns nothing
 * is the false-fallback failure this codebase argues against everywhere else.
 */
@Injectable()
export class StorageService {
  private readonly client: S3Client | null;
  private readonly bucket: string | undefined;
  private readonly maxBytes: number;

  constructor(config: ConfigService) {
    this.bucket = config.get<string>('S3_BUCKET');
    this.maxBytes = config.getOrThrow<number>('ASSET_MAX_BYTES');
    const endpoint = config.get<string>('S3_ENDPOINT');
    const accessKeyId = config.get<string>('S3_ACCESS_KEY');
    const secretAccessKey = config.get<string>('S3_SECRET_KEY');
    this.client =
      endpoint && this.bucket && accessKeyId && secretAccessKey
        ? new S3Client({
            endpoint,
            region: config.getOrThrow<string>('S3_REGION'),
            forcePathStyle: true,
            credentials: { accessKeyId, secretAccessKey },
          })
        : null;
  }

  /** True when a store is configured. Callers that can degrade should ask. */
  get available(): boolean {
    return this.client !== null;
  }

  private require(): { client: S3Client; bucket: string } {
    if (!this.client || !this.bucket) {
      throw new ServiceUnavailableException('Object storage is not configured on this deployment');
    }
    return { client: this.client, bucket: this.bucket };
  }

  presignUpload(storageKey: string, contentType: string, checksumSha256: string): Promise<string> {
    const { client, bucket } = this.require();
    return getSignedUrl(
      client,
      new PutObjectCommand({
        Bucket: bucket,
        Key: storageKey,
        ContentType: contentType,
        ChecksumSHA256: checksumSha256,
      }),
      { expiresIn: 300 },
    );
  }

  async download(storageKey: string): Promise<Uint8Array> {
    const { client, bucket } = this.require();
    const object = await client.send(new GetObjectCommand({ Bucket: bucket, Key: storageKey }));
    if (
      !object.Body ||
      object.ContentType !== 'application/pdf' ||
      object.ContentLength === undefined ||
      object.ContentLength > this.maxBytes
    ) {
      throw new Error('Resume object is missing or has an invalid content type');
    }
    return object.Body.transformToByteArray();
  }

  async inspect(
    storageKey: string,
  ): Promise<{ sizeBytes: bigint; contentType: string; checksumSha256: string }> {
    const { client, bucket } = this.require();
    const object = await client.send(
      new HeadObjectCommand({ Bucket: bucket, Key: storageKey, ChecksumMode: 'ENABLED' }),
    );
    if (object.ContentLength === undefined || !object.ContentType || !object.ChecksumSHA256) {
      throw new Error('Stored object metadata is incomplete');
    }
    return {
      sizeBytes: BigInt(object.ContentLength),
      contentType: object.ContentType,
      checksumSha256: object.ChecksumSHA256,
    };
  }
}
