import { describe, expect, it } from 'vitest';
import { fallbackPortfolio } from './fallback-portfolio';

describe('static portfolio snapshot', () => {
  it('keeps both locales structurally equivalent', () => {
    expect(fallbackPortfolio.RU.caseStudies.map(({ slug }) => slug)).toEqual(
      fallbackPortfolio.EN.caseStudies.map(({ slug }) => slug),
    );
    expect(fallbackPortfolio.RU.experience).toHaveLength(fallbackPortfolio.EN.experience.length);
  });

  it('carries no English body text under the Russian locale', () => {
    // The employment history and the case results used to be shared between
    // locales, so the Russian site showed English summaries under Russian
    // headings — the copy most visitors actually read, since the published
    // build never reaches the API.
    const cyrillic = /[Ѐ-ӿ]/;
    for (const item of fallbackPortfolio.RU.experience) {
      expect(item.summary, item.company).toMatch(cyrillic);
      for (const highlight of item.highlights) expect(highlight, item.company).toMatch(cyrillic);
    }
    for (const study of fallbackPortfolio.RU.caseStudies) {
      expect(study.problem, study.slug).toMatch(cyrillic);
      expect(study.result, study.slug).toMatch(cyrillic);
    }
  });

  it('keeps the English locale free of Cyrillic', () => {
    const cyrillic = /[Ѐ-ӿ]/;
    for (const item of fallbackPortfolio.EN.experience) {
      expect(item.summary, item.company).not.toMatch(cyrillic);
    }
    for (const study of fallbackPortfolio.EN.caseStudies) {
      expect(study.problem, study.slug).not.toMatch(cyrillic);
      expect(study.result, study.slug).not.toMatch(cyrillic);
    }
  });

  it('is explicitly marked as stale', () => {
    expect(fallbackPortfolio.RU.stale).toBe(true);
    expect(fallbackPortfolio.EN.stale).toBe(true);
  });
});
