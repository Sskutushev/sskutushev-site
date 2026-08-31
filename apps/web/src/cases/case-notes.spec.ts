import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { fallbackPortfolio } from '../lib/fallback-portfolio';
import { caseNotes } from './case-notes';

/**
 * Every excerpt shown to a reviewer is still in the file it names.
 *
 * The whole point of showing code is that it can be checked. An excerpt that
 * has quietly stopped matching the system it illustrates is worse than showing
 * none: it reads as evidence while being decoration, and it is the kind of rot
 * nobody notices, because the page keeps rendering.
 */

const root = fileURLToPath(new URL('../../../../', import.meta.url));

describe('case notes', () => {
  it('quote their file verbatim', () => {
    for (const [slug, note] of Object.entries(caseNotes)) {
      const source = readFileSync(root + note.code.file, 'utf8');
      const excerpt = note.code.lines.join('\n');
      expect(excerpt.length, slug).toBeGreaterThan(0);
      expect(source.includes(excerpt), `${slug} → ${note.code.file}`).toBe(true);
    }
  });

  it('quote only this repository', () => {
    // Nothing from a private codebase is copied here. A public implementation
    // elsewhere is linked, not pasted, because only this repository's files can
    // be held to the assertion above.
    for (const [slug, note] of Object.entries(caseNotes)) {
      expect(note.code.file, slug).not.toMatch(/^(\.\.|\/|[a-zA-Z]:)/);
    }
  });

  it('exist for every case the site shows', () => {
    for (const locale of ['RU', 'EN'] as const) {
      for (const study of fallbackPortfolio[locale].caseStudies) {
        expect(Object.keys(caseNotes), `${locale} ${study.slug}`).toContain(study.slug);
      }
    }
  });

  it('say something in both locales', () => {
    for (const [slug, note] of Object.entries(caseNotes)) {
      for (const field of ['context', 'decision', 'consequence', 'otherwise'] as const) {
        for (const locale of ['RU', 'EN'] as const) {
          expect(note[field][locale].length, `${slug}.${field}.${locale}`).toBeGreaterThan(40);
        }
      }
      // A Russian panel with an English body is the defect the content layer
      // exists to prevent; it applies here too.
      expect(note.context.RU, slug).toMatch(/[Ѐ-ӿ]/);
      expect(note.context.EN, slug).not.toMatch(/[Ѐ-ӿ]/);
    }
  });
});
