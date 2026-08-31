import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { fallbackPortfolio } from '../lib/fallback-portfolio';

/**
 * Every case the site can show has to have a visual.
 *
 * The static slice and the database seed carried different slugs for the same
 * six cases — `cache` against `search-cache-reliability` — and the visual is
 * chosen by slug. The chapters therefore had their diagrams only while the API
 * was unreachable; against a live API every one of them would have rendered as
 * a title and two paragraphs. Nothing in the build compares the two sources,
 * so this does.
 */

/** Slugs the seed writes, read from the seed itself rather than restated. */
function seedSlugs(): string[] {
  const seed = readFileSync(
    fileURLToPath(new URL('../../../../prisma/seed.ts', import.meta.url)),
    'utf8',
  );
  const cases = seed.slice(0, seed.indexOf('async function main'));
  return [...cases.matchAll(/^ {4}slug: '([^']+)',$/gm)].flatMap(([, slug]) =>
    slug ? [slug] : [],
  );
}

/** Slugs the visual registry answers to, read from its switch. */
function coveredSlugs(): string[] {
  const source = readFileSync(
    fileURLToPath(new URL('./case-visuals.tsx', import.meta.url)),
    'utf8',
  );
  return [...source.matchAll(/^ {4}case '([^']+)':$/gm)].flatMap(([, slug]) =>
    slug ? [slug] : [],
  );
}

describe('case visuals', () => {
  it('cover every case in the static slice', () => {
    const covered = new Set(coveredSlugs());
    for (const locale of ['RU', 'EN'] as const) {
      for (const study of fallbackPortfolio[locale].caseStudies) {
        expect(covered, `${locale} ${study.slug}`).toContain(study.slug);
      }
    }
  });

  it('cover every case the seed writes', () => {
    const covered = new Set(coveredSlugs());
    const slugs = seedSlugs();
    expect(slugs.length).toBeGreaterThan(0);
    for (const slug of slugs) expect(covered, slug).toContain(slug);
  });

  it('are the same set of cases in the seed and the static slice', () => {
    expect([...seedSlugs()].sort()).toEqual(
      fallbackPortfolio.RU.caseStudies.map(({ slug }) => slug).sort(),
    );
  });
});
