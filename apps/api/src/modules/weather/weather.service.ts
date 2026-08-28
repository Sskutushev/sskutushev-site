import { Injectable } from '@nestjs/common';
import { CacheService } from '../../cache/cache.service';
import { AmbientWeather } from './weather.models';

const condition = (code: number): string => {
  if (code === 0) return 'Clear';
  if (code <= 3) return 'Cloudy';
  if (code <= 48) return 'Fog';
  if (code <= 67) return 'Rain';
  if (code <= 77) return 'Snow';
  if (code <= 82) return 'Showers';
  return 'Storm';
};

@Injectable()
export class WeatherService {
  constructor(private readonly cache: CacheService) {}

  async current(): Promise<AmbientWeather | null> {
    try {
      const result = await this.cache.getOrLoad('weather:spb', 30 * 60, 2 * 60 * 60, () =>
        this.load(),
      );
      return { ...result.value, stale: result.stale };
    } catch {
      return null;
    }
  }

  private async load(): Promise<Omit<AmbientWeather, 'stale'>> {
    const endpoint = new URL('https://api.open-meteo.com/v1/forecast');
    endpoint.search = new URLSearchParams({
      latitude: '59.9386',
      longitude: '30.3141',
      current: 'temperature_2m,weather_code',
      timezone: 'Europe/Moscow',
    }).toString();
    const response = await fetch(endpoint, { signal: AbortSignal.timeout(3000) });
    if (!response.ok) throw new Error(`Open-Meteo returned ${response.status}`);
    const payload = (await response.json()) as {
      current?: { temperature_2m?: unknown; weather_code?: unknown; time?: unknown };
    };
    const current = payload.current;
    if (
      typeof current?.temperature_2m !== 'number' ||
      typeof current.weather_code !== 'number' ||
      typeof current.time !== 'string'
    ) {
      throw new Error('Open-Meteo returned an invalid contract');
    }
    return {
      city: 'SPB',
      temperatureC: current.temperature_2m,
      condition: condition(current.weather_code),
      observedAt: new Date(current.time),
    };
  }
}
