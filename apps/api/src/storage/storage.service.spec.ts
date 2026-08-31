import type { ConfigService } from '@nestjs/config';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { StorageService } from './storage.service';

const aws = vi.hoisted(() => ({
  send: vi.fn(),
  getSignedUrl: vi.fn<(client: unknown, command: unknown, options: unknown) => Promise<string>>(),
  putInputs: [] as unknown[],
  getInputs: [] as unknown[],
  signedOptions: [] as unknown[],
}));

vi.mock('@aws-sdk/client-s3', () => ({
  S3Client: vi.fn(() => ({ send: aws.send })),
  PutObjectCommand: class {
    constructor(readonly input: unknown) {
      aws.putInputs.push(input);
    }
  },
  GetObjectCommand: class {
    constructor(readonly input: unknown) {
      aws.getInputs.push(input);
    }
  },
  HeadObjectCommand: class {
    constructor(readonly input: unknown) {}
  },
}));
vi.mock('@aws-sdk/s3-request-presigner', () => ({
  getSignedUrl: (client: unknown, command: unknown, options: unknown) => {
    aws.signedOptions.push(options);
    return aws.getSignedUrl(client, command, options);
  },
}));

const values: Record<string, unknown> = {
  S3_BUCKET: 'portfolio',
  S3_ENDPOINT: 'http://localhost:9000',
  S3_REGION: 'us-east-1',
  S3_ACCESS_KEY: 'access',
  S3_SECRET_KEY: 'secret',
  ASSET_MAX_BYTES: 10_485_760,
};

const config = {
  get: (key: string) => values[key],
  getOrThrow: (key: string) => values[key],
} as ConfigService;

/** A deployment with mutations off, which is how the published API runs. */
const unconfigured = {
  get: (key: string) => (key === 'S3_REGION' ? 'us-east-1' : undefined),
  getOrThrow: (key: string) => values[key],
} as ConfigService;

describe('StorageService', () => {
  beforeEach(() => vi.clearAllMocks());

  it('refuses in the open when no store is configured', async () => {
    const storage = new StorageService(unconfigured);

    expect(storage.available).toBe(false);
    // Refusing beats returning nothing: an unconfigured store that answers
    // emptily is the false fallback this codebase argues against everywhere.
    await expect(storage.download('resume/file.pdf')).rejects.toThrow(/not configured/i);
    await expect(storage.inspect('resume/file.pdf')).rejects.toThrow(/not configured/i);
    expect(() => storage.presignUpload('a', 'application/pdf', 'c=')).toThrow(/not configured/i);
    expect(aws.send).not.toHaveBeenCalled();
  });

  it('creates a short-lived upload URL with an explicit content type', async () => {
    aws.getSignedUrl.mockResolvedValue('https://storage.example/upload');
    const storage = new StorageService(config);

    await expect(
      storage.presignUpload('resume/file.pdf', 'application/pdf', 'checksum='),
    ).resolves.toBe('https://storage.example/upload');
    expect(aws.getSignedUrl).toHaveBeenCalledOnce();
    expect(aws.putInputs.at(-1)).toEqual({
      Bucket: 'portfolio',
      Key: 'resume/file.pdf',
      ContentType: 'application/pdf',
      ChecksumSHA256: 'checksum=',
    });
    expect(aws.signedOptions.at(-1)).toEqual({ expiresIn: 300 });
  });

  it('downloads only a valid PDF object', async () => {
    const transformToByteArray = vi.fn().mockResolvedValue(new Uint8Array([1, 2, 3]));
    aws.send.mockResolvedValue({
      Body: { transformToByteArray },
      ContentType: 'application/pdf',
      ContentLength: 3,
    });
    const storage = new StorageService(config);

    await expect(storage.download('public/resume.pdf')).resolves.toEqual(new Uint8Array([1, 2, 3]));
    expect(aws.getInputs.at(-1)).toEqual({
      Bucket: 'portfolio',
      Key: 'public/resume.pdf',
    });
    expect(transformToByteArray).toHaveBeenCalledOnce();
  });

  it('refuses an oversized public object before buffering it', async () => {
    const transformToByteArray = vi.fn();
    aws.send.mockResolvedValue({
      Body: { transformToByteArray },
      ContentType: 'application/pdf',
      ContentLength: 10_485_761,
    });
    const storage = new StorageService(config);

    await expect(storage.download('public/resume.pdf')).rejects.toThrow(
      'Resume object is missing or has an invalid content type',
    );
    expect(transformToByteArray).not.toHaveBeenCalled();
  });

  it('fails closed when object metadata is incomplete', async () => {
    aws.send.mockResolvedValue({ ContentLength: 42 });
    const storage = new StorageService(config);

    await expect(storage.inspect('broken-object')).rejects.toThrow(
      'Stored object metadata is incomplete',
    );
  });
});
