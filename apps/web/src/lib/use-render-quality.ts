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

const SOFTWARE_RENDERERS = /swiftshader|llvmpipe|software|microsoft basic render/i;

/**
 * Reads the renderer string. Chrome exposes the real adapter through
 * `RENDERER` directly; the debug extension is checked as well because older
 * browsers still mask that value.
 */
function isSoftwareRenderer(gl: WebGLRenderingContext | WebGL2RenderingContext): boolean {
  const names: unknown[] = [gl.getParameter(gl.RENDERER)];
  const info = gl.getExtension('WEBGL_debug_renderer_info');
  if (info) names.push(gl.getParameter(info.UNMASKED_RENDERER_WEBGL));
  return names.some((name) => typeof name === 'string' && SOFTWARE_RENDERERS.test(name));
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
    softwareRenderer: gl ? isSoftwareRenderer(gl) : true,
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
