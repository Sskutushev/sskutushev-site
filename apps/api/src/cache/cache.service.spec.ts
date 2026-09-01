import type { ConfigService } from '@nestjs/config';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CacheService } from './cache.service';

const redis = vi.hoisted(() => ({
  status: 'ready',
  connect: vi.fn(),
  disconnect: vi.fn(),
  get: vi.fn(),
  set: vi.fn(),
  del: vi.fn(),
  ping: vi.fn(),
  eval: vi.fn(),
}));

vi.mock('ioredis', () => ({ default: vi.fn(() => redis) }));

describe('CacheService', () => {
  let cache: CacheService;

  beforeEach(() => {
    vi.clearAllMocks();
    redis.status = 'ready';
    redis.get.mockResolvedValue(null);
    redis.set.mockResolvedValue('OK');
    redis.del.mockResolvedValue(1);
    redis.eval.mockResolvedValue(1);
    cache = new CacheService({
      getOrThrow: () => 'redis://localhost:6379',
    } as unknown as ConfigService);
  });

  it('enforces an atomic Redis-backed request limit and fails open on Redis failure', async () => {
    redis.eval.mockResolvedValueOnce(61);
    await expect(cache.consumeLimit('rate:client', 60, 60)).resolves.toBe(false);

    redis.eval.mockRejectedValueOnce(new Error('redis offline'));
    await expect(cache.consumeLimit('rate:client', 60, 60)).resolves.toBe(true);
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

  it('gives back the dates it was given, not the strings JSON made of them', async () => {
    // The failure this pins reached production. `JSON.stringify` turns a Date
    // into a string, so a warm cache handed the GraphQL layer a string where
    // the schema promised a DateTime, and the field resolved to an error
    // instead of a value. A cold cache never showed it: the loader's own Date
    // went straight through.
    const observedAt = new Date('2026-09-01T13:15:00.000Z');
    await cache.getOrLoad('weather', 30, 60, () => Promise.resolve({ city: 'SPB', observedAt }));
    const written = JSON.parse(redis.set.mock.calls[0]![1] as string) as { value: unknown };
    expect(written).toMatchObject({ value: { observedAt: '2026-09-01T13:15:00.000Z' } });

    redis.get.mockResolvedValue(
      JSON.stringify({ value: { city: 'SPB', observedAt }, freshUntil: Date.now() + 60_000 }),
    );
    const { value } = await cache.getOrLoad('weather', 30, 60, () => {
      throw new Error('the cache should have answered');
    });
    expect((value as { observedAt: unknown }).observedAt).toBeInstanceOf(Date);
    expect((value as { observedAt: Date }).observedAt.toISOString()).toBe(
      '2026-09-01T13:15:00.000Z',
    );
    // A string is not promoted just for looking like a timestamp in passing.
    expect((value as { city: unknown }).city).toBe('SPB');
  });

  it('leaves a string that is merely date-shaped alone', async () => {
    redis.get.mockResolvedValue(
      JSON.stringify({
        value: { period: '2026-09-01', label: '2026-09-01T13:15:00Z' },
        freshUntil: Date.now() + 60_000,
      }),
    );
    const { value } = await cache.getOrLoad('shape', 30, 60, () => {
      throw new Error('the cache should have answered');
    });
    // Neither is what `Date.prototype.toJSON` writes, so neither is a date the
    // cache put there, and reviving them would be the same class of mistake in
    // the other direction.
    expect(value).toEqual({ period: '2026-09-01', label: '2026-09-01T13:15:00Z' });
  });

  it('invalidates multiple cache keys without failing the write path', async () => {
    await cache.delete('portfolio:v2:ru', 'portfolio:v2:en');
    expect(redis.del).toHaveBeenCalledWith('portfolio:v2:ru', 'portfolio:v2:en');

    redis.del.mockRejectedValueOnce(new Error('redis offline'));
    await expect(cache.delete('portfolio:v2:ru')).resolves.toBeUndefined();
  });
});
