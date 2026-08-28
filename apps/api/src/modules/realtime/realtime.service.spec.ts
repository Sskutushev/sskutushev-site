import { ConfigService } from '@nestjs/config';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PrismaService } from '../../database/prisma.service';
import { RealtimeService } from './realtime.service';

const redisInstances = vi.hoisted(() => [] as Array<ReturnType<typeof redisDouble>>);

function redisDouble() {
  return {
    status: 'wait',
    connect: vi.fn().mockImplementation(function (this: { status: string }) {
      this.status = 'ready';
      return Promise.resolve();
    }),
    subscribe: vi.fn().mockResolvedValue(1),
    publish: vi.fn().mockResolvedValue(1),
    on: vi.fn(),
    quit: vi.fn().mockResolvedValue('OK'),
  };
}

vi.mock('ioredis', () => ({
  default: vi.fn(() => {
    const instance = redisDouble();
    redisInstances.push(instance);
    return instance;
  }),
}));

describe('RealtimeService', () => {
  beforeEach(() => {
    redisInstances.length = 0;
    vi.clearAllMocks();
  });

  it('persists before publishing a public event', async () => {
    const createdAt = new Date('2026-08-28T10:00:00.000Z');
    const prisma = {
      systemEvent: {
        create: vi.fn().mockResolvedValue({
          id: 'event-1',
          type: 'QUALITY_IMPORTED',
          severity: 'INFO',
          publicPayload: { sha: 'abcdef1' },
          createdAt,
        }),
      },
    };
    const service = new RealtimeService(
      { getOrThrow: vi.fn(() => 'redis://localhost:6379') } as unknown as ConfigService,
      prisma as unknown as PrismaService,
    );

    await expect(
      service.record('QUALITY_IMPORTED', 'INFO', { sha: 'abcdef1' }),
    ).resolves.toMatchObject({ id: 'event-1', publicPayload: '{"sha":"abcdef1"}' });
    expect(prisma.systemEvent.create).toHaveBeenCalledOnce();
    expect(redisInstances[0]?.publish).toHaveBeenCalledOnce();
  });

  it('returns bounded persisted history newest first', async () => {
    const prisma = { systemEvent: { findMany: vi.fn().mockResolvedValue([]) } };
    const service = new RealtimeService(
      { getOrThrow: vi.fn(() => 'redis://localhost:6379') } as unknown as ConfigService,
      prisma as unknown as PrismaService,
    );
    await service.recent(500);
    expect(prisma.systemEvent.findMany).toHaveBeenCalledWith({
      take: 100,
      orderBy: { createdAt: 'desc' },
    });
  });
});
