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
      ru: 'Proptech-платформа для рынка недвижимости ОАЭ. На мне бэкенд, данные и проверка того, что уехало в прод. Фронтенд — там, где он упирается в данные.',
      en: 'A proptech platform for the UAE property market. The backend, the data and checking what actually shipped are mine. The frontend where it runs into the data.',
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
      ru: 'Внутренние торговые и аналитические системы: данные в реальном времени и исторические, crypto и copy trading. Алгоритмические части на MQL, Python, Go и Rust — язык выбирался под то, насколько быстро должна отработать конкретная операция.',
      en: 'Internal trading and analytics systems: realtime and historical data, crypto and copy trading. The algorithmic parts in MQL, Python, Go and Rust, with the language picked for how fast that particular operation had to run.',
    },
    highlights: [],
  },
  {
    companyLabel: 'TOT · NDA',
    role: 'Sole Frontend Developer',
    startDate: new Date('2024-12-01'),
    endDate: new Date('2025-06-01'),
    summary: {
      ru: 'Единственный фронтенд-разработчик мультипродуктовой платформы: семь типов пользователей, у каждого свой интерфейс, и компонентная система на сотни экранных состояний.',
      en: 'The only frontend engineer on a multi-product platform: seven user types, each with its own interface, and a component system covering hundreds of screen states.',
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
