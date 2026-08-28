import type { NextFunction, Request, Response } from 'express';
import { MetricsService } from './metrics.service';

export function metricsMiddleware(metrics: MetricsService) {
  return (request: Request, response: Response, next: NextFunction): void => {
    const startedAt = process.hrtime.bigint();
    response.once('finish', () => {
      const durationSeconds = Number(process.hrtime.bigint() - startedAt) / 1_000_000_000;
      metrics.observe(request.method, request.path, response.statusCode, durationSeconds);
    });
    next();
  };
}
