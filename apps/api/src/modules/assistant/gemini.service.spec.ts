import { afterEach, describe, expect, it, vi } from 'vitest';
import { GeminiService } from './gemini.service';

const config = (key?: string) => ({
  get: (name: string): string | undefined =>
    name === 'GEMINI_API_KEY' ? key : name === 'GEMINI_MODEL' ? 'test-model' : undefined,
});

describe('GeminiService', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('does not call the provider without a server-side key', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    const service = new GeminiService(config() as never);
    await expect(
      service.answer('question', [{ label: 'Profile', text: 'fact' }], 'EN'),
    ).resolves.toBeNull();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('extracts text from a successful grounded response', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve({ candidates: [{ content: { parts: [{ text: 'Grounded answer' }] } }] }),
      }),
    );
    const service = new GeminiService(config('test-secret-key-that-is-long-enough') as never);
    await expect(
      service.answer('question', [{ label: 'Profile', text: 'fact' }], 'EN'),
    ).resolves.toBe('Grounded answer');
  });
});
