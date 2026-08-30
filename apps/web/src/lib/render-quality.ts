export type RenderQuality = 'STATIC' | 'LOW' | 'BALANCED' | 'HIGH' | 'ULTRA';

export interface RenderCapabilities {
  width: number;
  reducedMotion: boolean;
  deviceMemory?: number;
  hardwareConcurrency?: number;
  devicePixelRatio: number;
  maxTextureSize?: number;
}

const order: RenderQuality[] = ['STATIC', 'LOW', 'BALANCED', 'HIGH', 'ULTRA'];

export function selectRenderQuality({
  width,
  reducedMotion,
  deviceMemory,
  hardwareConcurrency,
  devicePixelRatio,
  maxTextureSize,
}: RenderCapabilities): RenderQuality {
  if (reducedMotion || maxTextureSize === 0) return 'STATIC';
  if (
    width < 760 ||
    (deviceMemory !== undefined && deviceMemory <= 2) ||
    (hardwareConcurrency !== undefined && hardwareConcurrency <= 2) ||
    (maxTextureSize !== undefined && maxTextureSize < 4096)
  )
    return 'LOW';
  if (
    width < 1200 ||
    (deviceMemory !== undefined && deviceMemory < 8) ||
    (hardwareConcurrency !== undefined && hardwareConcurrency < 6) ||
    devicePixelRatio > 2
  )
    return 'BALANCED';
  if (
    width >= 1600 &&
    (deviceMemory === undefined || deviceMemory >= 8) &&
    (hardwareConcurrency === undefined || hardwareConcurrency >= 8) &&
    devicePixelRatio <= 2 &&
    (maxTextureSize === undefined || maxTextureSize >= 8192)
  )
    return 'ULTRA';
  return 'HIGH';
}

/**
 * Runtime degradation floors at LOW. STATIC means "this device cannot or must
 * not render the scene" — reduced motion, or no WebGL — and is decided by
 * capability detection. Dropping to it because a few frames ran long removes
 * the object entirely, which is a design failure rather than a saving.
 */
export function lowerRenderQuality(quality: RenderQuality, frameMs: number): RenderQuality {
  if (quality === 'STATIC' || quality === 'LOW' || frameMs <= 22) return quality;
  return order[Math.max(order.indexOf('LOW'), order.indexOf(quality) - 1)]!;
}

export function pointBudget(quality: RenderQuality): number {
  if (quality === 'ULTRA' || quality === 'HIGH') return 230_000;
  if (quality === 'BALANCED') return 90_000;
  if (quality === 'LOW') return 15_000;
  return 0;
}

export function renderDpr(quality: RenderQuality): [number, number] {
  if (quality === 'ULTRA') return [1, 2];
  if (quality === 'HIGH') return [1, 1.5];
  if (quality === 'BALANCED') return [1, 1.25];
  return [1, 1];
}
