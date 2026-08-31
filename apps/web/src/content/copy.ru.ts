import type { SiteCopy } from './site-copy';

/**
 * The Russian half of the interface copy.
 *
 * Split out of `site-copy.ts` so the shape and the words change for different
 * reasons: the interface is edited when a surface gains a field, and these are
 * edited when a sentence is wrong. Both locales stay adjacent through the
 * `SiteCopy` type, which is what stops a Russian heading appearing over an
 * English paragraph.
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
      stack: 'Docker · GitHub Actions · OpenTelemetry',
      gain: 'Зелёная сборка — не вывод о готовности. Трафик переключается после проверки readiness, а путь назад собран заранее.',
    },
    {
      id: 'data',
      label: 'DATA',
      description: 'Транзакционные инварианты. Unknown остаётся unknown.',
      stack: 'CockroachDB · Prisma · Redis · BigQuery',
      gain: 'Повтор операции возвращает тот же результат или именованный конфликт — никогда второе списание.',
    },
    {
      id: 'api',
      label: 'API',
      description: 'Типизированные контракты и границы, за которые не протекает домен.',
      stack: 'NestJS · GraphQL · WebSocket',
      gain: 'Один типизированный запрос с локалью, лимиты глубины и сложности, ошибки без внутренних деталей наружу.',
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
    buildMissing: 'Файл со сведениями о сборке недоступен — этот экран собран не нашим пайплайном.',
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
};
