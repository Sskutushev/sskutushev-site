import type { Locale, Portfolio } from './portfolio';

/**
 * The slice served when the API is unreachable — which is every visit to the
 * GitHub Pages build. It mirrors the seed, both locales included: shipping an
 * English employment history under Russian headings is the same defect here as
 * it is in the database, and this is the copy most visitors actually read.
 */

const skills = [
  ...['TypeScript', 'Node.js', 'NestJS', 'GraphQL', 'REST', 'WebSocket', 'Python / FastAPI'].map(
    (name) => ({ name, category: 'Backend' }),
  ),
  ...[
    'CockroachDB',
    'PostgreSQL',
    'MongoDB',
    'BigQuery',
    'ClickHouse',
    'Redis',
    'Qdrant',
    'Prisma',
  ].map((name) => ({ name, category: 'Data' })),
  ...['React', 'Next.js', 'TanStack Query', 'Three.js', 'WebGL'].map((name) => ({
    name,
    category: 'Frontend',
  })),
  ...['Docker', 'Kubernetes', 'S3 / Wasabi', 'GitHub Actions', 'OpenTelemetry'].map((name) => ({
    name,
    category: 'Infrastructure',
  })),
  ...['Playwright', 'Integration / E2E', 'Semgrep', 'Performance profiling'].map((name) => ({
    name,
    category: 'Quality',
  })),
];

const experience: Record<Locale, Portfolio['experience']> = {
  RU: [
    {
      company: 'Refty.ai',
      role: 'Senior Fullstack Developer',
      period: '2026 — NOW',
      summary:
        'Международная proptech-платформа рынка недвижимости ОАЭ. Ownership backend, data и production-валидации.',
      highlights: [
        'Ranking V3: три явных режима ранжирования и честный контракт доступности',
        'Поиск по изображению: Wasabi, CLIP, Qdrant и BigQuery — пайплайн в проде',
        'Надёжность: SWR, схлопывание параллельных запросов, E2E и регрессии на инциденты',
      ],
    },
    {
      company: 'Investment Fund · NDA',
      role: 'Trading Strategies / Fullstack Developer',
      period: '2021 — 2025',
      summary:
        'Внутренние торговые и аналитические системы: realtime- и исторические данные, крипта, copy trading, алгоритмические компоненты.',
      highlights: [],
    },
    {
      company: 'TOT · NDA',
      role: 'Sole Frontend Developer',
      period: '2024 — 2025',
      summary:
        'Фронтенд-архитектура мультипродуктовой платформы: ролевой UI и система компонентов на сотни состояний.',
      highlights: [],
    },
    {
      company: 'Coca-Cola HBC Russia',
      role: 'Senior Key Account Manager',
      period: '2015 — 2020',
      summary:
        'Управление командой, KPI и переговоры. Отсюда привычка обсуждать систему в терминах последствий для бизнеса, а не технологий.',
      highlights: [],
    },
  ],
  EN: [
    {
      company: 'Refty.ai',
      role: 'Senior Fullstack Developer',
      period: '2026 — NOW',
      summary:
        'An international proptech platform for the UAE property market. Ownership of the backend, the data and production validation.',
      highlights: [
        'Ranking V3: three explicit ranking modes and an honest availability contract',
        'Image search: a Wasabi, CLIP, Qdrant and BigQuery pipeline in production',
        'Reliability: SWR, in-flight dedupe, E2E and incident regression coverage',
      ],
    },
    {
      company: 'Investment Fund · NDA',
      role: 'Trading Strategies / Fullstack Developer',
      period: '2021 — 2025',
      summary:
        'Internal trading and analytics systems: realtime and historical data, crypto, copy trading and algorithmic components.',
      highlights: [],
    },
    {
      company: 'TOT · NDA',
      role: 'Sole Frontend Developer',
      period: '2024 — 2025',
      summary:
        'The frontend architecture of a multi-product platform: role-based UI and a component system covering hundreds of states.',
      highlights: [],
    },
    {
      company: 'Coca-Cola HBC Russia',
      role: 'Senior Key Account Manager',
      period: '2015 — 2020',
      summary:
        'Team management, KPIs and negotiation. This is where the habit of discussing a system in terms of business consequences rather than technology comes from.',
      highlights: [],
    },
  ],
};

const common = {
  skills,
  socialLinks: [
    { type: 'Email', url: 'mailto:sskutushev@gmail.com' },
    { type: 'Telegram', url: 'https://t.me/sskutushev' },
    { type: 'GitHub', url: 'https://github.com/Sskutushev' },
    { type: 'LinkedIn', url: 'https://www.linkedin.com/in/sskutushev/' },
  ],
  stale: true,
  weather: null,
};

type CaseRow = readonly [string, string, string, string, string, string[]];

function toCases(rows: readonly CaseRow[]): Portfolio['caseStudies'] {
  return rows.map(([slug, title, problem, approach, result, technologies]) => ({
    slug,
    title,
    problem,
    approach,
    result,
    technologies,
  }));
}

const caseStudies: Record<Locale, readonly CaseRow[]> = {
  RU: [
    [
      'money',
      'Money & Entitlement',
      'Деньги и доступ не терпят оптимистичных допущений.',
      'Idempotency · ledger · fail-closed grant',
      'Состояние, переживающее повтор запроса',
      ['NestJS', 'CockroachDB'],
    ],
    [
      'ranking',
      'Ranking / Data Honesty',
      'Unknown не должен превращаться в ноль.',
      'Cohorts · confidence · explicit basis',
      'Проекции, которые можно объяснить',
      ['TypeScript', 'GraphQL'],
    ],
    [
      'cache',
      'Search / Cache Reliability',
      'Сбой провайдера не должен ронять продукт.',
      'SWR · in-flight dedupe · stale truth',
      'Управляемая деградация вместо отказа',
      ['Redis', 'BullMQ'],
    ],
    [
      'vision',
      'Image Similarity Pipeline',
      'Поиск похожих объектов среди 230k+ объявлений.',
      'Wasabi · CLIP · Qdrant · BigQuery',
      'Семантический поиск по изображению',
      ['FastAPI', 'Qdrant'],
    ],
    [
      'financial-concurrency',
      'Financial Concurrency',
      'Денежные инварианты должны выдерживать конкурентные изменения.',
      'Decimal money · daily invariant · optimistic concurrency',
      'Перерасчёт без потерянных начислений',
      ['CockroachDB', 'Prisma'],
    ],
    [
      'rollout',
      'Production Migration',
      'Изменения должны выдерживать реальный rollout.',
      'Additive schema · flags · smoke · rollback',
      'Переключение трафика с готовым путём назад',
      ['Docker', 'Kubernetes'],
    ],
  ],
  EN: [
    [
      'money',
      'Money & Entitlement',
      'Money and access leave no room for optimistic assumptions.',
      'Idempotency · ledger · fail-closed grant',
      'State that survives a replayed request',
      ['NestJS', 'CockroachDB'],
    ],
    [
      'ranking',
      'Ranking / Data Honesty',
      'Unknown must never silently become zero.',
      'Cohorts · confidence · explicit basis',
      'Projections that can be explained',
      ['TypeScript', 'GraphQL'],
    ],
    [
      'cache',
      'Search / Cache Reliability',
      'A provider outage must not take the product down.',
      'SWR · in-flight dedupe · stale truth',
      'Managed degradation instead of failure',
      ['Redis', 'BullMQ'],
    ],
    [
      'vision',
      'Image Similarity Pipeline',
      'Retrieve similar property assets across 230k+ listings.',
      'Wasabi · CLIP · Qdrant · BigQuery',
      'Semantic retrieval over images',
      ['FastAPI', 'Qdrant'],
    ],
    [
      'financial-concurrency',
      'Financial Concurrency',
      'Money invariants must survive concurrent effective-dated changes.',
      'Decimal money · daily invariant · optimistic concurrency',
      'Recalculation without lost accruals',
      ['CockroachDB', 'Prisma'],
    ],
    [
      'rollout',
      'Production Migration',
      'Changes must survive a real production rollout.',
      'Additive schema · flags · smoke · rollback',
      'A traffic switch with the way back already built',
      ['Docker', 'Kubernetes'],
    ],
  ],
};

export const fallbackPortfolio: Record<Locale, Portfolio> = {
  RU: {
    ...common,
    profile: {
      fullName: 'Сергей Кутушев',
      headline: 'Senior+ Fullstack / Product Engineer · Backend 60% / Frontend 40%',
      summary:
        'Веду продуктовые вертикали целиком: доменная модель, база, API, интерфейс, интеграции и выкат в production.',
      location: 'Санкт-Петербург · Remote · UTC+3',
      availability: 'Открыт к senior+ backend-работе',
      yearsExperience: 11,
    },
    experience: experience.RU,
    caseStudies: toCases(caseStudies.RU),
  },
  EN: {
    ...common,
    profile: {
      fullName: 'Sergey Kutushev',
      headline: 'Senior+ Fullstack / Product Engineer · Backend 60% / Frontend 40%',
      summary:
        'I own product verticals end to end: domain model, database, API, interface, integrations and the production rollout.',
      location: 'Saint Petersburg · Remote · UTC+3',
      availability: 'Open to senior+ backend work',
      yearsExperience: 11,
    },
    experience: experience.EN,
    caseStudies: toCases(caseStudies.EN),
  },
};
