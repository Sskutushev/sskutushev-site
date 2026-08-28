import { Logger } from '@nestjs/common';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { PrismaService } from './prisma.service';

describe('PrismaService slow-query telemetry', () => {
  const config = { getOrThrow: () => 250 };

  afterEach(() => vi.restoreAllMocks());

  it('emits structured slow-query evidence without query parameters', () => {
    const warn = vi.spyOn(Logger.prototype, 'warn').mockImplementation(() => undefined);
    const prisma = new PrismaService(config as never);

    prisma.observeQuery({
      duration: 275,
      query: 'SELECT  *\nFROM profile WHERE id = $1',
      target: 'quaint::connector::metrics',
    });

    expect(warn).toHaveBeenCalledWith({
      event: 'database.slow_query',
      durationMs: 275,
      target: 'quaint::connector::metrics',
      statement: 'SELECT * FROM profile WHERE id = $1',
    });
  });

  it('does not log queries below the configured threshold', () => {
    const warn = vi.spyOn(Logger.prototype, 'warn').mockImplementation(() => undefined);
    const prisma = new PrismaService(config as never);

    prisma.observeQuery({ duration: 249, query: 'SELECT 1', target: 'cockroachdb' });

    expect(warn).not.toHaveBeenCalled();
  });
});
