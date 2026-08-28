-- CreateTable
CREATE TABLE "Deployment" (
    "id" STRING NOT NULL,
    "sha" STRING NOT NULL,
    "branch" STRING NOT NULL,
    "environment" STRING NOT NULL,
    "status" STRING NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL,
    "finishedAt" TIMESTAMP(3),
    CONSTRAINT "Deployment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QualityRun" (
    "id" STRING NOT NULL,
    "deploymentId" STRING NOT NULL,
    "sha" STRING NOT NULL,
    "unitTests" INT4 NOT NULL,
    "integrationTests" INT4 NOT NULL,
    "contractTests" INT4 NOT NULL,
    "e2eTests" INT4 NOT NULL,
    "securityTests" INT4 NOT NULL,
    "coverageLines" FLOAT8 NOT NULL,
    "coverageBranches" FLOAT8 NOT NULL,
    "lighthousePerformance" INT4 NOT NULL,
    "lighthouseAccessibility" INT4 NOT NULL,
    "bundleKb" INT4 NOT NULL,
    "criticalVulnerabilities" INT4 NOT NULL,
    "highVulnerabilities" INT4 NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "QualityRun_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Deployment_sha_environment_key" ON "Deployment"("sha", "environment");
CREATE INDEX "Deployment_environment_startedAt_idx" ON "Deployment"("environment", "startedAt");
CREATE INDEX "QualityRun_createdAt_idx" ON "QualityRun"("createdAt");
CREATE INDEX "QualityRun_sha_idx" ON "QualityRun"("sha");
ALTER TABLE "QualityRun" ADD CONSTRAINT "QualityRun_deploymentId_fkey" FOREIGN KEY ("deploymentId") REFERENCES "Deployment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE "SystemEvent" (
    "id" STRING NOT NULL,
    "type" STRING NOT NULL,
    "severity" STRING NOT NULL,
    "publicPayload" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SystemEvent_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "SystemEvent_createdAt_idx" ON "SystemEvent"("createdAt");
