import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import { CaseSimulation } from './components/CaseSimulation';
import { siteCopy } from './content/site-copy';
import { fallbackPortfolio } from './lib/fallback-portfolio';
import { fetchPortfolio, type Locale } from './lib/portfolio';
import { useEngineeringMetrics } from './lib/use-engineering-metrics';
import { useRenderQuality } from './lib/use-render-quality';
import { useSmoothScroll } from './lib/use-smooth-scroll';
import { Architecture } from './sections/Architecture';
import { Capabilities } from './sections/Capabilities';
import { Contact } from './sections/Contact';
import { Experience } from './sections/Experience';
import { Hero } from './sections/Hero';
import { Manifesto } from './sections/Manifesto';
import { Work } from './sections/Work';
import { useTheme } from './theme/use-theme';
import { EngineeringDrawer } from './ui/EngineeringDrawer';
import { SiteNav } from './ui/SiteNav';
import type { DataState } from './ui/StatusDot';

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
  const { theme, toggle } = useTheme();
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const quality = useRenderQuality(reduced);
  const runtime = useEngineeringMetrics(engineering);
  const hero = useHeroVisible();
  const copy = siteCopy[locale];

  // Document smooth scrolling is suspended while the drawer is open, so its own
  // scroll container receives wheel events. See ADR-017.
  useSmoothScroll(reduced || engineering);

  const { data = fallbackPortfolio[locale], isError } = useQuery({
    queryKey: ['portfolio', locale],
    queryFn: () => fetchPortfolio(locale),
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
        <Manifesto copy={copy} />
        <Work cases={data.caseStudies} copy={copy} />
        <Architecture copy={copy} detail={dataDetail} state={dataState}>
          <CaseSimulation locale={locale} />
        </Architecture>
        <Capabilities copy={copy} locale={locale} skills={data.skills} />
        <Experience copy={copy} items={data.experience} />
      </main>
      <Contact copy={copy} locale={locale} />
      {engineering && (
        <EngineeringDrawer
          copy={copy}
          dataState={dataDetail}
          locale={locale}
          onClose={() => setEngineering(false)}
          quality={quality}
          runtime={runtime}
        />
      )}
    </>
  );
}
