import { useEffect } from 'react';
import { afterPaint } from './after-paint';

/**
 * Smooth scrolling is an enhancement, so its library is fetched once the page
 * is idle rather than bundled into the entry chunk. Native scrolling is fully
 * functional in the meantime and the swap is invisible: Lenis takes over the
 * wheel at whatever position the document is already at.
 */
export function useSmoothScroll(disabled: boolean): void {
  useEffect(() => {
    if (disabled) return;

    let frame = 0;
    let destroy: (() => void) | undefined;
    let cancelled = false;

    const cancelSchedule = afterPaint(() => {
      void import('lenis').then(({ default: Lenis }) => {
        if (cancelled) return;
        const lenis = new Lenis({ duration: 1.05, smoothWheel: true, wheelMultiplier: 0.9 });
        const render = (time: number): void => {
          lenis.raf(time);
          frame = window.requestAnimationFrame(render);
        };
        frame = window.requestAnimationFrame(render);
        destroy = () => lenis.destroy();
      });
    });

    return () => {
      cancelled = true;
      cancelSchedule();
      window.cancelAnimationFrame(frame);
      destroy?.();
    };
  }, [disabled]);
}
