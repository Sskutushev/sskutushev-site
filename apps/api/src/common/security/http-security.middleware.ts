import type { NextFunction, Request, Response } from 'express';
import { createHash, randomUUID } from 'node:crypto';
import type { CacheService } from '../../cache/cache.service';

const requestIdPattern = /^[a-zA-Z0-9._-]{1,100}$/;

export function httpSecurityMiddleware(cache: CacheService, limit: number, timingOrigin?: string) {
  return async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    const suppliedId = request.header('x-request-id');
    const requestId = suppliedId && requestIdPattern.test(suppliedId) ? suppliedId : randomUUID();
    response.setHeader('x-request-id', requestId);
    response.setHeader('x-content-type-options', 'nosniff');
    response.setHeader('referrer-policy', 'strict-origin-when-cross-origin');
    response.setHeader('permissions-policy', 'camera=(), microphone=(), geolocation=()');
    response.setHeader('cross-origin-resource-policy', 'same-site');
    if (timingOrigin) response.setHeader('timing-allow-origin', timingOrigin);

    if (!request.path.startsWith('/health/')) {
      const client = createHash('sha256')
        .update(request.ip ?? 'unknown')
        .digest('hex');
      const allowed = await cache.consumeLimit(`rate:v1:${client}`, limit, 60);
      if (!allowed) {
        response.setHeader('retry-after', '60');
        response.status(429).json({ statusCode: 429, message: 'Too many requests' });
        return;
      }
    }
    next();
  };
}
