-- CreateTable
CREATE TABLE "ProfileTranslation" (
    "id" STRING NOT NULL,
    "profileId" STRING NOT NULL,
    "locale" STRING NOT NULL,
    "headline" STRING NOT NULL,
    "summary" STRING NOT NULL,
    "location" STRING NOT NULL,
    "availability" STRING NOT NULL,

    CONSTRAINT "ProfileTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExperienceTranslation" (
    "id" STRING NOT NULL,
    "experienceId" STRING NOT NULL,
    "locale" STRING NOT NULL,
    "summary" STRING NOT NULL,

    CONSTRAINT "ExperienceTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExperienceHighlightTranslation" (
    "id" STRING NOT NULL,
    "highlightId" STRING NOT NULL,
    "locale" STRING NOT NULL,
    "title" STRING NOT NULL,
    "description" STRING NOT NULL,

    CONSTRAINT "ExperienceHighlightTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProfileTranslation_profileId_locale_key" ON "ProfileTranslation"("profileId", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "ExperienceTranslation_experienceId_locale_key" ON "ExperienceTranslation"("experienceId", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "ExperienceHighlightTranslation_highlightId_locale_key" ON "ExperienceHighlightTranslation"("highlightId", "locale");

-- AddForeignKey
ALTER TABLE "ProfileTranslation" ADD CONSTRAINT "ProfileTranslation_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExperienceTranslation" ADD CONSTRAINT "ExperienceTranslation_experienceId_fkey" FOREIGN KEY ("experienceId") REFERENCES "Experience"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExperienceHighlightTranslation" ADD CONSTRAINT "ExperienceHighlightTranslation_highlightId_fkey" FOREIGN KEY ("highlightId") REFERENCES "ExperienceHighlight"("id") ON DELETE CASCADE ON UPDATE CASCADE;
