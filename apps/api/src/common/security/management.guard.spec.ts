import type { ExecutionContext } from '@nestjs/common';
import { ForbiddenException } from '@nestjs/common';
import type { ConfigService } from '@nestjs/config';
import { GqlExecutionContext } from '@nestjs/graphql';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ManagementGuard } from './management.guard';

const token = 'a-secure-management-token-with-32-chars';

describe('ManagementGuard', () => {
  afterEach(() => vi.restoreAllMocks());

  function guard(enabled: boolean, authorization?: string) {
    vi.spyOn(GqlExecutionContext, 'create').mockReturnValue({
      getContext: () => ({ req: { headers: { authorization } } }),
    } as unknown as GqlExecutionContext);
    return new ManagementGuard({
      get: vi.fn(() => enabled),
      getOrThrow: vi.fn(() => token),
    } as unknown as ConfigService);
  }

  it('fails before credential checks when mutations are disabled', () => {
    expect(() => guard(false).canActivate({} as ExecutionContext)).toThrow(ForbiddenException);
  });

  it('rejects a missing or incorrect bearer credential', () => {
    expect(() => guard(true, 'Bearer wrong').canActivate({} as ExecutionContext)).toThrow(
      'Management authorization failed',
    );
  });

  it('accepts the exact bearer credential', () => {
    expect(guard(true, `Bearer ${token}`).canActivate({} as ExecutionContext)).toBe(true);
  });
});
