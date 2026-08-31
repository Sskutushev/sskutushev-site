import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
  contrastRatio,
  hueSeparation,
  parseThemeTokens,
  relativeLuminance,
  type ThemePair,
} from './contrast';

const tokens = parseThemeTokens(readFileSync(new URL('./tokens.css', import.meta.url), 'utf8'));

function token(name: string): ThemePair {
  const value = tokens.get(name);
  if (!value) throw new Error(`${name} is not declared as a light-dark token`);
  return value;
}

const SURFACES = ['--bg', '--surface-1', '--surface-2', '--surface-3'];

/**
 * The palette is asserted against the shipped stylesheet rather than a copy,
 * so a token cannot be adjusted for looks and quietly drop below AA. axe covers
 * what is currently rendered; this covers every surface a token may land on.
 */
describe('colour tokens', () => {
  it.each(['--text', '--text-secondary', '--text-tertiary'])(
    '%s clears 4.5:1 on every surface in both themes',
    (name) => {
      const text = token(name);
      for (const surface of SURFACES) {
        const ground = token(surface);
        expect(contrastRatio(text.light, ground.light)).toBeGreaterThanOrEqual(4.5);
        expect(contrastRatio(text.dark, ground.dark)).toBeGreaterThanOrEqual(4.5);
      }
    },
  );

  it('keeps the quiet accent readable as text on the page ground', () => {
    const accent = token('--prism-blue');
    const ground = token('--bg');
    expect(contrastRatio(accent.light, ground.light)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(accent.dark, ground.dark)).toBeGreaterThanOrEqual(4.5);
  });

  it('keeps the focus ring and state colours distinguishable at 3:1', () => {
    const ground = token('--bg');
    for (const name of ['--prism-violet', '--prism-cyan', '--prism-warning', '--prism-critical']) {
      const value = token(name);
      expect(contrastRatio(value.light, ground.light)).toBeGreaterThanOrEqual(3);
      expect(contrastRatio(value.dark, ground.dark)).toBeGreaterThanOrEqual(3);
    }
  });

  // Hue alone never carries the state — every indicator is a dot plus a text
  // label — but the three must not be confusable at a glance either.
  it('separates the three system states by hue so stale never reads as live', () => {
    const ok = token('--prism-cyan');
    const degraded = token('--prism-warning');
    const failed = token('--prism-critical');
    for (const theme of ['light', 'dark'] as const) {
      expect(hueSeparation(ok[theme], degraded[theme])).toBeGreaterThan(45);
      expect(hueSeparation(degraded[theme], failed[theme])).toBeGreaterThan(45);
      expect(hueSeparation(ok[theme], failed[theme])).toBeGreaterThan(45);
    }
  });

  it('elevates surfaces toward the light source in both themes', () => {
    const bg = token('--bg');
    for (const name of ['--surface-1', '--surface-2', '--surface-3']) {
      const raised = token(name);
      expect(relativeLuminance(raised.dark)).toBeGreaterThan(relativeLuminance(bg.dark));
      expect(relativeLuminance(raised.light)).toBeGreaterThan(relativeLuminance(bg.light));
    }
  });
});
