import { ConfigService } from '@nestjs/config';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CacheService } from './cache.service';

const redis = vi.hoisted(() => ({
  status: 'ready',
  connect: vi.fn(),
  disconnect: vi.fn(),
  get: vi.fn(),
  set: vi.fn(),
  ping: vi.fn(),
}));

vi.mock('ioredis', () => ({ default: vi.fn(() => redis) }));

describe('CacheService', () => {
  let cache: CacheService;

  beforeEach(() => {
    vi.clearAllMocks();
    redis.status = 'ready';
    redis.get.mockResolvedValue(null);
    redis.set.mockResolvedValue('OK');
    cache = new CacheService({
      getOrThrow: () => 'redis://localhost:6379',
    } as unknown as ConfigService);
  });

  it('deduplicates concurrent cache misses', async () => {
    let resolve!: (value: string) => void;
    const loader = vi.fn(() => new Promise<string>((done) => (resolve = done)));

    const first = cache.getOrLoad('profile', 30, 60, loader);
    const second = cache.getOrLoad('profile', 30, 60, loader);
    await vi.waitFor(() => expect(loader).toHaveBeenCalledOnce());
    resolve('verified');

    await expect(Promise.all([first, second])).resolves.toEqual([
      { value: 'verified', stale: false },
      { value: 'verified', stale: false },
    ]);
  });

  it('serves stale data when the loader fails', async () => {
    redis.get.mockResolvedValue(
      JSON.stringify({ value: 'last-known-good', freshUntil: 0, staleUntil: Date.now() + 60_000 }),
    );

    await expect(
      cache.getOrLoad('profile', 30, 60, () => Promise.reject(new Error('database offline'))),
    ).resolves.toEqual({ value: 'last-known-good', stale: true });
  });
});
