import { describe, expect, it } from 'vitest';
import { validateConfig } from './config';

const storage = {
  S3_ENDPOINT: 'http://localhost:9000',
  S3_BUCKET: 'portfolio',
  S3_ACCESS_KEY: 'local',
  S3_SECRET_KEY: 'local-secret',
};

/** Everything a deployment needs before it has an object store. */
const withoutStorage = {
  DATABASE_URL: 'postgresql://root@localhost:26257/portfolio',
  REDIS_URL: 'redis://localhost:6379',
  WEB_ORIGIN: 'http://localhost:3000',
};

const valid = { ...withoutStorage, ...storage };
const managed = { MANAGEMENT_TOKEN: 'a-secure-management-token-with-32-chars' };

describe('validateConfig', () => {
  it('applies safe operational defaults', () => {
    expect(validateConfig(valid)).toMatchObject({
      PORT: 4000,
      RATE_LIMIT_PER_MINUTE: 60,
      DB_SLOW_QUERY_MS: 250,
      NODE_ENV: 'development',
      ENABLE_MUTATIONS: false,
      ENABLE_ASSET_MUTATIONS: false,
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
    expect(validateConfig({ ...valid, ...managed, ENABLE_MUTATIONS: 'true' })).toMatchObject({
      ENABLE_MUTATIONS: true,
    });
  });

  it('lets a deployment accept writes without an object store', () => {
    // The published API takes its measured quality from CI and never touches an
    // object. Requiring S3 credentials from every writable deployment made that
    // impossible to boot without an account it would never call.
    expect(
      validateConfig({ ...withoutStorage, ...managed, ENABLE_MUTATIONS: 'true' }),
    ).toMatchObject({ ENABLE_MUTATIONS: true, ENABLE_ASSET_MUTATIONS: false });
  });

  it('demands object storage from the one flag that reaches it', () => {
    expect(() =>
      validateConfig({
        ...withoutStorage,
        ...managed,
        ENABLE_MUTATIONS: 'true',
        ENABLE_ASSET_MUTATIONS: 'true',
      }),
    ).toThrow('S3_ENDPOINT');
  });

  it('refuses asset mutations without the mutation flag above them', () => {
    // Asset mutations are mutations. Enabling the narrow flag alone would read
    // as a working configuration while every call was refused a layer up.
    expect(() => validateConfig({ ...valid, ...managed, ENABLE_ASSET_MUTATIONS: 'true' })).toThrow(
      'ENABLE_MUTATIONS',
    );
  });
});
