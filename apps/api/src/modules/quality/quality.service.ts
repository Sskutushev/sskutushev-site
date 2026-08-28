import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../database/prisma.service';
import type { ImportQualityRunInput, QualityRunModel } from './quality.models';
import { RealtimeService } from '../realtime/realtime.service';

@Injectable()
export class QualityService {
  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
    private readonly realtime: RealtimeService,
  ) {}

  async latest(): Promise<QualityRunModel | null> {
    const run = await this.prisma.qualityRun.findFirst({
      orderBy: { createdAt: 'desc' },
      include: { deployment: true },
    });
    return run ? this.toModel(run) : null;
  }

  async import(input: ImportQualityRunInput): Promise<QualityRunModel> {
    if (!this.config.get<boolean>('ENABLE_MUTATIONS')) {
      throw new ForbiddenException('Mutations are disabled in this environment');
    }
    const created = await this.prisma.$transaction(async (transaction) => {
      const now = new Date();
      const deployment = await transaction.deployment.upsert({
        where: { sha_environment: { sha: input.sha, environment: input.environment } },
        create: {
          sha: input.sha,
          branch: input.branch,
          environment: input.environment,
          status: 'SUCCEEDED',
          startedAt: now,
          finishedAt: now,
        },
        update: { branch: input.branch, status: 'SUCCEEDED', finishedAt: now },
      });
      return transaction.qualityRun.create({
        data: {
          deploymentId: deployment.id,
          sha: input.sha,
          unitTests: input.unitTests,
          integrationTests: input.integrationTests,
          contractTests: input.contractTests,
          e2eTests: input.e2eTests,
          securityTests: input.securityTests,
          coverageLines: input.coverageLines,
          coverageBranches: input.coverageBranches,
          lighthousePerformance: input.lighthousePerformance,
          lighthouseAccessibility: input.lighthouseAccessibility,
          bundleKb: input.bundleKb,
          criticalVulnerabilities: input.criticalVulnerabilities,
          highVulnerabilities: input.highVulnerabilities,
        },
        include: { deployment: true },
      });
    });
    await this.realtime.record('QUALITY_IMPORTED', 'INFO', {
      sha: input.sha,
      environment: input.environment,
    });
    return this.toModel(created);
  }

  private toModel(run: {
    sha: string;
    unitTests: number;
    integrationTests: number;
    contractTests: number;
    e2eTests: number;
    securityTests: number;
    coverageLines: number;
    coverageBranches: number;
    lighthousePerformance: number;
    lighthouseAccessibility: number;
    bundleKb: number;
    criticalVulnerabilities: number;
    highVulnerabilities: number;
    createdAt: Date;
    deployment: { branch: string; environment: string };
  }): QualityRunModel {
    return { ...run, branch: run.deployment.branch, environment: run.deployment.environment };
  }
}
