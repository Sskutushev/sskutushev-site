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
 */
export const capabilityMeta: Record<string, CapabilityMeta> = {
  Backend: {
    icon: Server,
    weight: '60%',
    description: {
      RU: 'Доменные инварианты, money- и access-потоки, типизированные контракты, отказоустойчивые интеграции.',
      EN: 'Domain invariants, money and access flows, typed contracts, resilient integrations.',
    },
  },
  Data: {
    icon: Database,
    weight: 'Source of truth',
    description: {
      RU: 'Транзакционные и аналитические контуры. Недостающее значение остаётся недостающим.',
      EN: 'Transactional and analytical paths. A missing value stays missing.',
    },
  },
  Frontend: {
    icon: Layers,
    weight: '40%',
    description: {
      RU: 'Сложные состояния, data-heavy интерфейсы, бюджет производительности и WebGL.',
      EN: 'Complex state, data-heavy interfaces, a performance budget and WebGL.',
    },
  },
  Infrastructure: {
    icon: Boxes,
    weight: 'Ship & operate',
    description: {
      RU: 'Контейнеры, storage, контролируемый rollout с readiness и откатом.',
      EN: 'Containers, storage, controlled rollout with readiness and rollback.',
    },
  },
  Quality: {
    icon: ShieldCheck,
    weight: 'Guardrails',
    description: {
      RU: 'Негативные пути и исполняемые проверки вместо обещаний.',
      EN: 'Negative paths and executable checks instead of assurances.',
    },
  },
};
