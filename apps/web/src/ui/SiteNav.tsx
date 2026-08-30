import { Moon, Sun, Terminal } from 'lucide-react';
import type { SiteCopy } from '../content/site-copy';
import type { Locale } from '../lib/portfolio';
import type { Theme } from '../theme/theme';

export function SiteNav({
  copy,
  locale,
  theme,
  onLocale,
  onTheme,
  onEngineering,
}: {
  copy: SiteCopy;
  locale: Locale;
  theme: Theme;
  onLocale: (next: Locale) => void;
  onTheme: () => void;
  onEngineering: () => void;
}): React.JSX.Element {
  return (
    <header className="nav">
      <a className="nav__mark" href="#top">
        SK<span aria-hidden>/</span>26
      </a>
      <nav aria-label={copy.nav.system}>
        <a href="#work">{copy.nav.work}</a>
        <a href="#architecture">{copy.nav.system}</a>
        <a href="#about">{copy.nav.about}</a>
      </nav>
      <div className="nav__controls">
        <div className="segmented" role="group" aria-label="Language">
          {(['RU', 'EN'] as const).map((value) => (
            <button
              aria-pressed={locale === value}
              className={locale === value ? 'is-active' : ''}
              key={value}
              onClick={() => onLocale(value)}
              type="button"
            >
              {value}
            </button>
          ))}
        </div>
        <button
          aria-label={theme === 'dark' ? copy.theme.toLight : copy.theme.toDark}
          className="icon-button"
          onClick={onTheme}
          type="button"
        >
          {theme === 'dark' ? (
            <Sun aria-hidden size={18} strokeWidth={1.5} />
          ) : (
            <Moon aria-hidden size={18} strokeWidth={1.5} />
          )}
        </button>
        <button
          aria-label={copy.engineering.open}
          className="icon-button"
          onClick={onEngineering}
          type="button"
        >
          <Terminal aria-hidden size={18} strokeWidth={1.5} />
        </button>
      </div>
    </header>
  );
}
