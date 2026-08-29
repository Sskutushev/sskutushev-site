import type { NextFunction, Request, Response } from 'express';
import type { MetricsService } from './metrics.service';

export function metricsMiddleware(metrics: MetricsService) {
  return (request: Request, response: Response, next: NextFunction): void => {
    const startedAt = process.hrtime.bigint();
    const writeHead = response.writeHead.bind(response);
    response.writeHead = ((...arguments_: Parameters<Response['writeHead']>) => {
      if (!response.headersSent) {
        const durationMs = Number(process.hrtime.bigint() - startedAt) / 1_000_000;
        response.setHeader('server-timing', `app;dur=${durationMs.toFixed(2)}`);
      }
      return writeHead(...arguments_);
    }) as Response['writeHead'];
    response.once('finish', () => {
      const durationSeconds = Number(process.hrtime.bigint() - startedAt) / 1_000_000_000;
      metrics.observe(request.method, request.path, response.statusCode, durationSeconds);
    });
    next();
  };
}
