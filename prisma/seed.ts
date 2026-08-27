import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  await prisma.profile.upsert({
    where: { slug: 'sergey-skutushev' },
    update: {},
    create: {
      slug: 'sergey-skutushev',
      fullName: 'Сергей Скутушев',
      headline: 'TypeScript Backend / Product Engineer',
      summary:
        'Проектирую надежные продуктовые системы: от бизнес-инвариантов и API-контрактов до наблюдаемого production rollout.',
      location: 'Россия · Remote',
      availability: 'Открыт к сильным backend-командам',
      yearsExperience: 3,
      skills: {
        create: [
          ['TypeScript', 'Core', 1],
          ['NestJS', 'Backend', 2],
          ['GraphQL', 'API', 3],
          ['CockroachDB', 'Data', 4],
          ['Prisma', 'Data', 5],
          ['Docker', 'Platform', 6],
          ['Redis', 'Reliability', 7],
          ['S3', 'Storage', 8],
          ['React', 'Frontend', 9],
        ].map(([name, category, priority]) => ({
          name: String(name),
          category: String(category),
          priority: Number(priority),
        })),
      },
      socialLinks: {
        create: [{ type: 'GitHub', url: 'https://github.com/Sskutushev', sortOrder: 1 }],
      },
      caseStudies: {
        create: [
          {
            slug: 'engineering-portfolio',
            featured: true,
            sortOrder: 1,
            translations: {
              create: [
                {
                  locale: 'ru',
                  title: 'Инженерное портфолио как живая система',
                  problem: 'Обычная визитка не показывает качество backend-инженерии.',
                  constraints:
                    'Строгий TypeScript, реальная инфраструктура, быстрый первый экран и доступный fallback.',
                  approach:
                    'Данные идут из CockroachDB через типизированный GraphQL API; Redis и S3 решают отдельные эксплуатационные задачи.',
                  architecture:
                    'React → NestJS GraphQL → Prisma → CockroachDB; Redis для cache/queue, MinIO как S3 boundary.',
                  result:
                    'Проверяемый vertical slice, который можно развивать и менять вживую на интервью.',
                  scaleNotes:
                    'Stateless API и внешние stateful dependencies допускают горизонтальное масштабирование.',
                },
              ],
            },
          },
        ],
      },
    },
  });
}

main().finally(async () => prisma.$disconnect());
