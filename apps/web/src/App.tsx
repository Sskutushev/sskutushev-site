import { useQuery } from '@tanstack/react-query';
import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { siteCopy } from './content/site-copy';
import { afterPaint } from './lib/after-paint';
import { fallbackPortfolio } from './lib/fallback-portfolio';
import { fetchPortfolio, type Locale } from './lib/portfolio';
import { useEngineeringMetrics } from './lib/use-engineering-metrics';
import { useRenderQuality } from './lib/use-render-quality';
import { useSmoothScroll } from './lib/use-smooth-scroll';
import { Hero } from './sections/Hero';
import { useTheme } from './theme/use-theme';
import { SiteNav } from './ui/SiteNav';
import type { DataState } from './ui/StatusDot';

const SiteBody = lazy(() =>
  import('./sections/SiteBody').then(({ SiteBody: component }) => ({ default: component })),
);
const EngineeringDrawer = lazy(() =>
  import('./ui/EngineeringDrawer').then(({ EngineeringDrawer: component }) => ({
    default: component,
  })),
);

/** Stops the render loop as soon as the hero leaves the viewport. */
function useHeroVisible(): { ref: React.RefObject<HTMLDivElement | null>; visible: boolean } {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) =>
      setVisible(entry?.isIntersecting ?? false),
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return { ref, visible };
}

export default function App(): React.JSX.Element {
  const [locale, setLocale] = useState<Locale>('RU');
  const [engineering, setEngineering] = useState(false);
  // The realtime socket opens only while the evidence section is on screen, or
  // while the drawer is open. Neither is owed a connection on first paint.
  const [evidenceVisible, setEvidenceVisible] = useState(false);
  const { theme, toggle } = useTheme();
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const quality = useRenderQuality(reduced);
  const runtime = useEngineeringMetrics(engineering || evidenceVisible);
  const hero = useHeroVisible();
  const copy = siteCopy[locale];

  // Document smooth scrolling is suspended while the drawer is open, so its own
  // scroll container receives wheel events. See ADR-017.
  useSmoothScroll(reduced || engineering);

  // Nothing below the hero, and no network call, is owed to the first paint:
  // the first screen is a 240vh pin and the page renders from the bundled
  // fallback. Both wait until it is up.
  const [live, setLive] = useState(false);
  useEffect(() => afterPaint(() => setLive(true)), []);

  const { data = fallbackPortfolio[locale], isError } = useQuery({
    queryKey: ['portfolio', locale],
    queryFn: () => fetchPortfolio(locale),
    enabled: live,
    retry: 1,
  });

  useEffect(() => {
    document.documentElement.lang = locale === 'RU' ? 'ru' : 'en';
  }, [locale]);

  const dataState: DataState = isError ? 'failed' : data.stale ? 'degraded' : 'ok';
  const dataDetail = isError ? copy.data.failed : data.stale ? copy.data.stale : copy.data.live;

  return (
    <>
      <a className="skip-link" href="#work">
        {copy.skip}
      </a>
      <SiteNav
        copy={copy}
        locale={locale}
        theme={theme}
        onEngineering={() => setEngineering(true)}
        onLocale={setLocale}
        onTheme={toggle}
      />
      <main id="top">
        <div ref={hero.ref}>
          <Hero
            active={hero.visible && !engineering}
            copy={copy}
            quality={quality}
            reduced={reduced}
            theme={theme}
          />
        </div>
        {live && (
          <Suspense fallback={null}>
            <SiteBody
              copy={copy}
              data={data}
              dataDetail={dataDetail}
              dataState={dataState}
              locale={locale}
              onEvidenceVisible={setEvidenceVisible}
              runtime={runtime}
            />
          </Suspense>
        )}
      </main>
      {engineering && (
        <Suspense fallback={null}>
          <EngineeringDrawer
            copy={copy}
            dataState={dataDetail}
            locale={locale}
            onClose={() => setEngineering(false)}
            quality={quality}
            runtime={runtime}
          />
        </Suspense>
      )}
    </>
  );
}
