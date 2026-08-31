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
    slug: 'financial-concurrency',
    titleRu: 'Financial Concurrency',
    titleEn: 'Financial Concurrency',
    problemRu:
      'Расчёты с датой вступления в силу должны сохранять денежные инварианты при конкурентных изменениях.',
    problemEn:
      'Effective-dated calculations must preserve money invariants under concurrent changes.',
    approachRu:
      'Decimal money, дневной инвариант, optimistic concurrency и транзакционный перерасчёт.',
    approachEn:
      'Decimal money, a daily invariant, optimistic concurrency and transactional recalculation.',
    resultRu: 'Конфликтующие изменения отклоняются явно, без тихой потери начислений.',
    resultEn: 'Conflicting changes are rejected explicitly without silently losing accruals.',
    tech: ['TypeScript', 'CockroachDB', 'Prisma', 'GraphQL'],
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

/**
 * Localised employment history. The base columns on `Experience` keep the
 * Russian text so an unknown locale still reads as one language; both locales
 * are then stated explicitly, because a Russian heading over an English summary
 * is the defect this table exists to remove.
 */
const experiences = [
  {
    companyLabel: 'Refty.ai',
    role: 'Senior Fullstack Developer',
    startDate: new Date('2026-01-01'),
    endDate: null,
    summary: {
      ru: 'Международная proptech-платформа рынка недвижимости ОАЭ. Ownership backend, data и production-валидации; фронтенд — там, где он упирается в данные.',
      en: 'An international proptech platform for the UAE property market. Ownership of the backend, the data and production validation; the frontend where it meets the data.',
    },
    highlights: [
      {
        ru: {
          title: 'Ranking V3',
          description: 'три явных режима ранжирования и честный контракт доступности',
        },
        en: {
          title: 'Ranking V3',
          description: 'three explicit ranking modes and an honest availability contract',
        },
      },
      {
        ru: {
          title: 'Поиск по изображению',
          description: 'Wasabi, CLIP, Qdrant и BigQuery — пайплайн в проде',
        },
        en: {
          title: 'Image search',
          description: 'a Wasabi, CLIP, Qdrant and BigQuery pipeline in production',
        },
      },
      {
        ru: {
          title: 'Надёжность',
          description: 'SWR, схлопывание параллельных запросов, E2E и регрессии на инциденты',
        },
        en: {
          title: 'Reliability',
          description: 'SWR, in-flight dedupe, E2E and incident regression coverage',
        },
      },
    ],
  },
  {
    companyLabel: 'Investment Fund · NDA',
    role: 'Trading Strategies / Fullstack Developer',
    startDate: new Date('2021-03-01'),
    endDate: new Date('2025-12-01'),
    summary: {
      ru: 'Внутренние торговые и аналитические системы: realtime- и исторические данные, крипта, copy trading, алгоритмические компоненты.',
      en: 'Internal trading and analytics systems: realtime and historical data, crypto, copy trading and algorithmic components.',
    },
    highlights: [],
  },
  {
    companyLabel: 'TOT · NDA',
    role: 'Sole Frontend Developer',
    startDate: new Date('2024-12-01'),
    endDate: new Date('2025-06-01'),
    summary: {
      ru: 'Фронтенд-архитектура мультипродуктовой платформы: ролевой UI и система компонентов на сотни состояний.',
      en: 'The frontend architecture of a multi-product platform: role-based UI and a component system covering hundreds of states.',
    },
    highlights: [],
  },
  {
    companyLabel: 'Coca-Cola HBC Russia',
    role: 'Senior Key Account Manager',
    startDate: new Date('2015-02-01'),
    endDate: new Date('2020-12-01'),
    summary: {
      ru: 'Управление командой, KPI и переговоры. Отсюда привычка обсуждать систему в терминах последствий для бизнеса, а не технологий.',
      en: 'Team management, KPIs and negotiation. This is where the habit of discussing a system in terms of business consequences rather than technology comes from.',
    },
    highlights: [],
  },
] as const;

const profileText = {
  ru: {
    headline: 'Senior+ Fullstack / Product Engineer · Backend 60% / Frontend 40%',
    summary:
      'Веду продуктовые вертикали целиком: доменная модель, база, API, интерфейс, интеграции и выкат в production.',
    location: 'Санкт-Петербург · Remote · UTC+3',
    availability: 'Открыт к senior+ backend-работе',
  },
  en: {
    headline: 'Senior+ Fullstack / Product Engineer · Backend 60% / Frontend 40%',
    summary:
      'I own product verticals end to end: domain model, database, API, interface, integrations and the production rollout.',
    location: 'Saint Petersburg · Remote · UTC+3',
    availability: 'Open to senior+ backend work',
  },
} as const;

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
