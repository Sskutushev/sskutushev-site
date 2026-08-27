-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "AssetStatus" AS ENUM ('PENDING', 'READY', 'FAILED', 'DELETED');

-- CreateTable
CREATE TABLE "Profile" (
    "id" STRING NOT NULL,
    "slug" STRING NOT NULL,
    "fullName" STRING NOT NULL,
    "headline" STRING NOT NULL,
    "summary" STRING NOT NULL,
    "location" STRING NOT NULL,
    "availability" STRING NOT NULL,
    "yearsExperience" INT4 NOT NULL,
    "version" INT4 NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Skill" (
    "id" STRING NOT NULL,
    "profileId" STRING NOT NULL,
    "name" STRING NOT NULL,
    "category" STRING NOT NULL,
    "priority" INT4 NOT NULL,

    CONSTRAINT "Skill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Experience" (
    "id" STRING NOT NULL,
    "profileId" STRING NOT NULL,
    "companyLabel" STRING NOT NULL,
    "role" STRING NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "summary" STRING NOT NULL,
    "sortOrder" INT4 NOT NULL,

    CONSTRAINT "Experience_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExperienceHighlight" (
    "id" STRING NOT NULL,
    "experienceId" STRING NOT NULL,
    "title" STRING NOT NULL,
    "description" STRING NOT NULL,
    "sortOrder" INT4 NOT NULL,

    CONSTRAINT "ExperienceHighlight_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CaseStudy" (
    "id" STRING NOT NULL,
    "profileId" STRING NOT NULL,
    "slug" STRING NOT NULL,
    "featured" BOOL NOT NULL DEFAULT false,
    "sortOrder" INT4 NOT NULL,
    "version" INT4 NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CaseStudy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CaseStudyTranslation" (
    "id" STRING NOT NULL,
    "caseStudyId" STRING NOT NULL,
    "locale" STRING NOT NULL,
    "title" STRING NOT NULL,
    "problem" STRING NOT NULL,
    "constraints" STRING NOT NULL,
    "approach" STRING NOT NULL,
    "architecture" STRING NOT NULL,
    "result" STRING NOT NULL,
    "scaleNotes" STRING NOT NULL,

    CONSTRAINT "CaseStudyTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CaseStudyMetric" (
    "id" STRING NOT NULL,
    "caseStudyId" STRING NOT NULL,
    "label" STRING NOT NULL,
    "value" STRING NOT NULL,
    "unit" STRING NOT NULL,
    "sortOrder" INT4 NOT NULL,

    CONSTRAINT "CaseStudyMetric_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CaseStudyTechnology" (
    "caseStudyId" STRING NOT NULL,
    "skillId" STRING NOT NULL,

    CONSTRAINT "CaseStudyTechnology_pkey" PRIMARY KEY ("caseStudyId","skillId")
);

-- CreateTable
CREATE TABLE "SocialLink" (
    "id" STRING NOT NULL,
    "profileId" STRING NOT NULL,
    "type" STRING NOT NULL,
    "url" STRING NOT NULL,
    "sortOrder" INT4 NOT NULL,

    CONSTRAINT "SocialLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Asset" (
    "id" STRING NOT NULL,
    "profileId" STRING NOT NULL,
    "caseStudyId" STRING,
    "type" STRING NOT NULL,
    "status" "AssetStatus" NOT NULL DEFAULT 'PENDING',
    "storageKey" STRING NOT NULL,
    "contentType" STRING NOT NULL,
    "sizeBytes" INT8,
    "checksum" STRING,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Asset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GithubSnapshot" (
    "id" STRING NOT NULL,
    "owner" STRING NOT NULL,
    "repository" STRING NOT NULL,
    "stars" INT4 NOT NULL,
    "forks" INT4 NOT NULL,
    "openIssues" INT4 NOT NULL,
    "pushedAt" TIMESTAMP(3),
    "capturedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GithubSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Profile_slug_key" ON "Profile"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Skill_profileId_name_key" ON "Skill"("profileId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "CaseStudy_slug_key" ON "CaseStudy"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "CaseStudyTranslation_caseStudyId_locale_key" ON "CaseStudyTranslation"("caseStudyId", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "Asset_storageKey_key" ON "Asset"("storageKey");

-- CreateIndex
CREATE INDEX "GithubSnapshot_owner_capturedAt_idx" ON "GithubSnapshot"("owner", "capturedAt");

-- AddForeignKey
ALTER TABLE "Skill" ADD CONSTRAINT "Skill_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Experience" ADD CONSTRAINT "Experience_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExperienceHighlight" ADD CONSTRAINT "ExperienceHighlight_experienceId_fkey" FOREIGN KEY ("experienceId") REFERENCES "Experience"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CaseStudy" ADD CONSTRAINT "CaseStudy_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CaseStudyTranslation" ADD CONSTRAINT "CaseStudyTranslation_caseStudyId_fkey" FOREIGN KEY ("caseStudyId") REFERENCES "CaseStudy"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CaseStudyMetric" ADD CONSTRAINT "CaseStudyMetric_caseStudyId_fkey" FOREIGN KEY ("caseStudyId") REFERENCES "CaseStudy"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CaseStudyTechnology" ADD CONSTRAINT "CaseStudyTechnology_caseStudyId_fkey" FOREIGN KEY ("caseStudyId") REFERENCES "CaseStudy"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CaseStudyTechnology" ADD CONSTRAINT "CaseStudyTechnology_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "Skill"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SocialLink" ADD CONSTRAINT "SocialLink_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_caseStudyId_fkey" FOREIGN KEY ("caseStudyId") REFERENCES "CaseStudy"("id") ON DELETE SET NULL ON UPDATE CASCADE;
