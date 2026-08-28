import { ConfigService } from '@nestjs/config';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { SemanticService } from './semantic.service';

const chunks = [
  { label: 'Frontend', text: 'React accessibility' },
  { label: 'Backend', text: 'NestJS cache reliability' },
];

describe('SemanticService', () => {
  afterEach(() => vi.restoreAllMocks());

  it('uses the bounded Python ranking order when configured', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify([{ id: '1', score: 0.8 }]), { status: 200 }),
    );
    const service = new SemanticService({
      get: vi.fn(() => 'http://semantic:8000'),
    } as unknown as ConfigService);
    await expect(service.rank('backend reliability', chunks, 1)).resolves.toEqual([chunks[1]]);
  });

  it('falls back locally when the optional service is unavailable', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('offline'));
    const service = new SemanticService({
      get: vi.fn(() => 'http://semantic:8000'),
    } as unknown as ConfigService);
    await expect(service.rank('NestJS cache', chunks, 1)).resolves.toEqual([chunks[1]]);
  });
});
