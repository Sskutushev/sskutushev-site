import type { ConfigService } from '@nestjs/config';
import { describe, expect, it, vi } from 'vitest';
import type { CacheService } from '../../cache/cache.service';
import type { PrismaService } from '../../database/prisma.service';
import type { GithubAdapter } from './github.adapter';
import { GithubService } from './github.service';

const repository = {
  name: 'portfolio',
  url: 'https://github.com/Sskutushev/portfolio',
  stars: 7,
  forks: 2,
  openIssues: 1,
  pushedAt: new Date('2026-08-26T10:00:00.000Z'),
};

function createService() {
  const adapter = { repositories: vi.fn().mockResolvedValue([repository]) };
  const cache = { getOrLoad: vi.fn() };
  const prisma = { githubSnapshot: { createMany: vi.fn().mockResolvedValue({ count: 1 }) } };
  const service = new GithubService(
    { getOrThrow: () => 'Sskutushev' } as unknown as ConfigService,
    adapter as unknown as GithubAdapter,
    cache as unknown as CacheService,
    prisma as unknown as PrismaService,
  );
  return { service, adapter, cache, prisma };
}

describe('GithubService', () => {
  it('persists a mapped snapshot after a successful refresh', async () => {
    const { service, prisma } = createService();
    const result = await service.sync();

    expect(result).toMatchObject({ owner: 'Sskutushev', repositories: [repository] });
    expect(prisma.githubSnapshot.createMany).toHaveBeenCalledWith({
      data: [
        expect.objectContaining({
          owner: 'Sskutushev',
          repository: 'portfolio',
          stars: 7,
          forks: 2,
          openIssues: 1,
        }),
      ],
    });
  });

  it('does not persist an empty provider response', async () => {
    const { service, adapter, prisma } = createService();
    adapter.repositories.mockResolvedValue([]);
    await expect(service.sync()).resolves.toMatchObject({ repositories: [] });
    expect(prisma.githubSnapshot.createMany).not.toHaveBeenCalled();
  });

  it('exposes the cache stale state while preserving the snapshot', async () => {
    const { service, cache } = createService();
    const capturedAt = new Date('2026-08-27T10:00:00.000Z');
    cache.getOrLoad.mockResolvedValue({
      value: { owner: 'Sskutushev', repositories: [repository], capturedAt },
      stale: true,
    });

    await expect(service.activity()).resolves.toEqual({
      owner: 'Sskutushev',
      repositories: [repository],
      capturedAt,
      stale: true,
    });
  });
});
