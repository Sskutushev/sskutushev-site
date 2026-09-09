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
  ['C#', 'Backend'],
  ['.NET', 'Backend'],
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
    problemRu: 'Человек заплатил, а доступ не открылся. Такого состояния у системы быть не должно.',
    problemEn:
      'Someone paid and the access never opened. A system should not be able to be in that state.',
    approachRu:
      'Цену считает бэкенд. Ключ повтора — сама операция, а не дата с суммой. Хранилище недоступно — доступ не выдаётся.',
    approachEn:
      'The backend owns the price. The repeat key is the operation itself, not a date and an amount. If storage is down, access is not granted.',
    resultRu: 'Повтор возвращает тот же ответ или понятный конфликт. Второго списания не бывает.',
    resultEn:
      'A repeat returns the same answer, or a conflict with a name on it. There is never a second charge.',
    tech: ['TypeScript', 'Node.js', 'CockroachDB', 'Redis'],
  },
  {
    slug: 'ranking-data-honesty',
    titleRu: 'Ranking V3 / Data Honesty',
    titleEn: 'Ranking V3 / Data Honesty',
    problemRu:
      'Цифра, посчитанная верно, но означающая не то, что думает читатель, опаснее пустого поля.',
    problemEn:
      'A number that is arithmetically right but does not mean what the reader thinks it means is worse than an empty field.',
    approachRu:
      'Три режима — absolute, adjusted, category. У каждого числа видно выборку и уверенность. Данных нет — так и написано.',
    approachEn:
      'Three modes — absolute, adjusted, category. Every number shows its cohort and its confidence. No data says no data.',
    resultRu:
      'Три явных режима на каталоге из 230 тысяч объявлений. Неизвестное остаётся неизвестным.',
    resultEn:
      'Three explicit modes over a catalogue of 230 thousand listings. Unknown stays unknown.',
    tech: ['TypeScript', 'BigQuery', 'Redis', 'React'],
  },
  {
    slug: 'search-cache-reliability',
    titleRu: 'Search / Cache Reliability',
    titleEn: 'Search / Cache Reliability',
    problemRu:
      'Показать старые данные и показать выдуманные — это разные вещи, и путать их нельзя.',
    problemEn:
      'Showing old data and showing invented data are different things, and they must not be confused.',
    approachRu:
      'Версионированный кэш, предсказуемые ключи, параллельные запросы схлопываются в один. Устарело — так и помечено.',
    approachEn:
      'A versioned cache, predictable keys, concurrent requests collapsed into one. Stale is labelled stale.',
    resultRu: 'Search V2 и виртуализация выдачи сняли с браузера примерно 75% работы.',
    resultEn:
      'Search V2 and a virtualised result list took roughly 75% of the work off the browser.',
    tech: ['Redis', 'React', 'TanStack Query', 'TypeScript', '.NET'],
  },
  {
    slug: 'image-similarity',
    titleRu: 'Image Similarity Pipeline',
    titleEn: 'Image Similarity Pipeline',
    problemRu:
      'Поиск по фотографии среди 230 тысяч объявлений. Однажды он перестал находить вообще что-либо.',
    problemEn:
      'Photo search across 230 thousand listings. One day it stopped finding anything at all.',
    approachRu:
      'Проверка качества снимка, дальше Redis → Wasabi → CLIP → Qdrant → BigQuery, с откатом на исходный файл.',
    approachEn:
      'A quality check on the photo, then Redis → Wasabi → CLIP → Qdrant → BigQuery, with a fallback to the original file.',
    resultRu:
      'Причина нашлась не в одном месте, а в четырёх сразу: хранилище, эмбеддинги, векторный поиск, витрина. Убрал во всех.',
    resultEn:
      'The cause was not in one place but in four at once: storage, embeddings, vector retrieval, the warehouse projection. All four were fixed.',
    tech: ['Python', 'FastAPI', 'Redis', 'Qdrant', 'BigQuery', 'S3 / Wasabi'],
  },
  {
    slug: 'financial-concurrency',
    titleRu: 'Financial Concurrency',
    titleEn: 'Financial Concurrency',
    problemRu:
      'Округление ниже одного филса — это не погрешность. Это потерянные деньги, просто их не видно сразу.',
    problemEn:
      'Rounding below one fils is not a rounding error. It is lost money — it just does not look like it at first.',
    approachRu:
      'Деньги в decimal, дневной инвариант, оптимистичные блокировки и пересчёт внутри одной транзакции.',
    approachEn:
      'Money in decimal, a daily invariant, optimistic locking, and the recalculation inside a single transaction.',
    resultRu: 'Конкурирующие правки отклоняются явно. Начисления не пропадают молча.',
    resultEn: 'Competing edits are rejected out loud. Accruals do not disappear quietly.',
    tech: ['TypeScript', 'CockroachDB', 'Prisma', 'C#', 'MongoDB'],
  },
  {
    slug: 'production-migration',
    titleRu: 'Production Migration',
    titleEn: 'Production Migration',
    problemRu: 'Сборка зелёная — это ещё не значит, что миграцию можно катить на прод.',
    problemEn: 'A green build does not mean the migration is safe to run in production.',
    approachRu:
      'Схема только расширяется, старый код живёт через слой совместимости. Флаг, готовность, переключение трафика, smoke, откат.',
    approachEn:
      'The schema only grows; the old code lives through a compatibility layer. A flag, readiness, the traffic switch, smoke, rollback.',
    resultRu:
      'Выкат — часть работы, а не то, что делают после неё: сверка со старой системой, прогон на проде и заранее готовый путь назад.',
    resultEn:
      'The rollout is part of the work, not something that happens after it: parity with the old system, a production sweep, and the way back ready in advance.',
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
      ru: 'Международная proptech-платформа для рынка недвижимости ОАЭ с 230 000+ активных объявлений. Веду полный цикл B2B/B2C-функций: backend, API, данные, платежи, безопасность, frontend и production validation.',
      en: 'An international proptech platform for the UAE property market with 230,000+ active listings. I own B2B/B2C features end to end: backend, APIs, data, payments, security, frontend and production validation.',
    },
    highlights: [
      {
        ru: {
          title: 'Building View и My Home',
          description:
            'инвесторский и owner-продукты полного цикла: ClickHouse-аналитика, тарифы, Stripe, entitlements, приватные документы и production-проверка',
        },
        en: {
          title: 'Building View and My Home',
          description:
            'end-to-end investor and owner products: ClickHouse analytics, pricing, Stripe, entitlements, private documents and production validation',
        },
      },
      {
        ru: {
          title: 'Целостность данных и доступа',
          description:
            'разделил DLD/Ejari, добавил basis и nullable-состояния, закрыл обходы платного API и защитил одиночные и массовые покупки',
        },
        en: {
          title: 'Data and access integrity',
          description:
            'separated DLD/Ejari markets, added basis and nullable states, closed paid-API bypasses and protected single and bulk purchases',
        },
      },
      {
        ru: {
          title: 'Производительность Building View',
          description:
            'сократил одновременный рендер с 994 карточек и 119 000 DOM-узлов до 45–50; добавил динамическую виртуализацию и Safari scroll anchoring',
        },
        en: {
          title: 'Building View performance',
          description:
            'cut concurrent rendering from 994 cards and 119,000 DOM nodes to 45–50; added dynamic virtualisation and Safari scroll anchoring',
        },
      },
      {
        ru: {
          title: 'Ranking V3 и аналитика',
          description:
            'absolute, adjusted и category ranking под явным контрактом доступности; перенос с Looker на TypeScript/SQL сократил обращения к BigQuery примерно на 65%',
        },
        en: {
          title: 'Ranking V3 and analytics',
          description:
            'absolute, adjusted and category ranking under an explicit availability contract; moving analytics from Looker to TypeScript/SQL cut BigQuery calls by roughly 65%',
        },
      },
      {
        ru: {
          title: 'Поиск по фотографии',
          description:
            'Redis → Wasabi → CLIP → Qdrant → BigQuery; диагностировал и устранил production-инцидент с нулевой выдачей',
        },
        en: {
          title: 'Photo search',
          description:
            'Redis → Wasabi → CLIP → Qdrant → BigQuery; diagnosed and fixed a zero-result production incident',
        },
      },
      {
        ru: {
          title: 'Надёжность и выкат',
          description:
            'Redis SWR, in-flight deduplication, Playwright API-auth/multi-server/cross-browser E2E, Kubernetes, CronJob и проверка API и данных после выката',
        },
        en: {
          title: 'Reliability and rollout',
          description:
            'Redis SWR, in-flight deduplication, Playwright API-auth/multi-server/cross-browser E2E, Kubernetes, CronJobs and post-deploy API/data checks',
        },
      },
    ],
  },
  {
    companyLabel: 'Private Practice / Freelance',
    role: 'Fullstack Developer',
    startDate: new Date('2024-01-01'),
    endDate: new Date('2025-12-01'),
    summary: {
      ru: 'Заказная разработка веб-продуктов и внутренних систем от требований до MVP, запуска и поддержки: backend, REST API, авторизация, базы данных, интеграции, React/Vue-интерфейсы, UI/UX, производительность и техническое SEO.',
      en: 'Client web products and internal systems from requirements through MVP, launch and support: backend, REST APIs, authentication, databases, integrations, React/Vue interfaces, UI/UX, performance and technical SEO.',
    },
    highlights: [],
  },
  {
    companyLabel: 'Investment Fund · NDA',
    role: 'Trading Strategies / Fullstack Developer',
    startDate: new Date('2021-03-01'),
    endDate: new Date('2025-12-01'),
    summary: {
      ru: 'Алгоритмические торговые системы для криптовалют, валют, металлов и сырьевых инструментов: Go/Rust-сервисы, MQL-стратегии, Python-аналитика, real-time и исторические наборы до 1 млн строк, WebSocket и React-интерфейсы инвестора.',
      en: 'Algorithmic trading systems for crypto, currencies, metals and commodities: Go/Rust services, MQL strategies, Python analytics, real-time and historical datasets up to one million rows, WebSockets and React investor interfaces.',
    },
    highlights: [],
  },
  {
    companyLabel: 'TOT · NDA',
    role: 'Sole Frontend Developer',
    startDate: new Date('2024-12-01'),
    endDate: new Date('2025-06-01'),
    summary: {
      ru: 'Единственный frontend-разработчик многофункциональной платформы: архитектура на React, Next.js и TypeScript, role-based интерфейсы, onboarding, социальная лента, подписки, marketplace, образовательные кабинеты и интеграция с UNA CMS.',
      en: 'The sole frontend engineer for a multi-product platform: React, Next.js and TypeScript architecture, role-based interfaces, onboarding, social feed, subscriptions, marketplace, learning portals and UNA CMS integration.',
    },
    highlights: [],
  },
  {
    companyLabel: 'Coca-Cola HBC Russia',
    role: 'Senior Key Account Manager',
    startDate: new Date('2015-02-01'),
    endDate: new Date('2020-12-01'),
    summary: {
      ru: 'Команда, KPI, переговоры. Отсюда привычка говорить о системе через последствия для бизнеса, а не через технологии.',
      en: 'A team, KPIs, negotiation. This is where the habit of talking about a system through business consequences rather than technology comes from.',
    },
    highlights: [],
  },
] as const;

export const profileText = {
  ru: {
    headline: 'Senior+ Fullstack / Product Engineer · Backend 60% / Frontend 40%',
    summary: 'Беру продуктовую задачу целиком: модель, база, API, интерфейс, интеграции и выкат.',
    location: 'Санкт-Петербург · Remote · UTC+3',
    availability: 'Открыт к senior+ backend-работе',
  },
  en: {
    headline: 'Senior+ Fullstack / Product Engineer · Backend 60% / Frontend 40%',
    summary:
      'I take a product problem end to end: the model, the database, the API, the interface, the integrations and the rollout.',
    location: 'Saint Petersburg · Remote · UTC+3',
    availability: 'Open to senior+ backend work',
  },
} as const;
