import type { FlowCase } from './flow-diagram';

/**
 * This site's own read path, and what it does when a dependency is gone.
 *
 * It is the same topology the architecture section names above it, so the
 * drawing and the node list cannot drift apart. The scenarios are the
 * degradation paths the cache layer actually implements, not illustrations of
 * them, which is why the incident case ends in a refusal rather than in an
 * empty portfolio.
 */
export const siteReadFlow: FlowCase = {
  nodes: [
    { id: 'client', label: 'REACT / R3F', x: 12, y: 30 },
    { id: 'graphql', label: 'GRAPHQL', x: 36, y: 30 },
    { id: 'redis', label: 'REDIS', x: 61, y: 11 },
    { id: 'cockroach', label: 'COCKROACHDB', x: 61, y: 49 },
    { id: 'response', label: 'RESPONSE', x: 87, y: 30 },
  ],
  edges: [
    { from: 'client', to: 'graphql' },
    { from: 'graphql', to: 'redis', bow: -3 },
    { from: 'redis', to: 'response', bow: -3 },
    { from: 'graphql', to: 'cockroach', bow: 3 },
    { from: 'cockroach', to: 'response', bow: 3 },
  ],
  scenarios: [
    {
      id: 'fresh',
      label: { RU: 'Свежий кэш', EN: 'Fresh cache' },
      route: ['client', 'graphql', 'redis', 'response'],
      skipped: ['cockroach'],
      outcome: {
        status: '200 · LIVE',
        state: 'active',
        detail: {
          RU: 'Один типизированный запрос с локалью. У фронтенда нет второго источника данных.',
          EN: 'One typed, localised query. The frontend has no second source of data.',
        },
      },
    },
    {
      id: 'miss',
      label: { RU: 'Промах кэша', EN: 'Cache miss' },
      route: ['client', 'graphql', 'cockroach', 'response'],
      outcome: {
        status: '200 · REFRESHED',
        state: 'active',
        detail: {
          RU: 'Читается источник истины, ключ заполняется заново. Версионированный ключ, не сброс всего кэша.',
          EN: 'The source of truth is read and the key refilled. Keys are versioned rather than flushed.',
        },
      },
    },
    {
      id: 'stale',
      label: { RU: 'База недоступна', EN: 'Database unreachable' },
      route: ['client', 'graphql', 'redis', 'response'],
      states: { cockroach: 'failed', redis: 'degraded', response: 'degraded' },
      outcome: {
        status: '200 · STALE',
        state: 'degraded',
        detail: {
          RU: 'Отдаётся последний валидный снимок с отметкой возраста. Устаревшее и выдуманное — разные вещи.',
          EN: 'The last valid snapshot is served with its age. Stale and invented are not the same thing.',
        },
      },
    },
    {
      id: 'offline',
      label: { RU: 'API недоступен', EN: 'API unavailable' },
      route: ['client'],
      states: { graphql: 'failed', redis: 'skipped', cockroach: 'skipped', response: 'degraded' },
      outcome: {
        status: 'OFFLINE · BUILT-IN CONTENT',
        state: 'degraded',
        detail: {
          RU: 'То, что вы видите сейчас на GitHub Pages: содержимое из сборки, состояние данных названо явно.',
          EN: 'What you are looking at on GitHub Pages: content from the build, with the data state named.',
        },
      },
    },
  ],
};
