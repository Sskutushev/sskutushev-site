import { EventEmitter } from 'node:events';
import type { NextFunction, Request, Response } from 'express';
import { describe, expect, it, vi } from 'vitest';
import type { MetricsService } from './metrics.service';
import { metricsMiddleware } from './metrics.middleware';

describe('metricsMiddleware', () => {
  it('adds a measured Server-Timing header before sending headers', () => {
    const response = Object.assign(new EventEmitter(), {
      statusCode: 200,
      headersSent: false,
      setHeader: vi.fn(),
      writeHead: vi.fn().mockReturnThis(),
    });
    const metrics = { observe: vi.fn() };
    const next = (() => {
      response.writeHead(200);
    }) as NextFunction;

    metricsMiddleware(metrics as unknown as MetricsService)(
      { method: 'POST', path: '/graphql' } as Request,
      response as unknown as Response,
      next,
    );

    expect(response.setHeader).toHaveBeenCalledWith(
      'server-timing',
      expect.stringMatching(/^app;dur=\d+\.\d{2}$/),
    );
  });

  it('records the bounded route metric when the response finishes', () => {
    const response = Object.assign(new EventEmitter(), {
      statusCode: 200,
      headersSent: false,
      setHeader: vi.fn(),
      writeHead: vi.fn().mockReturnThis(),
    });
    const metrics = { observe: vi.fn() };

    metricsMiddleware(metrics as unknown as MetricsService)(
      { method: 'GET', path: '/health/live' } as Request,
      response as unknown as Response,
      vi.fn(),
    );
    response.emit('finish');

    expect(metrics.observe).toHaveBeenCalledWith('GET', '/health/live', 200, expect.any(Number));
  });
});
