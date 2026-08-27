import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Queue, Worker } from 'bullmq';
import { GithubService } from './github.service';

@Injectable()
export class GithubSyncService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(GithubSyncService.name);
  private queue: Queue | undefined;
  private worker: Worker | undefined;

  constructor(
    private readonly config: ConfigService,
    private readonly github: GithubService,
  ) {}

  async onModuleInit(): Promise<void> {
    if (!this.config.get<boolean>('ENABLE_WORKERS')) return;
    try {
      const redis = new URL(this.config.getOrThrow<string>('REDIS_URL'));
      const connection = {
        host: redis.hostname,
        port: Number(redis.port || 6379),
        ...(redis.password ? { password: redis.password } : {}),
      };
      this.queue = new Queue('github-activity', { connection });
      this.worker = new Worker('github-activity', () => this.github.sync(), { connection });
      this.worker.on('error', (error) => this.logger.error('GitHub refresh worker failed', error));
      await this.queue.add(
        'refresh',
        {},
        { jobId: 'github-activity-refresh', repeat: { every: 15 * 60 * 1000 } },
      );
    } catch (error: unknown) {
      this.logger.error(
        'GitHub refresh worker could not start; public reads remain available',
        error,
      );
      await this.close();
    }
  }

  async onModuleDestroy(): Promise<void> {
    await this.close();
  }

  private async close(): Promise<void> {
    const closing: Promise<void>[] = [];
    if (this.worker) closing.push(this.worker.close());
    if (this.queue) closing.push(this.queue.close());
    this.worker = undefined;
    this.queue = undefined;
    await Promise.allSettled(closing);
  }
}
