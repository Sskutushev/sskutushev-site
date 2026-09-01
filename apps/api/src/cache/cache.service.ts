import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

type Envelope<T> = { value: T; freshUntil: number; staleUntil: number };

/**
 * Exactly what `Date.prototype.toJSON` produces, and nothing looser.
 *
 * The pattern is narrow on purpose. A reviver that accepted anything
 * date-shaped would turn genuine strings into dates on the way out of the
 * cache, which is a subtler version of the bug it exists to fix.
 */
const SERIALISED_DATE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

/**
 * Put back the one type JSON cannot carry.
 *
 * `JSON.stringify` turns every `Date` into a string, so a value read back from
 * Redis is not the value that was written — and the cast below said it was.
 * On a cache miss the GraphQL layer received real dates and served them; on a
 * hit it received strings, and `DateTime.serialize` refuses a string, so the
 * whole field resolved to an error. That failed only with a warm cache, which
 * is why it reached production: nothing in CI ever asked for a cached date
 * twice.
 *
 * The cache is what erased the type, so the cache is what restores it.
 */
function reviveDates(_key: string, value: unknown): unknown {
  return typeof value === 'string' && SERIALISED_DATE.test(value) ? new Date(value) : value;
}

@Injectable()
export class CacheService implements OnModuleDestroy {
  private readonly redis: Redis;
  private readonly pending = new Map<string, Promise<unknown>>();

  constructor(config: ConfigService) {
    this.redis = new Redis(config.getOrThrow<string>('REDIS_URL'), {
      lazyConnect: true,
      maxRetriesPerRequest: 1,
      enableOfflineQueue: false,
    });
  }

  async getOrLoad<T>(
    key: string,
    freshSeconds: number,
    staleSeconds: number,
    load: () => Promise<T>,
  ): Promise<{ value: T; stale: boolean }> {
    const cached = await this.read<T>(key);
    const now = Date.now();
    if (cached && cached.freshUntil > now) return { value: cached.value, stale: false };

    try {
      const value = await this.deduplicate(key, load);
      await this.write(key, value, freshSeconds, staleSeconds);
      return { value, stale: false };
    } catch (error: unknown) {
      if (cached && cached.staleUntil > now) return { value: cached.value, stale: true };
      throw error;
    }
  }

  async ping(): Promise<boolean> {
    try {
      if (this.redis.status === 'wait') await this.redis.connect();
      await this.redis.ping();
      return true;
    } catch {
      return false;
    }
  }

  async delete(...keys: string[]): Promise<void> {
    if (!keys.length) return;
    try {
      if (this.redis.status === 'wait') await this.redis.connect();
      await this.redis.del(...keys);
    } catch {
      // Cache invalidation is best-effort; versioned database reads remain authoritative.
    }
  }

  async consumeLimit(key: string, limit: number, windowSeconds: number): Promise<boolean> {
    try {
      if (this.redis.status === 'wait') await this.redis.connect();
      const count = await this.redis.eval(
        "local n=redis.call('INCR',KEYS[1]); if n==1 then redis.call('EXPIRE',KEYS[1],ARGV[1]) end; return n",
        1,
        key,
        windowSeconds,
      );
      return Number(count) <= limit;
    } catch {
      // Rate-limit storage failure must not turn Redis into an API availability dependency.
      return true;
    }
  }

  onModuleDestroy(): void {
    if (this.redis.status !== 'end') this.redis.disconnect();
  }

  private async read<T>(key: string): Promise<Envelope<T> | null> {
    try {
      if (this.redis.status === 'wait') await this.redis.connect();
      const raw = await this.redis.get(key);
      return raw ? (JSON.parse(raw, reviveDates) as Envelope<T>) : null;
    } catch {
      return null;
    }
  }

  private async write<T>(key: string, value: T, fresh: number, stale: number): Promise<void> {
    try {
      const now = Date.now();
      const envelope: Envelope<T> = {
        value,
        freshUntil: now + fresh * 1000,
        staleUntil: now + stale * 1000,
      };
      await this.redis.set(key, JSON.stringify(envelope), 'EX', stale);
    } catch {
      // Cache availability must not become portfolio availability.
    }
  }

  private async deduplicate<T>(key: string, load: () => Promise<T>): Promise<T> {
    const existing = this.pending.get(key) as Promise<T> | undefined;
    if (existing) return existing;
    const request = load().finally(() => this.pending.delete(key));
    this.pending.set(key, request);
    return request;
  }
}
