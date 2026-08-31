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
        'Международная proptech-платформа рынка недвижимости ОАЭ. Ownership backend, data и production-валидации; фронтенд — там, где он упирается в данные.',
      highlights: [
        'Ranking V3: три явных режима — absolute, adjusted, category — под одним контрактом доступности',
        'Поиск по фотографии: Redis → Wasabi → CLIP → Qdrant → BigQuery; закрыл инцидент с нулевой выдачей',
        'Аналитика: перенос с Looker на TypeScript и SQL: обращений к BigQuery примерно на 65% меньше',
        'Search V2: виртуализация выдачи снизила нагрузку на браузер примерно на 75%',
        'Надёжность: Redis SWR, схлопывание параллельных запросов, E2E на Playwright с API-авторизацией',
      ],
    },
    {
      company: 'Investment Fund · NDA',
      role: 'Trading Strategies / Fullstack Developer',
      period: '2021 — 2025',
      summary:
        'Внутренние торговые и аналитические системы: realtime- и исторические данные, crypto и copy trading. Алгоритмические компоненты на MQL, Python, Go и Rust — стек подбирался под требования к скорости исполнения.',
      highlights: [],
    },
    {
      company: 'TOT · NDA',
      role: 'Sole Frontend Developer',
      period: '2024 — 2025',
      summary:
        'Единственный фронтенд-разработчик мультипродуктовой платформы: ролевой интерфейс для семи типов пользователей и компонентная система на сотни экранных состояний.',
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
        'An international proptech platform for the UAE property market. Ownership of the backend, the data and production validation; the frontend where it meets the data.',
      highlights: [
        'Ranking V3: three explicit modes — absolute, adjusted, category — under one availability contract',
        'Photo search: Redis → Wasabi → CLIP → Qdrant → BigQuery; closed a zero-result incident',
        'Analytics: moved off Looker onto TypeScript and SQL: roughly 65% fewer BigQuery calls',
        'Search V2: a virtualised result list cut browser load by roughly 75%',
        'Reliability: Redis SWR, in-flight dedupe, Playwright E2E with API authentication',
      ],
    },
    {
      company: 'Investment Fund · NDA',
      role: 'Trading Strategies / Fullstack Developer',
      period: '2021 — 2025',
      summary:
        'Internal trading and analytics systems: realtime and historical data, crypto and copy trading. Algorithmic components in MQL, Python, Go and Rust, with the language chosen for the execution-speed requirement.',
      highlights: [],
    },
    {
      company: 'TOT · NDA',
      role: 'Sole Frontend Developer',
      period: '2024 — 2025',
      summary:
        'The only frontend engineer on a multi-product platform: a role-based interface for seven user types and a component system covering hundreds of screen states.',
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
      'money-entitlement',
      'Money & Entitlement',
      'Оплаченный, но не выданный доступ — не состояние системы.',
      'Backend-owned pricing, ledger, idempotency identity, fail-closed grant, refund и reconciliation.',
      'Повтор операции возвращает тот же результат или именованный конфликт — никогда второе списание.',
      ['TypeScript', 'Node.js', 'CockroachDB', 'Redis'],
    ],
    [
      'ranking-data-honesty',
      'Ranking V3 / Data Honesty',
      'Математически точная, но продуктово ложная цифра убедительнее пустого поля.',
      'Absolute / adjusted / category modes, cohort basis, confidence, reason taxonomy и unknown ≠ zero.',
      'Три явных режима на каталоге из 230k+ объявлений; unknown остаётся unknown.',
      ['TypeScript', 'BigQuery', 'Redis', 'React'],
    ],
    [
      'search-cache-reliability',
      'Search / Cache Reliability',
      'Устаревшие данные и ложный fallback — разные состояния.',
      'Versioned SWR envelopes, deterministic keys, in-flight dedupe и честный stale fallback.',
      'Search V2 и виртуализация снизили нагрузку на браузер примерно на 75%.',
      ['Redis', 'React', 'TanStack Query', 'TypeScript'],
    ],
    [
      'image-similarity',
      'Image Similarity Pipeline',
      'Поиск по фотографии среди 230k+ объявлений, который однажды вернул ноль.',
      'Quality gate, Redis → Wasabi → CLIP embeddings → Qdrant → BigQuery и fallback на original asset.',
      'Причина устранена сквозь storage, embedding, vector retrieval и warehouse projection.',
      ['Python', 'FastAPI', 'Redis', 'Qdrant', 'BigQuery', 'S3 / Wasabi'],
    ],
    [
      'financial-concurrency',
      'Financial Concurrency',
      'Округление ниже одного филса — потерянные деньги, а не погрешность.',
      'Decimal money, дневной инвариант, optimistic concurrency и транзакционный перерасчёт.',
      'Конфликтующие изменения отклоняются явно, без тихой потери начислений.',
      ['TypeScript', 'CockroachDB', 'Prisma', 'GraphQL'],
    ],
    [
      'production-migration',
      'Production Migration',
      'Зелёная сборка — не вывод о готовности к продакшену.',
      'Additive schema, compatibility layer, feature flag, readiness, traffic switch, smoke и rollback.',
      'Rollout — часть реализации: parity с legacy, production sweep и путь назад заранее.',
      ['Docker', 'Kubernetes', 'GitHub Actions', 'Playwright'],
    ],
  ],
  EN: [
    [
      'money-entitlement',
      'Money & Entitlement',
      'Paid for but not granted is not a state a system may have.',
      'Backend-owned pricing, ledgers, idempotency identity, fail-closed grants, refunds and reconciliation.',
      'A repeated operation returns the same result or a named conflict — never a second charge.',
      ['TypeScript', 'Node.js', 'CockroachDB', 'Redis'],
    ],
    [
      'ranking-data-honesty',
      'Ranking V3 / Data Honesty',
      'A mathematically precise but product-invalid number is more convincing than an empty field.',
      'Absolute, adjusted and category modes with cohort basis, confidence, reason taxonomy and unknown ≠ zero.',
      'Three explicit modes over a 230k+ catalogue; unknown stays unknown.',
      ['TypeScript', 'BigQuery', 'Redis', 'React'],
    ],
    [
      'search-cache-reliability',
      'Search / Cache Reliability',
      'Stale data and a false fallback are different states.',
      'Versioned SWR envelopes, deterministic keys, in-flight dedupe and an explicit stale fallback.',
      'Search V2 and virtualisation cut browser load by roughly 75%.',
      ['Redis', 'React', 'TanStack Query', 'TypeScript'],
    ],
    [
      'image-similarity',
      'Image Similarity Pipeline',
      'Photo search across 230k+ listings — which once returned nothing at all.',
      'Quality gate, Redis → Wasabi → CLIP embeddings → Qdrant → BigQuery and original-asset fallback.',
      'The cause was removed across storage, embedding, vector retrieval and warehouse projection.',
      ['Python', 'FastAPI', 'Redis', 'Qdrant', 'BigQuery', 'S3 / Wasabi'],
    ],
    [
      'financial-concurrency',
      'Financial Concurrency',
      'Rounding below one fils is lost money, not a rounding error.',
      'Decimal money, a daily invariant, optimistic concurrency and transactional recalculation.',
      'Conflicting changes are rejected explicitly, without silently losing accruals.',
      ['TypeScript', 'CockroachDB', 'Prisma', 'GraphQL'],
    ],
    [
      'production-migration',
      'Production Migration',
      'A green build is not a conclusion about production readiness.',
      'Additive schema, compatibility layer, feature flags, readiness, traffic switch, smoke and rollback.',
      'Rollout is part of implementation: parity with legacy, a production sweep, the way back first.',
      ['Docker', 'Kubernetes', 'GitHub Actions', 'Playwright'],
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
