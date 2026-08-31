import { describe, expect, it } from 'vitest';
import { Locale } from '../portfolio/portfolio.models';
import { judgementChunks } from './judgement';
import { isProfileRelated, retrieve } from './retrieval';

/**
 * The questions the interface offers have to reach the answers that exist.
 *
 * The suggested questions live in the web package and the knowledge lives here,
 * so nothing but this connects them. They were restated once, deliberately: a
 * question that reaches no source is answered from whichever case study happens
 * to share a word with it, which is worse than not offering it.
 */
const SUGGESTED: Record<Locale, string[]> = {
  [Locale.EN]: [
    'Which technical decision turned out to be wrong, and how did that surface?',
    'Where did you deliberately choose the more boring option, and why?',
    'What was hardest to prove correct, rather than hardest to build?',
    'What did you refuse to build, and on what grounds?',
  ],
  [Locale.RU]: [
    'Какое техническое решение оказалось ошибкой и как это выяснилось?',
    'Где ты сознательно выбрал более скучное решение и почему?',
    'Что было сложнее всего доказать, что система работает правильно?',
    'От какой задачи ты отказался и на каком основании?',
  ],
};

const EVERY_QUESTION = [...SUGGESTED[Locale.EN], ...SUGGESTED[Locale.RU]];

/** Stand-ins for the profile chunks the service builds from portfolio data. */
const PROFILE = [
  { label: 'Profile / Stack', text: 'TypeScript, Node.js, NestJS, GraphQL, Redis, CockroachDB' },
  { label: 'Case / Money & Entitlement', text: 'Idempotency, ledger, fail-closed grant. NestJS' },
  { label: 'Experience / Refty.ai', text: 'Senior Fullstack Developer. Ranking, search, cache' },
];

describe('suggested questions', () => {
  it('are recognised as being about this profile', () => {
    for (const question of EVERY_QUESTION) {
      expect(isProfileRelated(question), question).toBe(true);
    }
  });

  it('retrieve an answer about judgement rather than a case study', () => {
    // Each locale retrieves against its own sources, the way the service does.
    for (const locale of [Locale.EN, Locale.RU] as const) {
      const chunks = [...PROFILE, ...judgementChunks(locale)];
      for (const question of SUGGESTED[locale]) {
        const [first] = retrieve(question, chunks, 4);
        expect(first?.label, question).toMatch(/^(Judgement|Суждение) \//);
      }
    }
  });

  it('say something specific enough to be checked', () => {
    for (const locale of [Locale.EN, Locale.RU] as const) {
      for (const chunk of judgementChunks(locale)) {
        expect(chunk.text.length, chunk.label).toBeGreaterThan(200);
      }
    }
  });
});
