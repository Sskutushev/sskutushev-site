/**
 * The seeded portfolio content, in both locales.
 *
 * Separated from the writer because it is content rather than logic: it
 * changes for editorial reasons, on its own cadence, and reviewing a copy
 * change should not mean reading transaction code.
 */
export const skills = [
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

export const cases = [
  {
    slug: 'money-entitlement',
    titleRu: 'Money & Entitlement',
    titleEn: 'Money & Entitlement',
    problemRu: 'Оплаченный, но не выданный доступ — не состояние системы.',
    problemEn: 'Paid for but not granted is not a state a system may have.',
    approachRu:
      'Backend-owned pricing, ledger, idempotency identity, fail-closed grant, refund и reconciliation.',
    approachEn:
      'Backend-owned pricing, ledgers, idempotency identity, fail-closed grants, refunds and reconciliation.',
    resultRu:
      'Повтор операции возвращает тот же результат или именованный конфликт — никогда второе списание.',
    resultEn:
      'A repeated operation returns the same result or a named conflict — never a second charge.',
    tech: ['TypeScript', 'Node.js', 'CockroachDB', 'Redis'],
  },
  {
    slug: 'ranking-data-honesty',
    titleRu: 'Ranking V3 / Data Honesty',
    titleEn: 'Ranking V3 / Data Honesty',
    problemRu: 'Математически точная, но продуктово ложная цифра убедительнее пустого поля.',
    problemEn:
      'A mathematically precise but product-invalid number is more convincing than an empty field.',
    approachRu:
      'Absolute / adjusted / category modes, cohort basis, confidence, reason taxonomy и unknown ≠ zero.',
    approachEn:
      'Absolute, adjusted and category modes with cohort basis, confidence, reason taxonomy and unknown ≠ zero.',
    resultRu: 'Три явных режима на каталоге из 230k+ объявлений; unknown остаётся unknown.',
    resultEn: 'Three explicit modes over a 230k+ catalogue; unknown stays unknown.',
    tech: ['TypeScript', 'BigQuery', 'Redis', 'React'],
  },
  {
    slug: 'search-cache-reliability',
    titleRu: 'Search / Cache Reliability',
    titleEn: 'Search / Cache Reliability',
    problemRu: 'Устаревшие данные и ложный fallback — разные состояния.',
    problemEn: 'Stale data and a false fallback are different states.',
    approachRu:
      'Versioned SWR envelopes, deterministic keys, in-flight dedupe и честный stale fallback.',
    approachEn:
      'Versioned SWR envelopes, deterministic keys, in-flight dedupe and an explicit stale fallback.',
    resultRu: 'Search V2 и виртуализация снизили нагрузку на браузер примерно на 75%.',
    resultEn: 'Search V2 and virtualisation cut browser load by roughly 75%.',
    tech: ['Redis', 'React', 'TanStack Query', 'TypeScript'],
  },
  {
    slug: 'image-similarity',
    titleRu: 'Image Similarity Pipeline',
    titleEn: 'Image Similarity Pipeline',
    problemRu: 'Поиск по фотографии среди 230k+ объявлений, который однажды вернул ноль.',
    problemEn: 'Photo search across 230k+ listings — which once returned nothing at all.',
    approachRu:
      'Quality gate, Redis → Wasabi → CLIP embeddings → Qdrant → BigQuery и fallback на original asset.',
    approachEn:
      'Quality gate, Redis → Wasabi → CLIP embeddings → Qdrant → BigQuery and original-asset fallback.',
    resultRu:
      'Причина устранена сквозь storage, embedding, vector retrieval и warehouse projection.',
    resultEn:
      'The cause was removed across storage, embedding, vector retrieval and warehouse projection.',
    tech: ['Python', 'FastAPI', 'Redis', 'Qdrant', 'BigQuery', 'S3 / Wasabi'],
  },
  {
    slug: 'financial-concurrency',
    titleRu: 'Financial Concurrency',
    titleEn: 'Financial Concurrency',
    problemRu: 'Округление ниже одного филса — потерянные деньги, а не погрешность.',
    problemEn: 'Rounding below one fils is lost money, not a rounding error.',
    approachRu:
      'Decimal money, дневной инвариант, optimistic concurrency и транзакционный перерасчёт.',
    approachEn:
      'Decimal money, a daily invariant, optimistic concurrency and transactional recalculation.',
    resultRu: 'Конфликтующие изменения отклоняются явно, без тихой потери начислений.',
    resultEn: 'Conflicting changes are rejected explicitly, without silently losing accruals.',
    tech: ['TypeScript', 'CockroachDB', 'Prisma', 'GraphQL'],
  },
  {
    slug: 'production-migration',
    titleRu: 'Production Migration',
    titleEn: 'Production Migration',
    problemRu: 'Зелёная сборка — не вывод о готовности к продакшену.',
    problemEn: 'A green build is not a conclusion about production readiness.',
    approachRu:
      'Additive schema, compatibility layer, feature flag, readiness, traffic switch, smoke и rollback.',
    approachEn:
      'Additive schema, compatibility layer, feature flags, readiness, traffic switch, smoke and rollback.',
    resultRu: 'Rollout — часть реализации: parity с legacy, production sweep и путь назад заранее.',
    resultEn:
      'Rollout is part of implementation: parity with legacy, a production sweep, the way back first.',
    tech: ['Docker', 'Kubernetes', 'GitHub Actions', 'Playwright'],
  },
] as const;

/**
 * Localised employment history. The base columns on `Experience` keep the
 * Russian text so an unknown locale still reads as one language; both locales
 * are then stated explicitly, because a Russian heading over an English summary
 * is the defect this table exists to remove.
 */
export const experiences = [
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
          description:
            'три явных режима — absolute, adjusted, category — под одним контрактом доступности',
        },
        en: {
          title: 'Ranking V3',
          description:
            'three explicit modes — absolute, adjusted, category — under one availability contract',
        },
      },
      {
        ru: {
          title: 'Поиск по фотографии',
          description:
            'Redis → Wasabi → CLIP → Qdrant → BigQuery; закрыл инцидент с нулевой выдачей',
        },
        en: {
          title: 'Photo search',
          description: 'Redis → Wasabi → CLIP → Qdrant → BigQuery; closed a zero-result incident',
        },
      },
      {
        ru: {
          title: 'Аналитика',
          description:
            'перенос с Looker на TypeScript и SQL: обращений к BigQuery примерно на 65% меньше',
        },
        en: {
          title: 'Analytics',
          description: 'moved off Looker onto TypeScript and SQL: roughly 65% fewer BigQuery calls',
        },
      },
      {
        ru: {
          title: 'Search V2',
          description: 'виртуализация выдачи снизила нагрузку на браузер примерно на 75%',
        },
        en: {
          title: 'Search V2',
          description: 'a virtualised result list cut browser load by roughly 75%',
        },
      },
      {
        ru: {
          title: 'Надёжность',
          description:
            'Redis SWR, схлопывание параллельных запросов, E2E на Playwright с API-авторизацией',
        },
        en: {
          title: 'Reliability',
          description: 'Redis SWR, in-flight dedupe, Playwright E2E with API authentication',
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
      ru: 'Внутренние торговые и аналитические системы: realtime- и исторические данные, crypto и copy trading. Алгоритмические компоненты на MQL, Python, Go и Rust — стек подбирался под требования к скорости исполнения.',
      en: 'Internal trading and analytics systems: realtime and historical data, crypto and copy trading. Algorithmic components in MQL, Python, Go and Rust, with the language chosen for the execution-speed requirement.',
    },
    highlights: [],
  },
  {
    companyLabel: 'TOT · NDA',
    role: 'Sole Frontend Developer',
    startDate: new Date('2024-12-01'),
    endDate: new Date('2025-06-01'),
    summary: {
      ru: 'Единственный фронтенд-разработчик мультипродуктовой платформы: ролевой интерфейс для семи типов пользователей и компонентная система на сотни экранных состояний.',
      en: 'The only frontend engineer on a multi-product platform: a role-based interface for seven user types and a component system covering hundreds of screen states.',
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

export const profileText = {
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
