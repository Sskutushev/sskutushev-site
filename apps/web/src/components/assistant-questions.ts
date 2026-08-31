import type { Locale } from '../lib/portfolio';

/**
 * The questions worth asking.
 *
 * The old set — strengths, stack, English level — is what a screening call
 * covers in its first two minutes, and the answers are already on the page.
 * These ask about judgement instead: what was refused, what was got wrong, what
 * a decision cost. They are the questions an interviewer tends not to reach,
 * and the ones whose answers actually separate engineers.
 */
export const ASSISTANT_QUESTIONS: Record<Locale, string[]> = {
  RU: [
    'Какое техническое решение оказалось ошибкой и как это выяснилось?',
    'Где ты сознательно выбрал более скучное решение и почему?',
    'Что было сложнее всего доказать, что система работает правильно?',
    'От какой задачи ты отказался и на каком основании?',
  ],
  EN: [
    'Which technical decision turned out to be wrong, and how did that surface?',
    'Where did you deliberately choose the more boring option, and why?',
    'What was hardest to prove correct, rather than hardest to build?',
    'What did you refuse to build, and on what grounds?',
  ],
};
