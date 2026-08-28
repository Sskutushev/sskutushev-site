import { BadRequestException, Body, Controller, HttpCode, Post } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

const metrics = new Set(['LCP', 'INP', 'CLS', 'TTFB']);
const ratings = new Set(['good', 'needs-improvement', 'poor']);

interface VitalPayload {
  name?: unknown;
  value?: unknown;
  rating?: unknown;
  navigationType?: unknown;
}

@Controller('telemetry')
export class VitalsController {
  constructor(private readonly prisma: PrismaService) {}

  @Post('vitals')
  @HttpCode(202)
  async record(@Body() payload: VitalPayload): Promise<{ accepted: true }> {
    if (
      typeof payload.name !== 'string' ||
      !metrics.has(payload.name) ||
      typeof payload.value !== 'number' ||
      !Number.isFinite(payload.value) ||
      payload.value < 0 ||
      typeof payload.rating !== 'string' ||
      !ratings.has(payload.rating) ||
      (payload.navigationType !== undefined &&
        (typeof payload.navigationType !== 'string' || payload.navigationType.length > 32))
    ) {
      throw new BadRequestException('Invalid Web Vital payload');
    }

    await this.prisma.performanceSnapshot.create({
      data: {
        metric: payload.name,
        value: payload.value,
        rating: payload.rating,
        navigationType: payload.navigationType ?? null,
      },
      select: { id: true },
    });
    return { accepted: true };
  }
}
