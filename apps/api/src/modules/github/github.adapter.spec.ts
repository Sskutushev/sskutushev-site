import type { ConfigService } from '@nestjs/config';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { GithubAdapter } from './github.adapter';

const config = { get: vi.fn(() => 'secret-token') } as unknown as ConfigService;

describe('GithubAdapter', () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('maps public repositories, removes forks and limits the result', async () => {
    const repositories = Array.from({ length: 8 }, (_, index) => ({
      name: `repository-${index}`,
      html_url: `https://github.com/Sskutushev/repository-${index}`,
      stargazers_count: index,
      forks_count: index + 1,
      open_issues_count: index + 2,
      pushed_at: index === 0 ? null : '2026-08-27T10:00:00.000Z',
      fork: index === 1,
    }));
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValue(Response.json(repositories, { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);

    const result = await new GithubAdapter(config).repositories('Sskutushev');

    expect(result).toHaveLength(6);
    expect(result[0]).toEqual({
      name: 'repository-0',
      url: 'https://github.com/Sskutushev/repository-0',
      stars: 0,
      forks: 1,
      openIssues: 2,
      pushedAt: null,
    });
    expect(result.some(({ name }) => name === 'repository-1')).toBe(false);
    const [url, init] = fetchMock.mock.calls[0] ?? [];
    expect(url).toEqual(expect.stringContaining('/users/Sskutushev/repos'));
    expect(new Headers(init?.headers).get('Authorization')).toBe('Bearer secret-token');
  });

  it('surfaces provider failures', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn<typeof fetch>().mockResolvedValue(new Response(null, { status: 503 })),
    );
    await expect(new GithubAdapter(config).repositories('Sskutushev')).rejects.toThrow(
      'GitHub API returned 503',
    );
  });

  it('aborts a request after six seconds', async () => {
    vi.useFakeTimers();
    vi.stubGlobal(
      'fetch',
      vi.fn<typeof fetch>(
        (_url: string | URL | Request, init?: RequestInit) =>
          new Promise<Response>((_resolve, reject) => {
            init?.signal?.addEventListener('abort', () =>
              reject(new DOMException('Aborted', 'AbortError')),
            );
          }),
      ),
    );

    const request = new GithubAdapter(config).repositories('Sskutushev');
    const expectation = expect(request).rejects.toMatchObject({ name: 'AbortError' });
    await vi.advanceTimersByTimeAsync(6000);
    await expectation;
  });
});
