import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';

export interface RenderMetrics {
  drawCalls: number;
  frameMs: number;
}

export function RuntimeProfiler(): null {
  const elapsed = useRef(0);
  useFrame(({ gl }, delta) => {
    elapsed.current += delta;
    if (elapsed.current < 0.5) return;
    elapsed.current = 0;
    window.dispatchEvent(
      new CustomEvent<RenderMetrics>('portfolio-render-metrics', {
        detail: { drawCalls: gl.info.render.calls, frameMs: delta * 1000 },
      }),
    );
  });
  return null;
}
