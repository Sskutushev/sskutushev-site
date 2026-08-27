import Lenis from 'lenis';
import { useEffect } from 'react';

export function useSmoothScroll(disabled: boolean): void {
  useEffect(() => {
    if (disabled) return;
    const lenis = new Lenis({
      duration: 1.05,
      smoothWheel: true,
      wheelMultiplier: 0.9,
    });
    let frame = 0;
    const render = (time: number): void => {
      lenis.raf(time);
      frame = window.requestAnimationFrame(render);
    };
    frame = window.requestAnimationFrame(render);
    return () => {
      window.cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, [disabled]);
}
