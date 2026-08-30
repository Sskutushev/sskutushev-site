export interface ThemePair {
  light: string;
  dark: string;
}

function channel(value: number): number {
  const c = value / 255;
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

export function relativeLuminance(hex: string): number {
  const value = hex.replace('#', '');
  const r = Number.parseInt(value.slice(0, 2), 16);
  const g = Number.parseInt(value.slice(2, 4), 16);
  const b = Number.parseInt(value.slice(4, 6), 16);
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

export function contrastRatio(a: string, b: string): number {
  const first = relativeLuminance(a);
  const second = relativeLuminance(b);
  return (Math.max(first, second) + 0.05) / (Math.min(first, second) + 0.05);
}

/** Hue angle in degrees, used to assert that state colours stay distinct. */
function hue(hex: string): number {
  const value = hex.replace('#', '');
  const r = Number.parseInt(value.slice(0, 2), 16) / 255;
  const g = Number.parseInt(value.slice(2, 4), 16) / 255;
  const b = Number.parseInt(value.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  if (max === min) return 0;
  const span = max - min;
  const raw = max === r ? (g - b) / span : max === g ? 2 + (b - r) / span : 4 + (r - g) / span;
  return (raw * 60 + 360) % 360;
}

/** Smallest angle between two hues, in degrees. */
export function hueSeparation(a: string, b: string): number {
  const delta = Math.abs(hue(a) - hue(b)) % 360;
  return delta > 180 ? 360 - delta : delta;
}

/**
 * Reads the `light-dark(<light>, <dark>)` token declarations out of a
 * stylesheet so the contrast assertions run against the shipped values rather
 * than a copy of them.
 */
export function parseThemeTokens(css: string): Map<string, ThemePair> {
  const tokens = new Map<string, ThemePair>();
  const declaration = /(--[\w-]+):\s*light-dark\(\s*(#[0-9a-f]{6})\s*,\s*(#[0-9a-f]{6})\s*\)/gi;
  for (const match of css.matchAll(declaration)) {
    tokens.set(match[1]!, { light: match[2]!, dark: match[3]! });
  }
  return tokens;
}
