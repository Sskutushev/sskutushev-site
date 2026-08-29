import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
import type { AppConfig } from '../config';

type QueryEvent = { duration: number; query: string; target: string };
type QueryEmitter = { $on(event: 'query', listener: (event: QueryEvent) => void): void };

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);
  private readonly slowQueryMs: number;

  constructor(config: ConfigService<AppConfig, true>) {
    super({ log: [{ emit: 'event', level: 'query' }] });
    this.slowQueryMs = config.getOrThrow<number>('DB_SLOW_QUERY_MS');
    (this as unknown as QueryEmitter).$on('query', (event) => this.observeQuery(event));
  }

  async onModuleInit(): Promise<void> {
    await this.$connect();
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }

  observeQuery(event: QueryEvent): void {
    if (event.duration < this.slowQueryMs) return;
    this.logger.warn({
      event: 'database.slow_query',
      durationMs: event.duration,
      target: event.target,
      statement: event.query.replace(/\s+/g, ' ').trim().slice(0, 500),
    });
  }
}
