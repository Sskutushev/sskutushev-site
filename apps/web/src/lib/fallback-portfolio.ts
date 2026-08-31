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
        'Proptech-платформа для рынка недвижимости ОАЭ. На мне бэкенд, данные и проверка того, что уехало в прод. Фронтенд — там, где он упирается в данные.',
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
        'Внутренние торговые и аналитические системы: данные в реальном времени и исторические, crypto и copy trading. Алгоритмические части на MQL, Python, Go и Rust — язык выбирался под то, насколько быстро должна отработать конкретная операция.',
      highlights: [],
    },
    {
      company: 'TOT · NDA',
      role: 'Sole Frontend Developer',
      period: '2024 — 2025',
      summary:
        'Единственный фронтенд-разработчик мультипродуктовой платформы: семь типов пользователей, у каждого свой интерфейс, и компонентная система на сотни экранных состояний.',
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
        'A proptech platform for the UAE property market. The backend, the data and checking what actually shipped are mine. The frontend where it runs into the data.',
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
        'Internal trading and analytics systems: realtime and historical data, crypto and copy trading. The algorithmic parts in MQL, Python, Go and Rust, with the language picked for how fast that particular operation had to run.',
      highlights: [],
    },
    {
      company: 'TOT · NDA',
      role: 'Sole Frontend Developer',
      period: '2024 — 2025',
      summary:
        'The only frontend engineer on a multi-product platform: seven user types, each with its own interface, and a component system covering hundreds of screen states.',
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
      ['Redis', 'React', 'TanStack Query', 'TypeScript'],
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
      ['TypeScript', 'CockroachDB', 'Prisma', 'C#'],
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
      ['Redis', 'React', 'TanStack Query', 'TypeScript'],
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
      ['TypeScript', 'CockroachDB', 'Prisma', 'C#'],
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
