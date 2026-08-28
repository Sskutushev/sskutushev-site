CREATE TABLE "PerformanceSnapshot" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "metric" STRING(8) NOT NULL,
    "value" FLOAT8 NOT NULL,
    "rating" STRING(16) NOT NULL,
    "navigationType" STRING(32),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PerformanceSnapshot_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "PerformanceSnapshot_metric_createdAt_idx"
ON "PerformanceSnapshot"("metric", "createdAt");
