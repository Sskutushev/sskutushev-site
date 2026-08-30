import { describe, expect, it } from 'vitest';
import { resolveInitialTheme, THEME_STORAGE_KEY } from './theme';

describe('theme resolution', () => {
  it('prefers an explicit stored choice over the system preference', () => {
    expect(resolveInitialTheme('light', true)).toBe('light');
    expect(resolveInitialTheme('dark', false)).toBe('dark');
  });

  it('follows the system preference when no choice is stored', () => {
    expect(resolveInitialTheme(null, true)).toBe('dark');
    expect(resolveInitialTheme(null, false)).toBe('light');
  });

  it('ignores an unrecognised stored value rather than trusting it', () => {
    expect(resolveInitialTheme('sepia', true)).toBe('dark');
    expect(resolveInitialTheme('', false)).toBe('light');
  });

  it('namespaces the storage key so it cannot collide on a shared origin', () => {
    expect(THEME_STORAGE_KEY).toBe('sk:theme');
  });
});
