import { BadRequestException } from '@nestjs/common';
import { describe, expect, it, vi } from 'vitest';
import type { PrismaService } from '../database/prisma.service';
import { VitalsController } from './vitals.controller';

describe('VitalsController', () => {
  it('stores only bounded non-identifying performance data', async () => {
    const create = vi.fn().mockResolvedValue({ id: 'snapshot' });
    const controller = new VitalsController({
      performanceSnapshot: { create },
    } as unknown as PrismaService);

    await expect(
      controller.record({ name: 'LCP', value: 1234.5, rating: 'good', navigationType: 'navigate' }),
    ).resolves.toEqual({ accepted: true });
    expect(create).toHaveBeenCalledWith({
      data: { metric: 'LCP', value: 1234.5, rating: 'good', navigationType: 'navigate' },
      select: { id: true },
    });
  });

  it('rejects unknown metrics and non-finite values', async () => {
    const controller = new VitalsController({} as PrismaService);
    await expect(
      controller.record({ name: 'FPS', value: Number.NaN, rating: 'good' }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
