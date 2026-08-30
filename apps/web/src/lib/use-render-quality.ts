import { useEffect, useState } from 'react';
import type { RenderMetrics } from '../scenes/RuntimeProfiler';
import {
  lowerRenderQuality,
  selectRenderQuality,
  type RenderCapabilities,
  type RenderQuality,
} from './render-quality';

interface NavigatorCapabilities extends Navigator {
  deviceMemory?: number;
}

function detectCapabilities(reducedMotion: boolean): RenderCapabilities {
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl2') ?? canvas.getContext('webgl');
  const browser = navigator as NavigatorCapabilities;
  const capabilities: RenderCapabilities = {
    width: window.innerWidth,
    reducedMotion,
    hardwareConcurrency: browser.hardwareConcurrency,
    devicePixelRatio: window.devicePixelRatio,
    maxTextureSize: gl ? (gl.getParameter(gl.MAX_TEXTURE_SIZE) as number) : 0,
  };
  if (browser.deviceMemory !== undefined) capabilities.deviceMemory = browser.deviceMemory;
  return capabilities;
}

export function useRenderQuality(reducedMotion: boolean): RenderQuality {
  const [quality, setQuality] = useState(() =>
    selectRenderQuality(detectCapabilities(reducedMotion)),
  );

  useEffect(
    () => setQuality(selectRenderQuality(detectCapabilities(reducedMotion))),
    [reducedMotion],
  );
  useEffect(() => {
    let slowSamples = 0;
    const onMetrics = (event: Event): void => {
      const { frameMs } = (event as CustomEvent<RenderMetrics>).detail;
      slowSamples = frameMs > 22 ? slowSamples + 1 : 0;
      if (slowSamples < 4) return;
      slowSamples = 0;
      setQuality((current) => lowerRenderQuality(current, frameMs));
    };
    window.addEventListener('portfolio-render-metrics', onMetrics);
    return () => window.removeEventListener('portfolio-render-metrics', onMetrics);
  }, []);

  return quality;
}
