import { useEffect, useRef } from 'react';
import type { CoreDriver } from './core-driver';

/**
 * Owns the two values the render loop reads: hero scroll progress and a damped
 * pointer offset. Both are refs, so updating them never re-renders React and
 * never contends with the render loop for the same transform (ADR-017).
 */
export function useCoreDriver(enabled: boolean): {
  driver: CoreDriver;
  setProgress: (value: number) => void;
} {
  const progress = useRef(0);
  const pointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!enabled) return;
    const onPointerMove = (event: PointerEvent): void => {
      pointer.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (event.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    return () => window.removeEventListener('pointermove', onPointerMove);
  }, [enabled]);

  return {
    driver: { progress, pointer },
    setProgress: (value: number) => {
      progress.current = value;
    },
  };
}
