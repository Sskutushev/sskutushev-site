import { describe, expect, it, vi } from 'vitest';
import type { CacheService } from '../../cache/cache.service';
import { WeatherService } from './weather.service';

describe('WeatherService', () => {
  it('uses a 30 minute cache and preserves its stale signal', async () => {
    const getOrLoad = vi.fn().mockResolvedValue({
      value: { city: 'SPB', temperatureC: 13, condition: 'Cloudy', observedAt: new Date(0) },
      stale: true,
    });
    const service = new WeatherService({ getOrLoad } as unknown as CacheService);

    await expect(service.current()).resolves.toMatchObject({ city: 'SPB', stale: true });
    expect(getOrLoad).toHaveBeenCalledWith('weather:spb', 1800, 7200, expect.any(Function));
  });

  it('never makes weather an availability dependency', async () => {
    const service = new WeatherService({
      getOrLoad: vi.fn().mockRejectedValue(new Error('offline')),
    } as unknown as CacheService);
    await expect(service.current()).resolves.toBeNull();
  });
});
