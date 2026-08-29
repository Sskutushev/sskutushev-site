import { ForbiddenException } from '@nestjs/common';
import type { ConfigService } from '@nestjs/config';
import { describe, expect, it, vi } from 'vitest';
import type { PrismaService } from '../../database/prisma.service';
import type { ImportQualityRunInput } from './quality.models';
import { QualityService } from './quality.service';
import type { RealtimeService } from '../realtime/realtime.service';

const input: ImportQualityRunInput = {
  sha: 'abcdef1234567',
  branch: 'main',
  environment: 'production',
  unitTests: 32,
  integrationTests: 4,
  contractTests: 2,
  e2eTests: 3,
  securityTests: 5,
  coverageLines: 91.2,
  coverageBranches: 86.4,
  lighthousePerformance: 96,
  lighthouseAccessibility: 100,
  bundleKb: 150,
  criticalVulnerabilities: 0,
  highVulnerabilities: 0,
};

function createService(enabled = true) {
  const deployment = {
    id: 'deployment-1',
    branch: input.branch,
    environment: input.environment,
  };
  const run = {
    ...input,
    id: 'run-1',
    deploymentId: deployment.id,
    deployment,
    createdAt: new Date(),
  };
  const transaction = {
    deployment: { upsert: vi.fn().mockResolvedValue(deployment) },
    qualityRun: { create: vi.fn().mockResolvedValue(run) },
  };
  const prisma = {
    qualityRun: { findFirst: vi.fn().mockResolvedValue(run) },
    $transaction: vi.fn((operation: (client: typeof transaction) => Promise<unknown>) =>
      operation(transaction),
    ),
  };
  return {
    service: new QualityService(
      { get: vi.fn(() => enabled) } as unknown as ConfigService,
      prisma as unknown as PrismaService,
      { record: vi.fn().mockResolvedValue(undefined) } as unknown as RealtimeService,
    ),
    transaction,
  };
}

describe('QualityService', () => {
  it('returns only persisted measurements', async () => {
    const { service } = createService();
    await expect(service.latest()).resolves.toMatchObject({
      sha: input.sha,
      branch: 'main',
      lighthouseAccessibility: 100,
    });
  });

  it('fails closed before importing CI data', async () => {
    const { service } = createService(false);
    await expect(service.import(input)).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('stores deployment identity and measured values atomically', async () => {
    const { service, transaction } = createService();
    await service.import(input);
    expect(transaction.deployment.upsert).toHaveBeenCalledOnce();
    expect(transaction.qualityRun.create).toHaveBeenCalledOnce();
  });
});
