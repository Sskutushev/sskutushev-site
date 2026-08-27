import type { Locale, Portfolio } from './portfolio';

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

const experience: Portfolio['experience'] = [
  {
    company: 'Refty.ai',
    role: 'Senior Fullstack Developer',
    period: '2026 — NOW',
    summary: 'Backend-oriented ownership of a data-intensive UAE proptech platform.',
    highlights: [
      'Ranking, search and cache reliability across 230k+ listings',
      'BigQuery workload reduced by approximately 65%',
      'Browser load reduced by approximately 75% in Search V2',
    ],
  },
  {
    company: 'Investment fund · NDA',
    role: 'Software Engineer',
    period: '2021 — 2025',
    summary: 'Trading, analytics and realtime systems across web and quantitative components.',
    highlights: ['React / TypeScript market interfaces', 'Python, Go, Rust and MQL components'],
  },
  {
    company: 'TOT · NDA',
    role: 'Frontend Developer',
    period: '2024 — 2025',
    summary:
      'Owned the frontend contour of a multi-product platform as the sole frontend engineer.',
    highlights: ['Hundreds of responsive role-based states', 'Reusable typed component system'],
  },
  {
    company: 'Coca-Cola HBC',
    role: 'Senior Key Account Specialist',
    period: '2015 — 2020',
    summary: 'Business ownership that now informs product decisions and stakeholder communication.',
    highlights: [],
  },
];

const common = {
  skills,
  experience,
  socialLinks: [
    { type: 'Email', url: 'mailto:sskutushev@gmail.com' },
    { type: 'Telegram', url: 'https://t.me/sskutushev' },
    { type: 'GitHub', url: 'https://github.com/Sskutushev' },
    { type: 'LinkedIn', url: 'https://www.linkedin.com/in/sskutushev/' },
  ],
  stale: true,
};

export const fallbackPortfolio: Record<Locale, Portfolio> = {
  RU: {
    ...common,
    profile: {
      fullName: 'Сергей Кутушев',
      headline: 'Senior+ Fullstack / Product Engineer · Backend 60% / Frontend 40%',
      summary:
        'Проектирую надёжные продуктовые системы — от бизнес-инвариантов и API-контрактов до наблюдаемого production rollout.',
      location: 'Санкт-Петербург · Remote · UTC+3',
      availability: 'Открыт к содержательной backend-работе',
      yearsExperience: 11,
    },
    caseStudies: [
      [
        'money',
        'Money & Entitlement',
        'Деньги и доступ не терпят оптимистичных допущений.',
        'Idempotency · ledger · fail-closed grant',
        'Replay-safe state machine',
        ['NestJS', 'CockroachDB'],
      ],
      [
        'ranking',
        'Ranking / Data Honesty',
        'Unknown не должен превращаться в ноль.',
        'Cohorts · confidence · explicit basis',
        'Explainable projections',
        ['TypeScript', 'GraphQL'],
      ],
      [
        'cache',
        'Search / Cache Reliability',
        'Сбой провайдера не должен ронять продукт.',
        'SWR · in-flight dedupe · stale truth',
        'Graceful degradation',
        ['Redis', 'BullMQ'],
      ],
      [
        'vision',
        'Image Similarity Pipeline',
        'Поиск похожих объектов среди 230k+ объявлений.',
        'Wasabi · CLIP · Qdrant · BigQuery',
        'Semantic retrieval pipeline',
        ['FastAPI', 'Qdrant'],
      ],
      [
        'analytics',
        'Analytics Migration',
        'Дорогая внешняя аналитика ограничивала продукт.',
        'Typed TS / SQL provider boundary',
        'Около 65% меньше BigQuery-запросов',
        ['BigQuery', 'TypeScript'],
      ],
      [
        'rollout',
        'Production Migration',
        'Изменения должны выдерживать реальный rollout.',
        'Additive schema · flags · smoke · rollback',
        'Controlled production cutover',
        ['Docker', 'Kubernetes'],
      ],
    ].map(([slug, title, problem, approach, result, technologies]) => ({
      slug,
      title,
      problem,
      approach,
      result,
      technologies,
    })) as Portfolio['caseStudies'],
  },
  EN: {
    ...common,
    profile: {
      fullName: 'Sergey Kutushev',
      headline: 'Senior+ Fullstack / Product Engineer · Backend 60% / Frontend 40%',
      summary:
        'I build reliable product systems — from business invariants and typed API contracts to observable production rollouts.',
      location: 'Saint Petersburg · Remote · UTC+3',
      availability: 'Open to meaningful backend work',
      yearsExperience: 11,
    },
    caseStudies: [
      [
        'money',
        'Money & Entitlement',
        'Money and access leave no room for optimistic assumptions.',
        'Idempotency · ledger · fail-closed grant',
        'Replay-safe state machine',
        ['NestJS', 'CockroachDB'],
      ],
      [
        'ranking',
        'Ranking / Data Honesty',
        'Unknown must never silently become zero.',
        'Cohorts · confidence · explicit basis',
        'Explainable projections',
        ['TypeScript', 'GraphQL'],
      ],
      [
        'cache',
        'Search / Cache Reliability',
        'A provider outage must not take the product down.',
        'SWR · in-flight dedupe · stale truth',
        'Graceful degradation',
        ['Redis', 'BullMQ'],
      ],
      [
        'vision',
        'Image Similarity Pipeline',
        'Retrieve similar property assets across 230k+ listings.',
        'Wasabi · CLIP · Qdrant · BigQuery',
        'Semantic retrieval pipeline',
        ['FastAPI', 'Qdrant'],
      ],
      [
        'analytics',
        'Analytics Migration',
        'Expensive external analytics constrained the product.',
        'Typed TS / SQL provider boundary',
        'Approximately 65% fewer BigQuery requests',
        ['BigQuery', 'TypeScript'],
      ],
      [
        'rollout',
        'Production Migration',
        'Changes must survive a real production rollout.',
        'Additive schema · flags · smoke · rollback',
        'Controlled production cutover',
        ['Docker', 'Kubernetes'],
      ],
    ].map(([slug, title, problem, approach, result, technologies]) => ({
      slug,
      title,
      problem,
      approach,
      result,
      technologies,
    })) as Portfolio['caseStudies'],
  },
};
