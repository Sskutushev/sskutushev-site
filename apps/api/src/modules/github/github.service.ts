import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CacheService } from '../../cache/cache.service';
import { PrismaService } from '../../database/prisma.service';
import { GithubAdapter, type GithubRepository } from './github.adapter';
import type { GithubActivityModel } from './github.models';

type ActivitySnapshot = Omit<GithubActivityModel, 'stale'>;

@Injectable()
export class GithubService {
  private readonly owner: string;

  constructor(
    config: ConfigService,
    private readonly adapter: GithubAdapter,
    private readonly cache: CacheService,
    private readonly prisma: PrismaService,
  ) {
    this.owner = config.getOrThrow<string>('GITHUB_OWNER');
  }

  async activity(): Promise<GithubActivityModel> {
    const result = await this.cache.getOrLoad('github:activity:v1', 300, 3600, () => this.sync());
    return { ...result.value, stale: result.stale };
  }

  async sync(): Promise<ActivitySnapshot> {
    const repositories = await this.adapter.repositories(this.owner);
    const capturedAt = new Date();
    if (repositories.length) {
      await this.prisma.githubSnapshot.createMany({
        data: repositories.map((repository) => this.toSnapshot(repository, capturedAt)),
      });
    }
    return { owner: this.owner, repositories, capturedAt };
  }

  private toSnapshot(repository: GithubRepository, capturedAt: Date) {
    return {
      owner: this.owner,
      repository: repository.name,
      stars: repository.stars,
      forks: repository.forks,
      openIssues: repository.openIssues,
      pushedAt: repository.pushedAt,
      capturedAt,
    };
  }
}
