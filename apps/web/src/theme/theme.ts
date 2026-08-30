export type Theme = 'light' | 'dark';

export const THEME_STORAGE_KEY = 'sk:theme';

/**
 * Resolves the theme that should be applied on first paint. An explicit stored
 * choice always wins; otherwise the operating system preference is followed.
 * Kept pure so the inline pre-paint script and React resolve identically.
 */
export function resolveInitialTheme(stored: string | null, prefersDark: boolean): Theme {
  if (stored === 'light' || stored === 'dark') return stored;
  return prefersDark ? 'dark' : 'light';
}

export function readStoredTheme(): string | null {
  try {
    return window.localStorage.getItem(THEME_STORAGE_KEY);
  } catch {
    // Private browsing and blocked site data both throw here. A missing
    // preference is a valid state, not an error worth surfacing.
    return null;
  }
}

export function persistTheme(theme: Theme): void {
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Persistence is a convenience; the session still honours the choice.
  }
}

export function applyTheme(theme: Theme): void {
  document.documentElement.dataset.theme = theme;
}
