import { useCallback, useEffect, useState } from 'react';
import {
  applyTheme,
  persistTheme,
  readStoredTheme,
  resolveInitialTheme,
  type Theme,
} from './theme';

export interface ThemeControl {
  theme: Theme;
  toggle: () => void;
}

export function useTheme(): ThemeControl {
  const [theme, setTheme] = useState<Theme>(() =>
    resolveInitialTheme(
      readStoredTheme(),
      window.matchMedia('(prefers-color-scheme: dark)').matches,
    ),
  );

  useEffect(() => applyTheme(theme), [theme]);

  // Follow the operating system until the visitor makes an explicit choice.
  useEffect(() => {
    const query = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = (event: MediaQueryListEvent): void => {
      if (readStoredTheme()) return;
      setTheme(event.matches ? 'dark' : 'light');
    };
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  const toggle = useCallback(() => {
    setTheme((current) => {
      const next: Theme = current === 'dark' ? 'light' : 'dark';
      persistTheme(next);
      return next;
    });
  }, []);

  return { theme, toggle };
}
