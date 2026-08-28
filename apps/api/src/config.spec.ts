import { describe, expect, it } from 'vitest';
import { validateConfig } from './config';

const valid = {
  DATABASE_URL: 'postgresql://root@localhost:26257/portfolio',
  REDIS_URL: 'redis://localhost:6379',
  S3_ENDPOINT: 'http://localhost:9000',
  S3_BUCKET: 'portfolio',
  S3_ACCESS_KEY: 'local',
  S3_SECRET_KEY: 'local-secret',
  WEB_ORIGIN: 'http://localhost:3000',
};

describe('validateConfig', () => {
  it('applies safe operational defaults', () => {
    expect(validateConfig(valid)).toMatchObject({
      PORT: 4000,
      RATE_LIMIT_PER_MINUTE: 60,
      NODE_ENV: 'development',
      ENABLE_MUTATIONS: false,
      ENABLE_WORKERS: false,
      ASSET_MAX_BYTES: 10_485_760,
    });
  });

  it('fails closed when a required dependency is missing', () => {
    expect(() => validateConfig({ ...valid, DATABASE_URL: undefined })).toThrow();
  });

  it('requires a management credential whenever mutations are enabled', () => {
    expect(() => validateConfig({ ...valid, ENABLE_MUTATIONS: 'true' })).toThrow(
      'MANAGEMENT_TOKEN',
    );
    expect(
      validateConfig({
        ...valid,
        ENABLE_MUTATIONS: 'true',
        MANAGEMENT_TOKEN: 'a-secure-management-token-with-32-chars',
      }),
    ).toMatchObject({ ENABLE_MUTATIONS: true });
  });
});
