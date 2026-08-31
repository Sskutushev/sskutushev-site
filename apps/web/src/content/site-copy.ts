import type { Locale } from '../lib/portfolio';

/**
 * All interface copy lives here with both locales adjacent, so a Russian
 * heading cannot end up over an English paragraph. Display line breaks are
 * authored per locale because Russian runs 15–25% longer than English at the
 * same content and must not be left to the browser.
 */
export interface SiteCopy {
  skip: string;
  nav: { work: string; system: string; about: string; contact: string };
  hero: {
    eyebrow: string;
    /** One entry per rendered display line. */
    lines: string[];
    /** Index of the line that renders behind the System Core. */
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
    capabilities: string;
    experience: string;
    contact: string;
  };
  manifesto: { lines: string[]; body: string };
  data: { live: string; stale: string; failed: string; simulated: string };
  theme: { toLight: string; toDark: string };
  engineering: { open: string; close: string; title: string };
}

export const siteCopy: Record<Locale, SiteCopy> = {
  RU: {
    skip: 'К содержанию',
    nav: { work: 'Работы', system: 'Система', about: 'О себе', contact: 'Контакт' },
    hero: {
      eyebrow: 'Fullstack / Product Engineer',
      lines: ['Проектирую системы,', 'которые выдерживают', 'продакшен.'],
      behind: 0,
      lead: 'Backend-ориентированный инженер. 11 лет в продукте — от денежных инвариантов до наблюдаемого rollout.',
      availability: 'Открыт к senior+ backend-работе',
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
      capabilities: 'Компетенции',
      experience: 'Опыт',
      contact: 'Контакт',
    },
    manifesto: {
      lines: ['Не коллекционирую', 'технологии.'],
      body: 'Проектирую границы, где каждая зависимость решает конкретную эксплуатационную задачу. Система должна оставаться честной, когда начинается реальная нагрузка: деньги не теряются, доступ не выдаётся по ошибке, а недостающие данные не превращаются в удобный ноль.',
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
    },
  },
  EN: {
    skip: 'Skip to content',
    nav: { work: 'Work', system: 'System', about: 'About', contact: 'Contact' },
    hero: {
      eyebrow: 'Fullstack / Product Engineer',
      lines: ['I build systems', 'that hold under', 'production load.'],
      behind: 0,
      lead: 'Backend-oriented engineer. 11 years in product — from money invariants to observable rollout.',
      availability: 'Open to senior+ backend work',
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
      capabilities: 'Capabilities',
      experience: 'Experience',
      contact: 'Contact',
    },
    manifesto: {
      lines: ['I do not collect', 'technologies.'],
      body: 'I design boundaries where every dependency solves a concrete operational problem. A system has to stay honest once real load arrives: money is not lost, access is not granted by mistake, and missing data does not quietly become a convenient zero.',
    },
    data: {
      live: 'Live from source',
      stale: 'Snapshot',
      failed: 'API unavailable — showing a verified static slice',
      simulated: 'Simulated',
    },
    theme: { toLight: 'Switch to light theme', toDark: 'Switch to dark theme' },
    engineering: { open: 'Open engineering mode', close: 'Close', title: 'Engineering mode' },
  },
};
