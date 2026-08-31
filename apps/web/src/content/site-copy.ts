import type { Locale } from '../lib/portfolio';

/**
 * All interface copy lives here with both locales adjacent, so a Russian
 * heading cannot end up over an English paragraph. Display line breaks are
 * authored per locale because Russian runs 15–25% longer than English at the
 * same content and must not be left to the browser.
 */
export interface SiteCopy {
  skip: string;
  nav: { work: string; system: string; about: string; contact: string; menu: string };
  hero: {
    eyebrow: string;
    /** One entry per rendered display line. */
    lines: string[];
    /** Index of the line that renders behind the System Core. Pick the line
     * that actually crosses the object: a line that clears it entirely makes
     * the composition flat no matter which side of the canvas it is on. */
    behind: number;
    lead: string;
    availability: string;
    explore: string;
    source: string;
  };
  layers: { id: string; label: string; description: string }[];
  sections: {
    manifesto: string;
    work: string;
    architecture: string;
    engineering: string;
    capabilities: string;
    experience: string;
    contact: string;
  };
  engineeringSection: {
    note: string;
    build: string;
    atBuild: string;
    liveSurface: string;
    liveNote: string;
    commit: string;
    built: string;
    gates: string;
    gateList: string;
    bundle: string;
    chunks: string;
    roundTrip: string;
    events: string;
    unknown: string;
    loading: string;
    buildMissing: string;
  };
  manifesto: { lines: string[]; body: string; stack: { label: string; value: string }[] };
  work: { note: string; open: string };
  reviewer: {
    label: string;
    title: string;
    command: string;
    steps: { title: string; body: string }[];
  };
  caseNote: {
    context: string;
    decision: string;
    consequence: string;
    otherwise: string;
    close: string;
  };
  architecture: {
    note: string;
    title: string;
    cards: { label: string; heading: string; body: string }[];
  };
  data: { live: string; stale: string; failed: string; simulated: string };
  theme: { toLight: string; toDark: string };
  engineering: { open: string; close: string; title: string; note: string };
}

export const siteCopy: Record<Locale, SiteCopy> = {
  RU: {
    skip: 'К содержанию',
    nav: {
      work: 'Работы',
      system: 'Система',
      about: 'О себе',
      contact: 'Контакт',
      menu: 'Разделы',
    },
    hero: {
      eyebrow: 'Fullstack / Product Engineer',
      lines: ['Проектирую системы,', 'которые выдерживают', 'продакшен.'],
      behind: 1,
      lead: 'Backend-ориентированный fullstack-инженер. Веду вертикаль целиком: доменные инварианты, деньги и доступы, кэш, интеграции и выкат в production.',
      availability: 'Открыт к senior+ fullstack с уклоном в backend',
      explore: 'Исследовать систему',
      source: 'Исходный код',
    },
    layers: [
      {
        id: 'infra',
        label: 'INFRASTRUCTURE',
        description: 'Наблюдаемый rollout с readiness, флагами и откатом.',
      },
      {
        id: 'data',
        label: 'DATA',
        description: 'Транзакционные инварианты. Unknown остаётся unknown.',
      },
      {
        id: 'api',
        label: 'API',
        description: 'Типизированные контракты и границы, за которые не протекает домен.',
      },
    ],
    sections: {
      manifesto: 'Позиция',
      work: 'Избранные системы',
      architecture: 'Живая архитектура',
      engineering: 'Проверяемое',
      capabilities: 'Компетенции',
      experience: 'Опыт',
      contact: 'Контакт',
    },
    manifesto: {
      lines: ['Не коллекционирую', 'технологии.'],
      body: 'Одиннадцать лет работы, пять из них — коммерческая разработка; до этого управлял продажами в Coca-Cola HBC, и это до сих пор помогает обсуждать систему в терминах последствий, а не технологий. Проектирую границы, где каждая зависимость решает конкретную эксплуатационную задачу. Система должна оставаться честной под нагрузкой: деньги не теряются, доступ не выдаётся по ошибке, а недостающее значение не превращается в удобный ноль.',
      stack: [
        { label: 'Основное', value: 'TypeScript / NestJS' },
        { label: 'Данные', value: 'CockroachDB / Prisma' },
        { label: 'Кэш и очереди', value: 'Redis / BullMQ' },
        { label: 'Доставка', value: 'Docker / CI / OTel' },
      ],
    },
    work: {
      note: 'Каждый кейс — поведение под нагрузкой, а не список технологий.',
      open: 'Как это решено',
    },
    reviewer: {
      label: 'Ревьюеру',
      title: 'Что проверить за десять минут',
      command: 'git clone … && docker compose up',
      steps: [
        {
          title: 'Инженерный режим',
          body: 'Кадр, draw calls, DPR и web vitals — измеренные в вашей вкладке прямо сейчас, а не скриншот.',
        },
        {
          title: 'Секция «Проверяемое»',
          body: 'Коммит, из которого собрана эта страница, семнадцать гейтов по именам и размеры бандла, взвешенные самой сборкой.',
        },
        {
          title: 'Любой кейс → «Как это решено»',
          body: 'Фрагмент из этого репозитория со ссылкой на файл. Тест падает, если фрагмент перестал быть дословным.',
        },
        {
          title: 'Клонировать и поднять',
          body: 'CockroachDB, Redis, MinIO и API поднимаются одной командой; миграции и сид применяются к чистой базе.',
        },
        {
          title: 'Посмотреть CI',
          body: 'Семнадцать проверок до публикации: миграции на пустой базе, бюджеты, axe, снимки, Semgrep, образы.',
        },
      ],
    },
    caseNote: {
      context: 'Откуда задача',
      decision: 'Что решает этот код',
      consequence: 'Что из этого следует',
      otherwise: 'Что было бы иначе',
      close: 'Закрыть',
    },
    engineeringSection: {
      note: 'Всё, что можно проверить, не веря на слово.',
      build: 'Эта сборка',
      atBuild: 'измерено при сборке',
      liveSurface: 'Живой контур',
      liveNote:
        'Опубликованная сборка на GitHub Pages ходит в API того же origin. Его там нет — и это состояние названо, а не скрыто.',
      commit: 'Коммит',
      built: 'Собрана',
      gates: 'Гейтов до публикации',
      gateList: 'Показать проверки',
      bundle: 'Входной чанк',
      chunks: 'чанков',
      roundTrip: 'Круг',
      events: 'События',
      unknown: 'неизвестен',
      loading: 'Читаю данные сборки…',
      buildMissing:
        'Файл со сведениями о сборке недоступен — этот экран собран не нашим пайплайном.',
    },
    architecture: {
      note: 'Топология этого сайта и то, что он делает, когда зависимость исчезает.',
      title: 'Путь чтения',
      cards: [
        {
          label: 'Чтение',
          heading: 'Один GraphQL-агрегат',
          body: 'Один типизированный запрос с локалью. У фронтенда нет второго источника данных.',
        },
        {
          label: 'Отказоустойчивость',
          heading: 'Redis SWR',
          body: 'Свежее, затем устаревшее, затем честный отказ. Тихого нуля не бывает.',
        },
        {
          label: 'Данные и файлы',
          heading: 'CockroachDB + S3',
          body: 'Источник истины в базе, бинарники грузятся в хранилище напрямую, минуя API.',
        },
      ],
    },
    data: {
      live: 'Данные из источника',
      stale: 'Снимок данных',
      failed: 'API недоступен — показан проверенный статичный срез',
      simulated: 'Симуляция',
    },
    theme: { toLight: 'Включить светлую тему', toDark: 'Включить тёмную тему' },
    engineering: {
      open: 'Открыть инженерный режим',
      close: 'Закрыть',
      title: 'Инженерный режим',
      note: 'Значения измерены в этой вкладке. Ни одно из них не является числом из CI, выданным за состояние рантайма.',
    },
  },
  EN: {
    skip: 'Skip to content',
    nav: { work: 'Work', system: 'System', about: 'About', contact: 'Contact', menu: 'Sections' },
    hero: {
      eyebrow: 'Fullstack / Product Engineer',
      lines: ['I build systems', 'that hold under', 'production load.'],
      behind: 1,
      lead: 'Backend-oriented fullstack engineer. I own the vertical end to end: domain invariants, money and access, cache, integrations and the production rollout.',
      availability: 'Open to senior+ fullstack work, backend-leaning',
      explore: 'Explore the system',
      source: 'View source',
    },
    layers: [
      {
        id: 'infra',
        label: 'INFRASTRUCTURE',
        description: 'Observable rollout with readiness, flags and rollback.',
      },
      {
        id: 'data',
        label: 'DATA',
        description: 'Transactional invariants. Unknown stays unknown.',
      },
      {
        id: 'api',
        label: 'API',
        description: 'Typed contracts and boundaries the domain does not leak through.',
      },
    ],
    sections: {
      manifesto: 'Position',
      work: 'Selected systems',
      architecture: 'Live architecture',
      engineering: 'Verifiable',
      capabilities: 'Capabilities',
      experience: 'Experience',
      contact: 'Contact',
    },
    manifesto: {
      lines: ['I do not collect', 'technologies.'],
      body: 'Eleven years of work, five of them in commercial development; before that I managed sales at Coca-Cola HBC, which is still why I discuss a system in terms of consequences rather than technology. I design boundaries where every dependency solves a concrete operational problem. A system has to stay honest under load: money is not lost, access is not granted by mistake, and a missing value does not quietly become a convenient zero.',
      stack: [
        { label: 'Primary', value: 'TypeScript / NestJS' },
        { label: 'Data', value: 'CockroachDB / Prisma' },
        { label: 'Cache and queues', value: 'Redis / BullMQ' },
        { label: 'Delivery', value: 'Docker / CI / OTel' },
      ],
    },
    work: {
      note: 'Each case is behaviour under load, not a list of technologies.',
      open: 'How it is solved',
    },
    reviewer: {
      label: 'For a reviewer',
      title: 'What to check in ten minutes',
      command: 'git clone … && docker compose up',
      steps: [
        {
          title: 'Engineering mode',
          body: 'Frame time, draw calls, DPR and web vitals, measured in your own tab right now rather than screenshotted.',
        },
        {
          title: 'The verifiable section',
          body: 'The commit this page was built from, seventeen gates by name, and bundle sizes the build weighed itself.',
        },
        {
          title: 'Any case, then "How it is solved"',
          body: 'An excerpt from this repository with a link to the file. A test fails when the excerpt stops being verbatim.',
        },
        {
          title: 'Clone it and run it',
          body: 'CockroachDB, Redis, MinIO and the API come up with one command; migrations and the seed apply to a clean database.',
        },
        {
          title: 'Read the CI',
          body: 'Seventeen checks before publish: migrations on an empty database, budgets, axe, snapshots, Semgrep, images.',
        },
      ],
    },
    caseNote: {
      context: 'Where it comes from',
      decision: 'What this code decides',
      consequence: 'What follows from it',
      otherwise: 'What would happen without it',
      close: 'Close',
    },
    engineeringSection: {
      note: 'Everything here can be checked rather than taken on trust.',
      build: 'This build',
      atBuild: 'measured at build time',
      liveSurface: 'Live surface',
      liveNote:
        'The published GitHub Pages build calls an API on its own origin. There is none there — and that state is named rather than hidden.',
      commit: 'Commit',
      built: 'Built',
      gates: 'Gates before publish',
      gateList: 'Show the checks',
      bundle: 'Entry chunk',
      chunks: 'chunks',
      roundTrip: 'Round trip',
      events: 'Events',
      unknown: 'unknown',
      loading: 'Reading build evidence…',
      buildMissing: 'Build evidence is unavailable — this page was not produced by our pipeline.',
    },
    architecture: {
      note: 'The topology of this site, and what it does when a dependency disappears.',
      title: 'Read path',
      cards: [
        {
          label: 'Read',
          heading: 'One GraphQL aggregate',
          body: 'One typed, localised query. The frontend has no second source of data.',
        },
        {
          label: 'Resilience',
          heading: 'Redis SWR',
          body: 'Fresh, then stale, then an honest refusal. There is no silent zero.',
        },
        {
          label: 'Data and files',
          heading: 'CockroachDB + S3',
          body: 'Source of truth in the database; binaries go straight to storage, never through the API.',
        },
      ],
    },
    data: {
      live: 'Live from source',
      stale: 'Snapshot',
      failed: 'API unavailable — showing a verified static slice',
      simulated: 'Simulated',
    },
    theme: { toLight: 'Switch to light theme', toDark: 'Switch to dark theme' },
    engineering: {
      open: 'Open engineering mode',
      close: 'Close',
      title: 'Engineering mode',
      note: 'Values are measured in this browser session. Nothing here is a CI number presented as runtime state.',
    },
  },
};
