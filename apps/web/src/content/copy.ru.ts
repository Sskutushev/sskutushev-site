import type { SiteCopy } from './site-copy';

/**
 * The Russian half of the interface copy.
 *
 * Split out of `site-copy.ts` so the shape and the words change for different
 * reasons: the interface is edited when a surface gains a field, and these are
 * edited when a sentence is wrong. Both locales stay adjacent through the
 * `SiteCopy` type, which is what stops a Russian heading appearing over an
 * English paragraph.
 *
 * The register is deliberate. An engineer with something to prove writes in
 * aphorisms; these say what happened and what it cost, in the words anyone
 * would use out loud.
 */
export const copyRu: SiteCopy = {
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
    lead: 'Беру задачу целиком: от модели данных до выката. Обычно это деньги, доступы и поиск — места, где ошибка видна не сегодня, а через неделю в отчёте.',
    availability: 'Открыт к senior+ fullstack с уклоном в backend',
    explore: 'Исследовать систему',
    source: 'Исходный код',
  },
  layers: [
    {
      id: 'infra',
      label: 'INFRASTRUCTURE',
      description: 'Выкат, который видно: готовность, флаги, откат.',
      stack: 'Docker · GitHub Actions · OpenTelemetry',
      gain: 'Сборка прошла — это ещё не значит, что можно катить. Трафик переключается после проверки готовности, а откат готов раньше, чем выкат.',
    },
    {
      id: 'data',
      label: 'DATA',
      description: 'Инварианты в транзакции. Неизвестное остаётся неизвестным.',
      stack: 'CockroachDB · Prisma · Redis · BigQuery',
      gain: 'Если запрос пришёл дважды, деньги спишутся один раз. Второй раз вернётся тот же ответ или понятная ошибка.',
    },
    {
      id: 'api',
      label: 'API',
      description: 'Типизированные контракты и граница, за которую домен не протекает.',
      stack: 'NestJS · GraphQL · WebSocket',
      gain: 'Одна страница — один запрос. Глубина и сложность ограничены, а в текст ошибки не попадает то, чего клиенту знать не нужно.',
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
    portrait: 'Открыть фотографию',
    lines: ['Не коллекционирую', 'технологии.'],
    body: 'Одиннадцать лет работы, пять из них в разработке. До этого — продажи в Coca-Cola HBC, оттуда привычка объяснять систему через последствия, а не через стек. Каждая зависимость здесь стоит потому, что решает конкретную задачу, а не потому, что её приятно упомянуть. Под нагрузкой важно одно: деньги не теряются, доступ не выдаётся случайно, а пропущенное значение не превращается в удобный ноль.',
    stack: [
      { label: 'Основное', value: 'TypeScript / NestJS' },
      { label: 'Данные', value: 'CockroachDB / Prisma' },
      { label: 'Кэш и очереди', value: 'Redis / BullMQ' },
      { label: 'Доставка', value: 'Docker / CI / OTel' },
    ],
  },
  work: {
    note: 'Здесь про то, как система ведёт себя, когда что-то идёт не так.',
    open: 'Как это решено',
  },
  reviewer: {
    label: 'Ревьюеру',
    title: 'Что проверить за десять минут',
    command: 'git clone … && docker compose up',
    steps: [
      {
        title: 'Инженерный режим',
        body: 'Кадр, draw calls, DPR и web vitals. Замерено в вашей вкладке прямо сейчас, а не приложено скриншотом.',
      },
      {
        title: 'Секция «Проверяемое»',
        body: 'Коммит, из которого собрана эта страница, семнадцать гейтов по именам и размеры бандла — их взвесила сама сборка.',
      },
      {
        title: 'Любой кейс → «Как это решено»',
        body: 'Кусок кода из этого репозитория со ссылкой на файл. Если он разойдётся с оригиналом хоть на символ — падает тест.',
      },
      {
        title: 'Клонировать и поднять',
        body: 'CockroachDB, Redis, MinIO и API поднимаются одной командой. Миграции и данные приезжают на чистую базу.',
      },
      {
        title: 'Посмотреть CI',
        body: 'Семнадцать проверок до публикации: миграции на пустой базе, бюджеты, доступность, снимки, Semgrep, образы.',
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
    note: 'Всё это можно проверить, не веря мне на слово.',
    build: 'Эта сборка',
    atBuild: 'измерено при сборке',
    liveSurface: 'Живой контур',
    liveNote:
      'Опубликованная сборка ходит в API на том же домене. На GitHub Pages его нет — и сайт говорит об этом прямо, а не делает вид, что данные живые.',
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
    buildMissing: 'Файл со сведениями о сборке недоступен — этот экран собран не нашим пайплайном.',
  },
  architecture: {
    note: 'Как устроен этот сайт и что он делает, когда одна из частей отваливается.',
    title: 'Путь чтения',
    cards: [
      {
        label: 'Чтение',
        heading: 'Один GraphQL-агрегат',
        body: 'Одна страница — один запрос. Второго источника данных у фронтенда нет.',
      },
      {
        label: 'Отказоустойчивость',
        heading: 'Redis SWR',
        body: 'Сначала свежее, потом устаревшее, потом честное «не смог». Молча нулём не подменяется.',
      },
      {
        label: 'Данные и файлы',
        heading: 'CockroachDB + S3',
        body: 'Правда лежит в базе. Файлы идут в хранилище напрямую, мимо API.',
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
    note: 'Всё замерено в этой вкладке. Ни одно число не приехало из CI под видом рантайма.',
  },
};
