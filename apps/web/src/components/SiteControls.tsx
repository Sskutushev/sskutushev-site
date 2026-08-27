import type { Locale } from '../lib/portfolio';

const Sun = (): React.JSX.Element => (
  <svg viewBox="0 0 24 24" aria-hidden>
    <circle cx="12" cy="12" r="3.5" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </svg>
);
const Moon = (): React.JSX.Element => (
  <svg viewBox="0 0 24 24" aria-hidden>
    <path d="M20 15.2A8.5 8.5 0 0 1 8.8 4a8.5 8.5 0 1 0 11.2 11.2Z" />
  </svg>
);
const Terminal = (): React.JSX.Element => (
  <svg viewBox="0 0 24 24" aria-hidden>
    <path d="m5 7 4 5-4 5M11 17h8" />
  </svg>
);

export function SiteControls({
  locale,
  theme,
  onLocale,
  onTheme,
  onEngineering,
}: {
  locale: Locale;
  theme: 'thermal' | 'blueprint';
  onLocale: () => void;
  onTheme: () => void;
  onEngineering: () => void;
}): React.JSX.Element {
  return (
    <div className="site-controls">
      <button
        className="icon-control"
        aria-label="Открыть инженерный режим"
        onClick={onEngineering}
      >
        <Terminal />
      </button>
      <div className="segmented" aria-label="Язык">
        <button className={locale === 'RU' ? 'active' : ''} onClick={onLocale}>
          RU
        </button>
        <button className={locale === 'EN' ? 'active' : ''} onClick={onLocale}>
          EN
        </button>
      </div>
      <button
        className="icon-control"
        aria-label={theme === 'thermal' ? 'Включить светлую тему' : 'Включить тёмную тему'}
        onClick={onTheme}
      >
        {theme === 'thermal' ? <Sun /> : <Moon />}
      </button>
    </div>
  );
}
