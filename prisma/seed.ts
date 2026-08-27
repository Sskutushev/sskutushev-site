import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const skills = [
  ['TypeScript', 'Backend'],
  ['Node.js', 'Backend'],
  ['NestJS', 'Backend'],
  ['Express', 'Backend'],
  ['GraphQL', 'Backend'],
  ['REST', 'Backend'],
  ['WebSocket', 'Backend'],
  ['Python', 'Backend'],
  ['FastAPI', 'Backend'],
  ['CockroachDB', 'Data'],
  ['PostgreSQL', 'Data'],
  ['MongoDB', 'Data'],
  ['BigQuery', 'Data'],
  ['ClickHouse', 'Data'],
  ['Redis', 'Data'],
  ['Qdrant', 'Data'],
  ['Prisma', 'Data'],
  ['BullMQ', 'Data'],
  ['React', 'Frontend'],
  ['Next.js', 'Frontend'],
  ['Zustand', 'Frontend'],
  ['TanStack Query', 'Frontend'],
  ['Three.js', 'Frontend'],
  ['WebGL / GLSL', 'Frontend'],
  ['Docker', 'Infrastructure'],
  ['Kubernetes', 'Infrastructure'],
  ['S3 / Wasabi', 'Infrastructure'],
  ['GitHub Actions', 'Infrastructure'],
  ['OpenTelemetry', 'Infrastructure'],
  ['Playwright', 'Quality'],
] as const;

const cases = [
  {
    slug: 'money-entitlement',
    titleRu: 'Money & Entitlement',
    titleEn: 'Money & Entitlement',
    problemRu:
      'Денежные движения и право доступа должны оставаться корректными при retry, replay и отказе storage.',
    problemEn:
      'Money movement and access grants must remain correct through retries, replay and storage outages.',
    approachRu:
      'Backend-owned pricing, ledger, idempotency identity, fail-closed grant, refund и reconciliation.',
    approachEn:
      'Backend-owned pricing, ledgers, idempotency identity, fail-closed grants, refunds and reconciliation.',
    resultRu:
      'Повтор операции возвращает тот же результат или именованный конфликт — никогда второе списание.',
    resultEn:
      'A repeated operation returns the same result or a named conflict—never a second charge.',
    tech: ['TypeScript', 'Node.js', 'CockroachDB', 'Redis'],
  },
  {
    slug: 'ranking-data-honesty',
    titleRu: 'Ranking V3 / Data Honesty',
    titleEn: 'Ranking V3 / Data Honesty',
    problemRu:
      'Рейтинг недвижимости не имеет права выдавать математически точную, но продуктово ложную цифру.',
    problemEn:
      'Property ranking must not present a mathematically precise yet product-invalid number.',
    approachRu:
      'Absolute / adjusted / category modes, cohort basis, confidence, reason taxonomy и unknown ≠ zero.',
    approachEn:
      'Absolute, adjusted and category modes with cohort basis, confidence, reason taxonomy and unknown ≠ zero.',
    resultRu: 'Трёхрежимная production-система ранжирования для каталога из 230k+ объявлений.',
    resultEn: 'A three-mode production ranking system for a catalogue of 230k+ listings.',
    tech: ['TypeScript', 'BigQuery', 'Redis', 'React'],
  },
  {
    slug: 'search-cache-reliability',
    titleRu: 'Search / Cache Reliability',
    titleEn: 'Search / Cache Reliability',
    problemRu:
      'Дорогой provider и всплески одинаковых запросов создавали latency и хрупкие пользовательские состояния.',
    problemEn:
      'An expensive provider and bursts of identical requests created latency and fragile UI states.',
    approachRu:
      'Versioned SWR envelopes, deterministic keys, in-flight dedupe и честный stale fallback.',
    approachEn:
      'Versioned SWR envelopes, deterministic keys, in-flight dedupe and an explicit stale fallback.',
    resultRu: 'Search V2 и виртуализация снизили нагрузку на браузер примерно на 75%.',
    resultEn: 'Search V2 and virtualization reduced browser load by approximately 75%.',
    tech: ['Redis', 'React', 'TanStack Query', 'TypeScript'],
  },
  {
    slug: 'image-similarity',
    titleRu: 'Image Similarity Pipeline',
    titleEn: 'Image Similarity Pipeline',
    problemRu:
      'Production-поиск похожих объектов возвращал нулевую выдачу на стыке нескольких data-систем.',
    problemEn:
      'Production similarity search returned zero results across a multi-system data pipeline.',
    approachRu:
      'Quality gate, Redis → Wasabi → CLIP embeddings → Qdrant → BigQuery и fallback на original asset.',
    approachEn:
      'Quality gate, Redis → Wasabi → CLIP embeddings → Qdrant → BigQuery and original-asset fallback.',
    resultRu:
      'Root-cause устранён сквозь storage, embedding, vector retrieval и warehouse projection.',
    resultEn:
      'The root cause was removed across storage, embedding, vector retrieval and warehouse projection.',
    tech: ['Python', 'FastAPI', 'Redis', 'Qdrant', 'BigQuery', 'S3 / Wasabi'],
  },
  {
    slug: 'analytics-migration',
    titleRu: 'Analytics / Warehouse Migration',
    titleEn: 'Analytics / Warehouse Migration',
    problemRu:
      'Looker и прямые warehouse-запросы создавали лишнюю стоимость, latency и расхождение контрактов.',
    problemEn:
      'Looker and direct warehouse queries created avoidable cost, latency and contract drift.',
    approachRu:
      'Typed TS/SQL layer, bounded params, provider abstraction и BigQuery/ClickHouse dialect parity.',
    approachEn:
      'A typed TS/SQL layer, bounded parameters, provider abstraction and BigQuery/ClickHouse dialect parity.',
    resultRu: 'Количество запросов к BigQuery сокращено примерно на 65%.',
    resultEn: 'BigQuery request volume was reduced by approximately 65%.',
    tech: ['TypeScript', 'BigQuery', 'ClickHouse', 'GraphQL'],
  },
  {
    slug: 'production-migration',
    titleRu: 'Production Migration',
    titleEn: 'Production Migration',
    problemRu:
      'Legacy-контуры нельзя выключить одним deploy: клиенты, auth и ссылки живут дольше релиза.',
    problemEn:
      'Legacy systems cannot be removed in one deploy: clients, auth and links outlive a release.',
    approachRu:
      'Additive schema, compatibility layer, feature flag, readiness, traffic switch, smoke и rollback.',
    approachEn:
      'Additive schema, compatibility layer, feature flags, readiness, traffic switch, smoke and rollback.',
    resultRu:
      'Rollout становится частью реализации, а green build — только одним из входных условий.',
    resultEn: 'Rollout becomes part of implementation; a green build is only one prerequisite.',
    tech: ['Docker', 'Kubernetes', 'GitHub Actions', 'Playwright'],
  },
] as const;

async function main(): Promise<void> {
  await prisma.profile.deleteMany({ where: { slug: 'sergey-skutushev' } });
  const profile = await prisma.profile.create({
    data: {
      slug: 'sergey-skutushev',
      fullName: 'Сергей Кутушев',
      headline: 'Backend-oriented Senior+ Fullstack / Product Engineer',
      summary:
        'Веду сложные продуктовые вертикали от доменной модели и базы данных до React-интерфейса, интеграций и production rollout.',
      location: 'Санкт-Петербург · Remote · UTC+3',
      availability: 'Открыт к сильным backend и product engineering командам',
      yearsExperience: 11,
      skills: {
        create: skills.map(([name, category], priority) => ({ name, category, priority })),
      },
      socialLinks: {
        create: [
          { type: 'Email', url: 'mailto:sskutushev@gmail.com', sortOrder: 1 },
          { type: 'Telegram', url: 'https://t.me/sskutushev', sortOrder: 2 },
          { type: 'GitHub', url: 'https://github.com/Sskutushev', sortOrder: 3 },
        ],
      },
      experiences: {
        create: [
          {
            companyLabel: 'Refty.ai',
            role: 'Senior Fullstack Developer',
            startDate: new Date('2026-01-01'),
            summary:
              'Международная proptech B2B/B2C-платформа рынка недвижимости ОАЭ; end-to-end ownership backend, frontend, data и production validation.',
            sortOrder: 1,
            highlights: {
              create: [
                {
                  title: 'Ranking V3',
                  description: 'three-mode ranking and honest availability contracts',
                  sortOrder: 1,
                },
                {
                  title: 'Image search',
                  description: 'Redis, Wasabi, CLIP, Qdrant and BigQuery production pipeline',
                  sortOrder: 2,
                },
                {
                  title: 'Reliability',
                  description: 'SWR, in-flight dedupe, E2E and incident regression coverage',
                  sortOrder: 3,
                },
              ],
            },
          },
          {
            companyLabel: 'Investment Fund · NDA',
            role: 'Trading Strategies / Fullstack Developer',
            startDate: new Date('2021-03-01'),
            endDate: new Date('2025-12-01'),
            summary:
              'Внутренние trading и analytics systems: realtime/historical data, crypto, copy trading и algorithmic components.',
            sortOrder: 2,
          },
          {
            companyLabel: 'TOT · NDA',
            role: 'Sole Frontend Developer',
            startDate: new Date('2024-12-01'),
            endDate: new Date('2025-06-01'),
            summary:
              'Frontend-архитектура multi-product платформы, role-based UI и component system для сотен desktop/tablet/mobile состояний.',
            sortOrder: 3,
          },
          {
            companyLabel: 'Coca-Cola HBC Russia',
            role: 'Senior Key Account Manager',
            startDate: new Date('2015-02-01'),
            endDate: new Date('2020-12-01'),
            summary:
              'Командное управление, KPI, продажи и бизнес-мышление, которое сегодня помогает проектировать продуктовые системы.',
            sortOrder: 4,
          },
        ],
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
              constraints: 'Production correctness, compatibility and observable failure states.',
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
