import type { FlowCase } from './flow-diagram';

/**
 * The topologies behind the case chapters and the architecture section.
 *
 * Each is a named set of paths through a system that exists, not live traffic;
 * every surface that renders one says so. An unlabelled simulation standing
 * next to real telemetry is the invented-metric problem this site argues
 * against.
 */

/** Money and entitlement: one ledger entry per key, and no partial grant. */
export const moneyFlow: FlowCase = {
  nodes: [
    { id: 'request', label: 'REQUEST', x: 13, y: 12 },
    { id: 'key', label: 'IDEMPOTENCY', x: 40, y: 12 },
    { id: 'ledger', label: 'LEDGER', x: 67, y: 12 },
    { id: 'grant', label: 'GRANT', x: 86, y: 40 },
    { id: 'replay', label: 'ALREADY APPLIED', x: 40, y: 44 },
  ],
  edges: [
    { from: 'request', to: 'key' },
    { from: 'key', to: 'ledger' },
    { from: 'ledger', to: 'grant', bow: 6 },
    { from: 'key', to: 'replay', bow: -4 },
  ],
  scenarios: [
    {
      id: 'apply',
      label: { RU: 'Первое проведение', EN: 'First apply' },
      route: ['request', 'key', 'ledger', 'grant'],
      skipped: ['replay'],
      outcome: {
        status: '200 · APPLIED',
        state: 'active',
        detail: {
          RU: 'Одна проводка в реестре, доступ выдан после её подтверждения.',
          EN: 'One ledger entry, and access granted only after it is confirmed.',
        },
      },
    },
    {
      id: 'replay',
      label: { RU: 'Повтор того же ключа', EN: 'Same key replayed' },
      route: ['request', 'key', 'replay'],
      skipped: ['ledger', 'grant'],
      outcome: {
        status: '200 · IDEMPOTENT',
        state: 'active',
        detail: {
          RU: 'Реестр не тронут: повтор возвращает результат первой попытки, а не вторую проводку.',
          EN: 'The ledger is untouched: a replay returns the first result, not a second entry.',
        },
      },
    },
    {
      id: 'fail-closed',
      label: { RU: 'Выдача не подтвердилась', EN: 'Grant not confirmed' },
      route: ['request', 'key', 'ledger', 'grant'],
      states: { grant: 'failed' },
      skipped: ['replay'],
      outcome: {
        status: '409 · FAIL CLOSED',
        state: 'failed',
        detail: {
          RU: 'Проводка откатывается вместе с выдачей: заплатил, но не получил — так быть не должно.',
          EN: 'The entry rolls back with the grant: paid for but not received is not a state we allow.',
        },
      },
    },
  ],
};

/** Search and cache reliability: a provider failure degrades, it does not fall over. */
export const cacheFlow: FlowCase = {
  nodes: [
    { id: 'client', label: 'CLIENT', x: 13, y: 30 },
    { id: 'search', label: 'SEARCH', x: 38, y: 30 },
    { id: 'cache', label: 'REDIS', x: 63, y: 11 },
    { id: 'provider', label: 'PROVIDER', x: 63, y: 49 },
    { id: 'result', label: 'RESULT', x: 87, y: 30 },
  ],
  edges: [
    { from: 'client', to: 'search' },
    { from: 'search', to: 'cache', bow: -3 },
    { from: 'cache', to: 'result', bow: -3 },
    { from: 'search', to: 'provider', bow: 3 },
    { from: 'provider', to: 'result', bow: 3 },
  ],
  scenarios: [
    {
      id: 'hit',
      label: { RU: 'Попадание в кэш', EN: 'Cache hit' },
      route: ['client', 'search', 'cache', 'result'],
      skipped: ['provider'],
      outcome: {
        status: '200 · FRESH',
        state: 'active',
        detail: {
          RU: 'Провайдер не вызывается вовсе. Ответ собирается из свежего снимка.',
          EN: 'The provider is never called. The answer comes from a fresh snapshot.',
        },
      },
    },
    {
      id: 'miss',
      label: { RU: 'Промах кэша', EN: 'Cache miss' },
      route: ['client', 'search', 'provider', 'result'],
      outcome: {
        status: '200 · REFRESHED',
        state: 'active',
        detail: {
          RU: 'Параллельные промахи по одному ключу схлопываются в один запрос к провайдеру.',
          EN: 'Concurrent misses on one key collapse into a single provider call.',
        },
      },
    },
    {
      id: 'timeout',
      label: { RU: 'Таймаут провайдера', EN: 'Provider timeout' },
      route: ['client', 'search', 'cache', 'result'],
      states: { provider: 'failed', cache: 'degraded', result: 'degraded' },
      outcome: {
        status: '200 · STALE',
        state: 'degraded',
        detail: {
          RU: 'Бюджет таймаута исчерпан — отдаётся устаревший снимок, помеченный как устаревший.',
          EN: 'The timeout budget runs out; a stale snapshot is served, and labelled stale.',
        },
      },
    },
    {
      id: 'incident',
      label: { RU: 'Провайдер и кэш недоступны', EN: 'Provider and cache down' },
      route: ['client', 'search'],
      states: { provider: 'failed', cache: 'failed', result: 'failed' },
      outcome: {
        status: '503 · FAIL CLOSED',
        state: 'failed',
        detail: {
          RU: 'Отказ вместо ложного успеха: пустая выдача читалась бы как «ничего не найдено».',
          EN: 'A refusal rather than a false success: an empty result would read as "nothing found".',
        },
      },
    },
  ],
};

/** Financial concurrency: two writers, one invariant, no lost update. */
export const concurrencyFlow: FlowCase = {
  nodes: [
    { id: 'writer-a', label: 'WRITER A', x: 13, y: 12 },
    { id: 'writer-b', label: 'WRITER B', x: 13, y: 46 },
    { id: 'version', label: 'EXPECTED VERSION', x: 45, y: 29 },
    { id: 'commit', label: 'COMMIT', x: 80, y: 12 },
    { id: 'retry', label: 'RETRY', x: 80, y: 46 },
  ],
  edges: [
    { from: 'writer-a', to: 'version', bow: 3 },
    { from: 'writer-b', to: 'version', bow: -3 },
    { from: 'version', to: 'commit', bow: -3 },
    { from: 'version', to: 'retry', bow: 3 },
  ],
  scenarios: [
    {
      id: 'sequential',
      label: { RU: 'Последовательно', EN: 'Sequential' },
      route: ['writer-a', 'version', 'commit'],
      skipped: ['writer-b', 'retry'],
      outcome: {
        status: '200 · APPLIED',
        state: 'active',
        detail: {
          RU: 'Версия совпала, перерасчёт за день выполнен одной транзакцией.',
          EN: 'The version matched; the daily recalculation ran as one transaction.',
        },
      },
    },
    {
      id: 'conflict',
      label: { RU: 'Одновременная запись', EN: 'Concurrent write' },
      route: ['writer-b', 'version', 'retry'],
      states: { 'writer-a': 'active', commit: 'active' },
      outcome: {
        status: '409 · CONCURRENT_MODIFICATION',
        state: 'degraded',
        detail: {
          RU: 'Вторая транзакция видит изменённую версию и откатывается целиком. Потерянного начисления не возникает.',
          EN: 'The second transaction sees a changed version and rolls back whole. No accrual is lost.',
        },
      },
    },
    {
      id: 'retried',
      label: { RU: 'Повтор после конфликта', EN: 'Retried' },
      route: ['writer-b', 'version', 'commit'],
      skipped: ['retry'],
      outcome: {
        status: '200 · APPLIED ON RETRY',
        state: 'active',
        detail: {
          RU: 'Повтор читает актуальное состояние. Ретраится сериализационный конфликт, но не ошибка домена.',
          EN: 'The retry reads current state. A serialization conflict is retried; a domain error is not.',
        },
      },
    },
  ],
};

/** Production migration: readiness is a gate, and the way back is designed. */
export const rolloutFlow: FlowCase = {
  nodes: [
    { id: 'build', label: 'BUILD', x: 12, y: 12 },
    { id: 'migrate', label: 'MIGRATION', x: 37, y: 12 },
    { id: 'deploy', label: 'DEPLOY', x: 62, y: 12 },
    { id: 'readiness', label: 'READINESS', x: 87, y: 12 },
    { id: 'traffic', label: 'TRAFFIC', x: 62, y: 46 },
    { id: 'rollback', label: 'ROLLBACK', x: 24, y: 46 },
  ],
  edges: [
    { from: 'build', to: 'migrate' },
    { from: 'migrate', to: 'deploy' },
    { from: 'deploy', to: 'readiness' },
    { from: 'readiness', to: 'traffic', bow: 8 },
    { from: 'readiness', to: 'rollback', bow: 10 },
  ],
  scenarios: [
    {
      id: 'green',
      label: { RU: 'Штатный выкат', EN: 'Clean rollout' },
      route: ['build', 'migrate', 'deploy', 'readiness', 'traffic'],
      skipped: ['rollback'],
      outcome: {
        status: '200 · LIVE',
        state: 'active',
        detail: {
          RU: 'Миграция аддитивная, поэтому обе версии читают одну схему во время переключения.',
          EN: 'The migration is additive, so both versions read one schema across the switch.',
        },
      },
    },
    {
      id: 'not-ready',
      label: { RU: 'Readiness не прошёл', EN: 'Readiness fails' },
      route: ['build', 'migrate', 'deploy', 'readiness', 'rollback'],
      states: { readiness: 'failed' },
      skipped: ['traffic'],
      outcome: {
        status: 'HELD · ROLLED BACK',
        state: 'degraded',
        detail: {
          RU: 'Трафик не переключается. Возврат — предыдущий образ по SHA, схему откатывать не нужно.',
          EN: 'Traffic never switches. The way back is the previous image by SHA; the schema needs no rollback.',
        },
      },
    },
    {
      id: 'migration',
      label: { RU: 'Миграция не применилась', EN: 'Migration refused' },
      route: ['build', 'migrate'],
      states: { migrate: 'failed' },
      skipped: ['deploy', 'readiness', 'traffic', 'rollback'],
      outcome: {
        status: 'BLOCKED · NO DEPLOY',
        state: 'failed',
        detail: {
          RU: 'Отдельный гейт применяет миграции к чистой базе и к слепку предыдущей схемы до выката.',
          EN: 'A separate gate applies migrations to a clean database and to the previous schema before deploy.',
        },
      },
    },
  ],
};
