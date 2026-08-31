import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { lazy, Suspense, useCallback, useRef } from 'react';
import type { RenderQuality } from '../lib/render-quality';
import type { Theme } from '../theme/theme';
import { CoreStill } from '../three/CoreStill';
import { useCoreDriver } from '../three/use-core-driver';
import { useDeferredMount } from '../three/use-deferred-mount';
import { StatusDot } from '../ui/StatusDot';
import type { SiteCopy } from '../content/site-copy';
import { asideOpacity, layerOpacity, typeOpacity, typeScale } from './hero-sequence';
import { usePinnedProgress } from './use-pinned-progress';

const CoreStage = lazy(() => import('../three/CoreStage'));

const GITHUB_PROFILE = 'https://github.com/Sskutushev';

export function Hero({
  copy,
  theme,
  quality,
  active,
  reduced,
}: {
  copy: SiteCopy;
  theme: Theme;
  quality: RenderQuality;
  /** False while the hero is off-screen: the render loop stops entirely. */
  active: boolean;
  reduced: boolean;
}): React.JSX.Element {
  const pinned = useRef<HTMLDivElement>(null);
  const rendersCore = quality !== 'STATIC';
  // The static composition carries the hero until the object is ready, so the
  // canvas never competes with the headline for the main thread during load.
  const coreMounted = useDeferredMount(rendersCore);
  const { driver, setProgress } = useCoreDriver(rendersCore);

  // The sequence is published as custom properties on the pin and consumed by
  // the stylesheet. Nothing re-renders as the hero scrolls, and every element
  // is already at its opening value before any of this runs — which is why the
  // headline paints with the first frame rather than with the first frame of
  // an animation library.
  //
  // Under reduced motion the pin collapses to a single screen, which leaves
  // the scroll range zero-length and its progress pinned at 1. The sequence is
  // bypassed entirely so the hero renders as its designed static composition
  // with every element present.
  const onProgress = useCallback(
    (progress: number) => {
      const frame = pinned.current;
      if (!frame) return;
      setProgress(progress);
      if (reduced) return;
      frame.style.setProperty('--hero-type-opacity', String(typeOpacity(progress)));
      frame.style.setProperty('--hero-type-scale', String(typeScale(progress)));
      frame.style.setProperty('--hero-aside-opacity', String(asideOpacity(progress)));
      frame.style.setProperty('--hero-layer-opacity', String(layerOpacity(progress)));
    },
    [reduced, setProgress],
  );
  usePinnedProgress(pinned, onProgress);

  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero__pin" ref={pinned}>
        <div className="hero__frame">
          <div aria-hidden className="hero__stage">
            {coreMounted ? (
              <Suspense fallback={null}>
                <CoreStage active={active} driver={driver} quality={quality} theme={theme} />
              </Suspense>
            ) : (
              <CoreStill />
            )}
          </div>

          <p className="hero__eyebrow t-meta">
            {copy.hero.eyebrow}
            <span className="text-tertiary">2026</span>
          </p>

          {/* The scroll transform is applied per line rather than to the
              heading, so the heading creates no stacking context and the
              canvas can sit between two of its lines. */}
          <h1 className="hero__title t-display" id="hero-title">
            {copy.hero.lines.map((line, index) => (
              <span
                className={`hero__line${index === copy.hero.behind ? ' hero__line--behind' : ''}`}
                key={line}
              >
                <span className="hero__line-inner" style={{ animationDelay: `${index * 90}ms` }}>
                  {line}
                </span>
              </span>
            ))}
          </h1>

          <div className="hero__aside">
            <p className="hero__lead t-lead">{copy.hero.lead}</p>
            <p className="hero__availability t-meta">
              <StatusDot state="ok" />
              {copy.hero.availability}
            </p>
          </div>

          <div className="hero__actions">
            <a className="button button--primary" href="#work">
              {copy.hero.explore}
              <ArrowDownRight aria-hidden size={18} strokeWidth={1.5} />
            </a>
            <a
              className="button button--quiet"
              href={GITHUB_PROFILE}
              rel="noreferrer"
              target="_blank"
            >
              {copy.hero.source}
              <ArrowUpRight aria-hidden size={18} strokeWidth={1.5} />
            </a>
          </div>

          {/* Present in the DOM regardless of motion: the layer meaning is
              content, not an animation payload. */}
          <ul className="hero__layers">
            {copy.layers.map((layer) => (
              <li key={layer.id}>
                <b className="t-meta">{layer.label}</b>
                <span className="t-small text-secondary">{layer.description}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
