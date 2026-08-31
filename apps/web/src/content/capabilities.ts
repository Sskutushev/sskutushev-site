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
      RU: 'Доменные инварианты, money- и access-потоки. Идемпотентность — часть доменной корректности, а не деталь HTTP.',
      EN: 'Domain invariants, money and access flows. Idempotency is part of domain correctness, not an HTTP detail.',
    },
  },
  Data: {
    icon: Database,
    weight: 'Source of truth',
    description: {
      RU: 'Транзакционные и аналитические контуры. Перенос аналитики с Looker на TypeScript/SQL сократил обращения к BigQuery примерно на 65%.',
      EN: 'Transactional and analytical paths. Moving analytics off Looker onto TypeScript and SQL cut BigQuery calls by roughly 65%.',
    },
  },
  Frontend: {
    icon: Layers,
    weight: '30%',
    description: {
      RU: 'Сложные состояния и data-heavy интерфейсы. Search V2 с виртуализацией снял около 75% нагрузки с браузера.',
      EN: 'Complex state and data-heavy interfaces. Search V2 with virtualisation took roughly 75% of the load off the browser.',
    },
  },
  Infrastructure: {
    icon: Boxes,
    weight: 'Ship & operate',
    description: {
      RU: 'Контейнеры, storage, контролируемый rollout. Зелёная сборка — только одно из входных условий, а не вывод о готовности.',
      EN: 'Containers, storage, a controlled rollout. A green build is one prerequisite, not a conclusion about readiness.',
    },
  },
  Quality: {
    icon: ShieldCheck,
    weight: 'Guardrails',
    description: {
      RU: 'Негативные пути и исполняемые проверки вместо обещаний. Внешний аудит команды за лето 2026: доля тестов 41%, лучший показатель в команде.',
      EN: 'Negative paths and executable checks instead of assurances. A team audit in summer 2026 put the test ratio at 41%, the highest on the team.',
    },
  },
};
