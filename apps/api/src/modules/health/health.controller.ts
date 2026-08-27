import { Controller, Get, ServiceUnavailableException } from '@nestjs/common';
import { CacheService } from '../../cache/cache.service';
import { PrismaService } from '../../database/prisma.service';

@Controller('health')
export class HealthController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cache: CacheService,
  ) {}

  @Get('live')
  live(): { status: string } {
    return { status: 'ok' };
  }

  @Get('ready')
  async ready(): Promise<{ status: string; dependencies: Record<string, string> }> {
    const [database, redis] = await Promise.all([
      this.prisma.$queryRaw`SELECT 1`.then(() => true).catch(() => false),
      this.cache.ping(),
    ]);
    if (!database || !redis)
      throw new ServiceUnavailableException('Required dependency unavailable');
    return { status: 'ready', dependencies: { database: 'up', redis: 'up' } };
  }
}
