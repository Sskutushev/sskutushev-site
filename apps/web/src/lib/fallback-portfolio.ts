import type { Locale, Portfolio } from './portfolio';

/**
 * The slice served when the API is unreachable — which is every visit to the
 * GitHub Pages build. It mirrors the seed, both locales included: shipping an
 * English employment history under Russian headings is the same defect here as
 * it is in the database, and this is the copy most visitors actually read.
 */

const skills = [
  ...[
    'TypeScript',
    'Node.js',
    'NestJS',
    'GraphQL',
    'REST',
    'WebSocket',
    'Python / FastAPI',
    'C#',
    '.NET',
  ].map((name) => ({ name, category: 'Backend' })),
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
        'Международная proptech-платформа для рынка недвижимости ОАЭ с 230 000+ активных объявлений. Веду полный цикл B2B/B2C-функций: backend, API, данные, платежи, безопасность, frontend и production validation.',
      highlights: [
        'Building View и My Home: продукты полного цикла с ClickHouse, Stripe, entitlements, приватными документами и production-проверкой',
        'Целостность данных и доступа: разделил DLD/Ejari, добавил basis и nullable-состояния, закрыл обходы платного API и защитил покупки',
        'Производительность Building View: сократил рендер с 994 карточек и 119 000 DOM-узлов до 45–50; добавил виртуализацию и Safari scroll anchoring',
        'Ranking V3 и аналитика: три режима под явным контрактом доступности; перенос с Looker на TypeScript/SQL сократил обращения к BigQuery примерно на 65%',
        'Поиск по фотографии: Redis → Wasabi → CLIP → Qdrant → BigQuery; устранил production-инцидент с нулевой выдачей',
        'Надёжность и выкат: Redis SWR, in-flight deduplication, Playwright E2E, Kubernetes, CronJob и проверка API и данных после выката',
      ],
    },
    {
      company: 'Частная практика / Freelance',
      role: 'Fullstack Developer',
      period: '2024 — 2025',
      summary:
        'Веб-продукты и внутренние системы от требований до MVP, запуска и поддержки: backend, REST API, авторизация, базы данных, интеграции, React/Vue-интерфейсы, UI/UX, производительность и техническое SEO.',
      highlights: [],
    },
    {
      company: 'Investment Fund · NDA',
      role: 'Trading Strategies / Fullstack Developer',
      period: '2021 — 2025',
      summary:
        'Алгоритмические торговые системы для криптовалют, валют, металлов и сырьевых инструментов: Go/Rust-сервисы, MQL-стратегии, Python-аналитика, real-time и исторические наборы до 1 млн строк, WebSocket и React-интерфейсы инвестора.',
      highlights: [],
    },
    {
      company: 'TOT · NDA',
      role: 'Sole Frontend Developer',
      period: '2024 — 2025',
      summary:
        'Единственный frontend-разработчик многофункциональной платформы: архитектура на React, Next.js и TypeScript, role-based интерфейсы, onboarding, социальная лента, подписки, marketplace, образовательные кабинеты и интеграция с UNA CMS.',
      highlights: [],
    },
    {
      company: 'Coca-Cola HBC Russia',
      role: 'Senior Key Account Manager',
      period: '2015 — 2020',
      summary:
        'Команда, KPI, переговоры. Отсюда привычка говорить о системе через последствия для бизнеса, а не через технологии.',
      highlights: [],
    },
  ],
  EN: [
    {
      company: 'Refty.ai',
      role: 'Senior Fullstack Developer',
      period: '2026 — NOW',
      summary:
        'An international proptech platform for the UAE property market with 230,000+ active listings. I own B2B/B2C features end to end: backend, APIs, data, payments, security, frontend and production validation.',
      highlights: [
        'Building View and My Home: end-to-end products with ClickHouse, Stripe, entitlements, private documents and production validation',
        'Data and access integrity: separated DLD/Ejari, added basis and nullable states, closed paid-API bypasses and protected purchases',
        'Building View performance: cut rendering from 994 cards and 119,000 DOM nodes to 45–50; added virtualisation and Safari scroll anchoring',
        'Ranking V3 and analytics: three modes under an explicit availability contract; moving from Looker to TypeScript/SQL cut BigQuery calls by roughly 65%',
        'Photo search: Redis → Wasabi → CLIP → Qdrant → BigQuery; fixed a zero-result production incident',
        'Reliability and rollout: Redis SWR, in-flight deduplication, Playwright E2E, Kubernetes, CronJobs and post-deploy API/data checks',
      ],
    },
    {
      company: 'Private Practice / Freelance',
      role: 'Fullstack Developer',
      period: '2024 — 2025',
      summary:
        'Web products and internal systems from requirements through MVP, launch and support: backend, REST APIs, authentication, databases, integrations, React/Vue interfaces, UI/UX, performance and technical SEO.',
      highlights: [],
    },
    {
      company: 'Investment Fund · NDA',
      role: 'Trading Strategies / Fullstack Developer',
      period: '2021 — 2025',
      summary:
        'Algorithmic trading systems for crypto, currencies, metals and commodities: Go/Rust services, MQL strategies, Python analytics, real-time and historical datasets up to one million rows, WebSockets and React investor interfaces.',
      highlights: [],
    },
    {
      company: 'TOT · NDA',
      role: 'Sole Frontend Developer',
      period: '2024 — 2025',
      summary:
        'The sole frontend engineer for a multi-product platform: React, Next.js and TypeScript architecture, role-based interfaces, onboarding, social feed, subscriptions, marketplace, learning portals and UNA CMS integration.',
      highlights: [],
    },
    {
      company: 'Coca-Cola HBC Russia',
      role: 'Senior Key Account Manager',
      period: '2015 — 2020',
      summary:
        'A team, KPIs, negotiation. This is where the habit of talking about a system through business consequences rather than technology comes from.',
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
      'Человек заплатил, а доступ не открылся. Такого состояния у системы быть не должно.',
      'Цену считает бэкенд. Ключ повтора — сама операция, а не дата с суммой. Хранилище недоступно — доступ не выдаётся.',
      'Повтор возвращает тот же ответ или понятный конфликт. Второго списания не бывает.',
      ['TypeScript', 'Node.js', 'CockroachDB', 'Redis'],
    ],
    [
      'ranking-data-honesty',
      'Ranking V3 / Data Honesty',
      'Цифра, посчитанная верно, но означающая не то, что думает читатель, опаснее пустого поля.',
      'Три режима — absolute, adjusted, category. У каждого числа видно выборку и уверенность. Данных нет — так и написано.',
      'Три явных режима на каталоге из 230 тысяч объявлений. Неизвестное остаётся неизвестным.',
      ['TypeScript', 'BigQuery', 'Redis', 'React'],
    ],
    [
      'search-cache-reliability',
      'Search / Cache Reliability',
      'Показать старые данные и показать выдуманные — это разные вещи, и путать их нельзя.',
      'Версионированный кэш, предсказуемые ключи, параллельные запросы схлопываются в один. Устарело — так и помечено.',
      'Search V2 и виртуализация выдачи сняли с браузера примерно 75% работы.',
      ['Redis', 'React', 'TanStack Query', 'TypeScript', '.NET'],
    ],
    [
      'image-similarity',
      'Image Similarity Pipeline',
      'Поиск по фотографии среди 230 тысяч объявлений. Однажды он перестал находить вообще что-либо.',
      'Проверка качества снимка, дальше Redis → Wasabi → CLIP → Qdrant → BigQuery, с откатом на исходный файл.',
      'Причина нашлась не в одном месте, а в четырёх сразу: хранилище, эмбеддинги, векторный поиск, витрина. Убрал во всех.',
      ['Python', 'FastAPI', 'Redis', 'Qdrant', 'BigQuery', 'S3 / Wasabi'],
    ],
    [
      'financial-concurrency',
      'Financial Concurrency',
      'Округление ниже одного филса — это не погрешность. Это потерянные деньги, просто их не видно сразу.',
      'Деньги в decimal, дневной инвариант, оптимистичные блокировки и пересчёт внутри одной транзакции.',
      'Конкурирующие правки отклоняются явно. Начисления не пропадают молча.',
      ['TypeScript', 'CockroachDB', 'Prisma', 'C#', 'MongoDB'],
    ],
    [
      'production-migration',
      'Production Migration',
      'Сборка зелёная — это ещё не значит, что миграцию можно катить на прод.',
      'Схема только расширяется, старый код живёт через слой совместимости. Флаг, готовность, переключение трафика, smoke, откат.',
      'Выкат — часть работы, а не то, что делают после неё: сверка со старой системой, прогон на проде и заранее готовый путь назад.',
      ['Docker', 'Kubernetes', 'GitHub Actions', 'Playwright'],
    ],
  ],
  EN: [
    [
      'money-entitlement',
      'Money & Entitlement',
      'Someone paid and the access never opened. A system should not be able to be in that state.',
      'The backend owns the price. The repeat key is the operation itself, not a date and an amount. If storage is down, access is not granted.',
      'A repeat returns the same answer, or a conflict with a name on it. There is never a second charge.',
      ['TypeScript', 'Node.js', 'CockroachDB', 'Redis'],
    ],
    [
      'ranking-data-honesty',
      'Ranking V3 / Data Honesty',
      'A number that is arithmetically right but does not mean what the reader thinks it means is worse than an empty field.',
      'Three modes — absolute, adjusted, category. Every number shows its cohort and its confidence. No data says no data.',
      'Three explicit modes over a catalogue of 230 thousand listings. Unknown stays unknown.',
      ['TypeScript', 'BigQuery', 'Redis', 'React'],
    ],
    [
      'search-cache-reliability',
      'Search / Cache Reliability',
      'Showing old data and showing invented data are different things, and they must not be confused.',
      'A versioned cache, predictable keys, concurrent requests collapsed into one. Stale is labelled stale.',
      'Search V2 and a virtualised result list took roughly 75% of the work off the browser.',
      ['Redis', 'React', 'TanStack Query', 'TypeScript', '.NET'],
    ],
    [
      'image-similarity',
      'Image Similarity Pipeline',
      'Photo search across 230 thousand listings. One day it stopped finding anything at all.',
      'A quality check on the photo, then Redis → Wasabi → CLIP → Qdrant → BigQuery, with a fallback to the original file.',
      'The cause was not in one place but in four at once: storage, embeddings, vector retrieval, the warehouse projection. All four were fixed.',
      ['Python', 'FastAPI', 'Redis', 'Qdrant', 'BigQuery', 'S3 / Wasabi'],
    ],
    [
      'financial-concurrency',
      'Financial Concurrency',
      'Rounding below one fils is not a rounding error. It is lost money — it just does not look like it at first.',
      'Money in decimal, a daily invariant, optimistic locking, and the recalculation inside a single transaction.',
      'Competing edits are rejected out loud. Accruals do not disappear quietly.',
      ['TypeScript', 'CockroachDB', 'Prisma', 'C#', 'MongoDB'],
    ],
    [
      'production-migration',
      'Production Migration',
      'A green build does not mean the migration is safe to run in production.',
      'The schema only grows; the old code lives through a compatibility layer. A flag, readiness, the traffic switch, smoke, rollback.',
      'The rollout is part of the work, not something that happens after it: parity with the old system, a production sweep, and the way back ready in advance.',
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
      summary: 'Беру продуктовую задачу целиком: модель, база, API, интерфейс, интеграции и выкат.',
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
        'I take a product problem end to end: the model, the database, the API, the interface, the integrations and the rollout.',
      location: 'Saint Petersburg · Remote · UTC+3',
      availability: 'Open to senior+ backend work',
      yearsExperience: 11,
    },
    experience: experience.EN,
    caseStudies: toCases(caseStudies.EN),
  },
};
