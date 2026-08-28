import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GqlExecutionContext } from '@nestjs/graphql';
import { timingSafeEqual } from 'node:crypto';

@Injectable()
export class ManagementGuard implements CanActivate {
  constructor(private readonly config: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    if (!this.config.get<boolean>('ENABLE_MUTATIONS')) {
      throw new ForbiddenException('Mutations are disabled in this environment');
    }
    const expected = this.config.getOrThrow<string>('MANAGEMENT_TOKEN');
    const request = GqlExecutionContext.create(context).getContext<{ req: { headers: unknown } }>()
      .req;
    const authorization = this.authorization(request.headers);
    const supplied = authorization.startsWith('Bearer ') ? authorization.slice(7) : '';
    const left = Buffer.from(supplied);
    const right = Buffer.from(expected);
    if (left.length !== right.length || !timingSafeEqual(left, right)) {
      throw new ForbiddenException('Management authorization failed');
    }
    return true;
  }

  private authorization(headers: unknown): string {
    if (!headers || typeof headers !== 'object') return '';
    const value = (headers as Record<string, unknown>).authorization;
    return typeof value === 'string' ? value : '';
  }
}
