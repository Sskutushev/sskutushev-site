import { describe, expect, it } from 'vitest';
import { fallbackPortfolio } from './fallback-portfolio';

describe('static portfolio snapshot', () => {
  it('keeps both locales structurally equivalent', () => {
    expect(fallbackPortfolio.RU.caseStudies.map(({ slug }) => slug)).toEqual(
      fallbackPortfolio.EN.caseStudies.map(({ slug }) => slug),
    );
    expect(fallbackPortfolio.RU.experience).toHaveLength(fallbackPortfolio.EN.experience.length);
  });

  it('is explicitly marked as stale', () => {
    expect(fallbackPortfolio.RU.stale).toBe(true);
    expect(fallbackPortfolio.EN.stale).toBe(true);
  });
});
