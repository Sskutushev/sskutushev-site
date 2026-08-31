import { Menu, Moon, Sun, Terminal, X } from 'lucide-react';
import { useEffect, useId, useState } from 'react';
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
  // Below 900px the three section links do not fit beside the controls. They
  // used to be hidden with no replacement, which left the sections reachable
  // only by scrolling the whole page.
  const [open, setOpen] = useState(false);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const links = [
    { href: '#work', label: copy.nav.work },
    { href: '#architecture', label: copy.nav.system },
    { href: '#about', label: copy.nav.about },
    { href: '#contact', label: copy.nav.contact },
  ];

  return (
    <header className="nav">
      <a className="nav__mark" href="#top">
        SK<span aria-hidden>/</span>26
      </a>
      <nav aria-label={copy.nav.menu} className="nav__links">
        {links.slice(0, 3).map((link) => (
          <a href={link.href} key={link.href}>
            {link.label}
          </a>
        ))}
      </nav>
      <div className="nav__controls">
        <button
          aria-controls={panelId}
          aria-expanded={open}
          aria-label={copy.nav.menu}
          className="icon-button nav__menu"
          onClick={() => setOpen((value) => !value)}
          type="button"
        >
          {open ? (
            <X aria-hidden size={18} strokeWidth={1.5} />
          ) : (
            <Menu aria-hidden size={18} strokeWidth={1.5} />
          )}
        </button>
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
      <nav aria-label={copy.nav.menu} className="nav__sheet" hidden={!open} id={panelId}>
        {links.map((link) => (
          <a href={link.href} key={link.href} onClick={() => setOpen(false)}>
            {link.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
