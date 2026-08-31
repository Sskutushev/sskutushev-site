import { PrismaClient } from '@prisma/client';
import { cases, experiences, profileText, skills } from './seed-data';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  await prisma.profile.deleteMany({
    where: { slug: { in: ['sergey-skutushev', 'sergey-kutushev'] } },
  });
  const profile = await prisma.profile.create({
    data: {
      slug: 'sergey-kutushev',
      fullName: 'Сергей Кутушев',
      headline: profileText.ru.headline,
      summary: profileText.ru.summary,
      location: profileText.ru.location,
      availability: profileText.ru.availability,
      yearsExperience: 11,
      skills: {
        create: skills.map(([name, category], priority) => ({ name, category, priority })),
      },
      socialLinks: {
        create: [
          { type: 'Email', url: 'mailto:sskutushev@gmail.com', sortOrder: 1 },
          { type: 'Telegram', url: 'https://t.me/sskutushev', sortOrder: 2 },
          { type: 'GitHub', url: 'https://github.com/Sskutushev', sortOrder: 3 },
          { type: 'LinkedIn', url: 'https://www.linkedin.com/in/sskutushev/', sortOrder: 4 },
        ],
      },
      translations: {
        create: (['ru', 'en'] as const).map((locale) => ({ locale, ...profileText[locale] })),
      },
      experiences: {
        create: experiences.map((item, index) => ({
          companyLabel: item.companyLabel,
          role: item.role,
          startDate: item.startDate,
          ...(item.endDate ? { endDate: item.endDate } : {}),
          summary: item.summary.ru,
          sortOrder: index + 1,
          translations: {
            create: (['ru', 'en'] as const).map((locale) => ({
              locale,
              summary: item.summary[locale],
            })),
          },
          highlights: {
            create: item.highlights.map((highlight, position) => ({
              title: highlight.ru.title,
              description: highlight.ru.description,
              sortOrder: position + 1,
              translations: {
                create: (['ru', 'en'] as const).map((locale) => ({
                  locale,
                  ...highlight[locale],
                })),
              },
            })),
          },
        })),
      },
    },
  });
  const storedSkills = await prisma.skill.findMany({ where: { profileId: profile.id } });
  const skillId = new Map(storedSkills.map((skill) => [skill.name, skill.id]));
  for (const [index, item] of cases.entries()) {
    await prisma.caseStudy.create({
      data: {
        profileId: profile.id,
        slug: item.slug,
        featured: index < 3,
        sortOrder: index + 1,
        translations: {
          create: [
            {
              locale: 'ru',
              title: item.titleRu,
              problem: item.problemRu,
              constraints: 'Корректность в проде, совместимость и наблюдаемые состояния отказа.',
              approach: item.approachRu,
              architecture: item.tech.join(' → '),
              result: item.resultRu,
              scaleNotes:
                'Публичные числа приведены только там, где они подтверждены резюме или assessment.',
            },
            {
              locale: 'en',
              title: item.titleEn,
              problem: item.problemEn,
              constraints: 'Production correctness, compatibility and observable failure states.',
              approach: item.approachEn,
              architecture: item.tech.join(' → '),
              result: item.resultEn,
              scaleNotes:
                'Public numbers are shown only when supported by the resume or assessment.',
            },
          ],
        },
        technologies: {
          create: item.tech.flatMap((name) => {
            const id = skillId.get(name);
            return id ? [{ skillId: id }] : [];
          }),
        },
      },
    });
  }
}

main().finally(async () => prisma.$disconnect());
