import {
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class StorageService {
  private readonly client: S3Client;
  private readonly bucket: string;
  private readonly maxBytes: number;

  constructor(config: ConfigService) {
    this.bucket = config.getOrThrow<string>('S3_BUCKET');
    this.maxBytes = config.getOrThrow<number>('ASSET_MAX_BYTES');
    const common = {
      region: config.getOrThrow<string>('S3_REGION'),
      forcePathStyle: true,
      credentials: {
        accessKeyId: config.getOrThrow<string>('S3_ACCESS_KEY'),
        secretAccessKey: config.getOrThrow<string>('S3_SECRET_KEY'),
      },
    };
    this.client = new S3Client({
      endpoint: config.getOrThrow<string>('S3_ENDPOINT'),
      ...common,
    });
  }

  presignUpload(storageKey: string, contentType: string, checksumSha256: string): Promise<string> {
    return getSignedUrl(
      this.client,
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: storageKey,
        ContentType: contentType,
        ChecksumSHA256: checksumSha256,
      }),
      { expiresIn: 300 },
    );
  }

  async download(storageKey: string): Promise<Uint8Array> {
    const object = await this.client.send(
      new GetObjectCommand({ Bucket: this.bucket, Key: storageKey }),
    );
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
    const object = await this.client.send(
      new HeadObjectCommand({ Bucket: this.bucket, Key: storageKey, ChecksumMode: 'ENABLED' }),
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
