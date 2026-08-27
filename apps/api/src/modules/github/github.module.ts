import { Module } from '@nestjs/common';
import { CacheModule } from '../../cache/cache.module';
import { GithubAdapter } from './github.adapter';
import { GithubResolver } from './github.resolver';
import { GithubService } from './github.service';
import { GithubSyncService } from './github-sync.service';

@Module({
  imports: [CacheModule],
  providers: [GithubAdapter, GithubService, GithubSyncService, GithubResolver],
})
export class GithubModule {}
