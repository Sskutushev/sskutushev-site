import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { createFrameSampler } from '../lib/frame-sampler';

export interface RenderMetrics {
  drawCalls: number;
  frameMs: number;
}

/**
 * Publishes what the renderer is actually doing.
 *
 * The frame time is the mean over a window with pause gaps thrown out, not the
 * delta of whichever frame happened to close it — see `frame-sampler.ts` for
 * why. Draw calls are read at the moment of reporting, which is a real count
 * either way.
 */
export function RuntimeProfiler(): null {
  const sampler = useRef(createFrameSampler());
  useFrame(({ gl }, delta) => {
    const frameMs = sampler.current.push(delta);
    if (frameMs === null) return;
    window.dispatchEvent(
      new CustomEvent<RenderMetrics>('portfolio-render-metrics', {
        detail: { drawCalls: gl.info.render.calls, frameMs },
      }),
    );
  });
  return null;
}
