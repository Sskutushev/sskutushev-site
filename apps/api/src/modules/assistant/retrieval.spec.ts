import { describe, expect, it } from 'vitest';
import { isProfileRelated, retrieve } from './retrieval';

const corpus = [
  { label: 'Experience / Refty', text: 'TypeScript ranking search Redis BigQuery' },
  { label: 'Profile / English', text: 'English level B1' },
  { label: 'Case / Payments', text: 'Idempotency ledger entitlement fail closed' },
];

describe('assistant retrieval', () => {
  it('ranks matching evidence ahead of unrelated chunks', () => {
    expect(retrieve('Какой уровень English?', corpus, 2)[0]?.label).toBe('Profile / English');
  });

  it('keeps deterministic corpus order when no token matches', () => {
    expect(retrieve('неизвестный вопрос', corpus, 2).map(({ label }) => label)).toEqual([
      'Experience / Refty',
      'Profile / English',
    ]);
  });

  it('separates profile intent from harmless off-topic questions', () => {
    expect(isProfileRelated('Что умеет Сергей?')).toBe(true);
    expect(isProfileRelated('What is his backend stack?')).toBe(true);
    expect(isProfileRelated('2+2=?')).toBe(false);
    expect(isProfileRelated('Что едят рыбы?')).toBe(false);
  });
});
