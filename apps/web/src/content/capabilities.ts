import { Boxes, Database, Layers, ShieldCheck, Server, type LucideIcon } from 'lucide-react';
import type { Locale } from '../lib/portfolio';

export interface CapabilityMeta {
  icon: LucideIcon;
  weight: string;
  description: Record<Locale, string>;
}

/**
 * Keyed by the skill category returned from the API. A category with no entry
 * still renders — it just carries no icon or framing sentence.
 *
 * The weights are the ones from the August 2026 competency review, not a
 * self-assessment: backend 60, frontend 30, data and delivery 10.
 */
export const capabilityMeta: Record<string, CapabilityMeta> = {
  Backend: {
    icon: Server,
    weight: '60%',
    description: {
      RU: 'Деньги и доступы на TypeScript и C#. Что делать с повторным запросом — вопрос предметной области, а не заголовка в HTTP.',
      EN: 'Money and access flows in TypeScript and C#. What to do with a repeated request is a question about the domain, not about an HTTP header.',
    },
  },
  Data: {
    icon: Database,
    weight: 'Source of truth',
    description: {
      RU: 'Транзакционные и аналитические данные. Перенёс аналитику с Looker на TypeScript и SQL — обращений к BigQuery стало примерно на 65% меньше.',
      EN: 'Transactional and analytical data. Moving analytics off Looker onto TypeScript and SQL left roughly 65% fewer BigQuery calls.',
    },
  },
  Frontend: {
    icon: Layers,
    weight: '30%',
    description: {
      RU: 'Интерфейсы, где много данных и много состояний. Виртуализация выдачи в Search V2 сняла с браузера около 75% работы.',
      EN: 'Interfaces with a lot of data and a lot of state. A virtualised result list in Search V2 took roughly 75% of the work off the browser.',
    },
  },
  Infrastructure: {
    icon: Boxes,
    weight: 'Ship & operate',
    description: {
      RU: 'Контейнеры, хранилище, управляемый выкат. Зелёная сборка — условие на входе, а не разрешение катить.',
      EN: 'Containers, storage, a controlled rollout. A green build is a precondition, not permission to ship.',
    },
  },
  Quality: {
    icon: ShieldCheck,
    weight: 'Guardrails',
    description: {
      RU: 'Тесты на то, что ломается, а не на то, что и так работает. Внешний аудит команды летом 2026: доля тестов 41%, лучший результат в команде.',
      EN: 'Tests for what breaks rather than for what already works. A team audit in the summer of 2026 put the test ratio at 41%, the highest on the team.',
    },
  },
};
