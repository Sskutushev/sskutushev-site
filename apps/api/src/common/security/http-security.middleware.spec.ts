import type { NextFunction, Request, Response } from 'express';
import { describe, expect, it, vi } from 'vitest';
import { CacheService } from '../../cache/cache.service';
import { httpSecurityMiddleware } from './http-security.middleware';

function responseDouble() {
  const response = {
    setHeader: vi.fn(),
    status: vi.fn(),
    json: vi.fn(),
  };
  response.status.mockReturnValue(response);
  return response;
}

describe('httpSecurityMiddleware', () => {
  it('sets security headers and continues an allowed request', async () => {
    const cache = { consumeLimit: vi.fn().mockResolvedValue(true) };
    const request = {
      path: '/graphql',
      ip: '127.0.0.1',
      header: vi.fn().mockReturnValue('request-1'),
    };
    const response = responseDouble();
    const next = vi.fn() as NextFunction;

    await httpSecurityMiddleware(cache as unknown as CacheService, 60)(
      request as unknown as Request,
      response as unknown as Response,
      next,
    );

    expect(response.setHeader).toHaveBeenCalledWith('x-request-id', 'request-1');
    expect(response.setHeader).toHaveBeenCalledWith('x-content-type-options', 'nosniff');
    expect(next).toHaveBeenCalledOnce();
  });

  it('returns 429 without invoking downstream handlers when exhausted', async () => {
    const cache = { consumeLimit: vi.fn().mockResolvedValue(false) };
    const request = { path: '/graphql', ip: '127.0.0.1', header: vi.fn() };
    const response = responseDouble();
    const next = vi.fn() as NextFunction;

    await httpSecurityMiddleware(cache as unknown as CacheService, 60)(
      request as unknown as Request,
      response as unknown as Response,
      next,
    );

    expect(response.status).toHaveBeenCalledWith(429);
    expect(response.json).toHaveBeenCalledWith({
      statusCode: 429,
      message: 'Too many requests',
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('keeps liveness independent from Redis', async () => {
    const cache = { consumeLimit: vi.fn() };
    const request = { path: '/health/live', ip: '127.0.0.1', header: vi.fn() };
    const response = responseDouble();
    const next = vi.fn() as NextFunction;

    await httpSecurityMiddleware(cache as unknown as CacheService, 60)(
      request as unknown as Request,
      response as unknown as Response,
      next,
    );

    expect(cache.consumeLimit).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledOnce();
  });
});
