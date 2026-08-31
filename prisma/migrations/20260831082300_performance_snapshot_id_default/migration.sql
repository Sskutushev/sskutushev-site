-- The table was created with a database-side default, but Prisma generates the
-- identifier in the client for this model. Leaving both in place made every
-- `migrate dev` run emit this statement inside an unrelated migration.
ALTER TABLE "PerformanceSnapshot" ALTER COLUMN "id" DROP DEFAULT;
