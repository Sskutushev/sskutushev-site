import { motion, useMotionValueEvent, useScroll, useTransform } from 'motion/react';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { lazy, Suspense, useRef } from 'react';
import type { RenderQuality } from '../lib/render-quality';
import type { Theme } from '../theme/theme';
import { useCoreDriver } from '../three/use-core-driver';
import { StatusDot } from '../ui/StatusDot';
import type { SiteCopy } from '../content/site-copy';
import { asideOpacity, layerOpacity, typeOpacity, typeScale } from './hero-sequence';

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
  const { driver, setProgress } = useCoreDriver(rendersCore);

  const { scrollYProgress } = useScroll({
    target: pinned,
    offset: ['start start', 'end end'],
  });
  useMotionValueEvent(scrollYProgress, 'change', setProgress);

  // Under reduced motion the pin collapses to a single screen, which leaves the
  // scroll range zero-length and its progress pinned at 1. The sequence is
  // bypassed entirely so the hero renders as its designed static composition
  // with every element present.
  const displayOpacity = useTransform(scrollYProgress, (p) => (reduced ? 1 : typeOpacity(p)));
  const displayScale = useTransform(scrollYProgress, (p) => (reduced ? 1 : typeScale(p)));
  const supportingOpacity = useTransform(scrollYProgress, (p) => (reduced ? 1 : asideOpacity(p)));
  const layersOpacity = useTransform(scrollYProgress, (p) => (reduced ? 1 : layerOpacity(p)));

  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero__pin" ref={pinned}>
        <div className="hero__frame">
          {rendersCore && (
            <div className="hero__stage">
              <Suspense fallback={<div className="hero__stage-fallback" aria-hidden />}>
                <CoreStage theme={theme} quality={quality} driver={driver} active={active} />
              </Suspense>
            </div>
          )}
          {!rendersCore && <div className="hero__stage hero__stage--static" aria-hidden />}

          <motion.p className="hero__eyebrow t-meta" style={{ opacity: supportingOpacity }}>
            {copy.hero.eyebrow}
            <span className="text-tertiary">2026</span>
          </motion.p>

          {/* The scroll transform is applied per line rather than to the
              heading, so the heading creates no stacking context and the
              canvas can sit between two of its lines. */}
          <h1 className="hero__title t-display" id="hero-title">
            {copy.hero.lines.map((line, index) => (
              <motion.span
                className={`hero__line${index === copy.hero.behind ? ' hero__line--behind' : ''}`}
                key={line}
                style={{ opacity: displayOpacity, scale: displayScale }}
              >
                <motion.span
                  className="hero__line-inner"
                  initial={reduced ? false : { y: '24%', opacity: 0 }}
                  animate={{ y: '0%', opacity: 1 }}
                  transition={{
                    duration: reduced ? 0 : 0.9,
                    delay: reduced ? 0 : 0.15 + index * 0.09,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  {line}
                </motion.span>
              </motion.span>
            ))}
          </h1>

          <motion.div className="hero__aside" style={{ opacity: supportingOpacity }}>
            <p className="hero__lead t-lead">{copy.hero.lead}</p>
            <p className="hero__availability t-meta">
              <StatusDot state="ok" />
              {copy.hero.availability}
            </p>
          </motion.div>

          <motion.div className="hero__actions" style={{ opacity: supportingOpacity }}>
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
          </motion.div>

          {/* Present in the DOM regardless of motion: the layer meaning is
              content, not an animation payload. */}
          <motion.ul className="hero__layers" style={{ opacity: layersOpacity }}>
            {copy.layers.map((layer) => (
              <li key={layer.id}>
                <b className="t-meta">{layer.label}</b>
                <span className="t-small text-secondary">{layer.description}</span>
              </li>
            ))}
          </motion.ul>
        </div>
      </div>
    </section>
  );
}
