import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Prisma } from '@prisma/client';
import Redis from 'ioredis';
import { PrismaService } from '../../database/prisma.service';
import type { SystemEventModel } from './realtime.models';

const channel = 'system-events:v1';

@Injectable()
export class RealtimeService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RealtimeService.name);
  private readonly publisher: Redis;
  private readonly subscriber: Redis;
  private readonly listeners = new Set<(event: SystemEventModel) => void>();

  constructor(
    config: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    const url = config.getOrThrow<string>('REDIS_URL');
    const options = { lazyConnect: true, maxRetriesPerRequest: 1, enableOfflineQueue: false };
    this.publisher = new Redis(url, options);
    this.subscriber = new Redis(url, options);
  }

  async onModuleInit(): Promise<void> {
    try {
      await this.subscriber.connect();
      await this.subscriber.subscribe(channel);
      this.subscriber.on('message', (_channel, payload) => this.dispatch(payload));
    } catch (error: unknown) {
      this.logger.warn(
        'Realtime fanout unavailable; persisted event reads remain available',
        error,
      );
    }
  }

  async recent(limit = 20): Promise<SystemEventModel[]> {
    const events = await this.prisma.systemEvent.findMany({
      take: Math.min(Math.max(limit, 1), 100),
      orderBy: { createdAt: 'desc' },
    });
    return events.map((event) => this.toModel(event));
  }

  async record(
    type: string,
    severity: string,
    publicPayload: Prisma.InputJsonObject,
  ): Promise<SystemEventModel> {
    const event = await this.prisma.systemEvent.create({
      data: { type, severity, publicPayload },
    });
    const model = this.toModel(event);
    try {
      if (this.publisher.status === 'wait') await this.publisher.connect();
      await this.publisher.publish(channel, JSON.stringify(model));
    } catch (error: unknown) {
      this.logger.warn('System event persisted but realtime publish failed', error);
    }
    return model;
  }

  events(): AsyncIterable<SystemEventModel> {
    const queue: SystemEventModel[] = [];
    let wake: (() => void) | undefined;
    const listener = (event: SystemEventModel) => {
      queue.push(event);
      wake?.();
      wake = undefined;
    };
    this.listeners.add(listener);
    const listeners = this.listeners;
    return {
      [Symbol.asyncIterator]() {
        return {
          async next() {
            while (!queue.length) await new Promise<void>((resolve) => (wake = resolve));
            return { value: queue.shift()!, done: false };
          },
          return() {
            listeners.delete(listener);
            return Promise.resolve({ value: undefined, done: true });
          },
        };
      },
    };
  }

  async onModuleDestroy(): Promise<void> {
    await Promise.allSettled([this.publisher.quit(), this.subscriber.quit()]);
  }

  private dispatch(payload: string): void {
    try {
      const parsed = JSON.parse(payload) as SystemEventModel;
      parsed.createdAt = new Date(parsed.createdAt);
      for (const listener of this.listeners) listener(parsed);
    } catch (error: unknown) {
      this.logger.warn('Ignored malformed realtime event', error);
    }
  }

  private toModel(event: {
    id: string;
    type: string;
    severity: string;
    publicPayload: Prisma.JsonValue;
    createdAt: Date;
  }): SystemEventModel {
    return { ...event, publicPayload: JSON.stringify(event.publicPayload) };
  }
}
