import { useEffect, type RefObject } from 'react';

/**
 * Reports progress through a pinned section: 0 while its top is at the top of
 * the viewport, 1 once its bottom is.
 *
 * The value is delivered to a callback rather than to React state. A pinned
 * hero produces a value on every frame of a 240vh scroll, and re-rendering the
 * tree that often would cost far more than the sequence is worth; the caller
 * writes the result straight to the DOM or to the render loop.
 *
 * Scroll events are collapsed onto an animation frame, so the work happens
 * once per painted frame no matter how densely the browser reports scrolling.
 */
export function usePinnedProgress(
  target: RefObject<HTMLElement | null>,
  onProgress: (progress: number) => void,
): void {
  useEffect(() => {
    const node = target.current;
    if (!node) return;

    let frame = 0;
    const measure = (): void => {
      frame = 0;
      const { top, height } = node.getBoundingClientRect();
      const travel = height - window.innerHeight;
      const progress = travel <= 0 ? 1 : Math.min(1, Math.max(0, -top / travel));
      onProgress(progress);
    };
    const request = (): void => {
      if (!frame) frame = window.requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener('scroll', request, { passive: true });
    window.addEventListener('resize', request);
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', request);
      window.removeEventListener('resize', request);
    };
  }, [target, onProgress]);
}
