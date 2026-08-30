import type { Theme } from '../theme/theme';

/**
 * Per-theme appearance of the System Core. A theme switch re-lights and
 * re-surfaces the object rather than inverting colours, so every value here is
 * interpolated over the transition instead of being swapped.
 *
 * See docs/design/3D_CONCEPT.md.
 */
export interface CoreAppearance {
  /** INFRASTRUCTURE cage */
  cageColor: string;
  cageRoughness: number;
  /** DATA glass shell */
  glassColor: string;
  glassRoughness: number;
  glassTransmission: number;
  /** Spectral separation at the bevels */
  dispersion: number;
  /** API core */
  emissiveColor: string;
  emissiveIntensity: number;
  haloOpacity: number;
  /** Environment */
  keyIntensity: number;
  violetIntensity: number;
  cyanIntensity: number;
  /** Broad environment fill. Metals have nothing to reflect without it. */
  fillIntensity: number;
  ambientIntensity: number;
}

const DARK: CoreAppearance = {
  cageColor: '#767c8c',
  cageRoughness: 0.34,
  glassColor: '#9fb2d4',
  glassRoughness: 0.06,
  glassTransmission: 0.88,
  dispersion: 0.2,
  emissiveColor: '#7868ff',
  emissiveIntensity: 2.6,
  haloOpacity: 0.32,
  keyIntensity: 0.5,
  violetIntensity: 2.4,
  cyanIntensity: 1.8,
  fillIntensity: 0.16,
  ambientIntensity: 0.35,
};

const LIGHT: CoreAppearance = {
  cageColor: '#a9adb8',
  cageRoughness: 0.28,
  glassColor: '#c4d2e8',
  glassRoughness: 0.03,
  glassTransmission: 0.93,
  dispersion: 0.4,
  emissiveColor: '#6258ff',
  emissiveIntensity: 1.1,
  haloOpacity: 0.12,
  keyIntensity: 3.2,
  violetIntensity: 0.9,
  cyanIntensity: 0.7,
  fillIntensity: 1.5,
  ambientIntensity: 1.1,
};

export function coreAppearance(theme: Theme): CoreAppearance {
  return theme === 'dark' ? DARK : LIGHT;
}

/**
 * Frame-rate independent approach used for every animated core value. Returns
 * the fraction of the remaining distance to close this frame.
 */
export function dampFactor(smoothing: number, delta: number): number {
  return 1 - Math.exp(-smoothing * delta);
}

/**
 * Separation of the three layers across the reveal beat. Bounded so that all
 * three stay inside the frustum at the pull-back distance below — layers that
 * leave the frame defeat the point of separating them.
 */
export function layerSeparation(progress: number, start = 0.55, end = 0.82): number {
  if (progress <= start) return 0;
  if (progress >= end) return 1;
  const t = (progress - start) / (end - start);
  return t * t * (3 - 2 * t);
}

/**
 * Camera distance across the sequence: hold, approach, then pull back so the
 * separated layers are all visible at once.
 */
export function cameraDistance(progress: number): number {
  if (progress <= 0.25) return 6;
  if (progress <= 0.55) return 6 - ((progress - 0.25) / 0.3) * 1.6;
  if (progress <= 0.82) return 4.4 + ((progress - 0.55) / 0.27) * 3.4;
  return 7.8;
}

/**
 * Final beat, 0 → 1: the object grows past the camera so the viewer passes
 * between the separated layers instead of the camera clipping into geometry.
 */
export function heroTravel(progress: number, enabled: boolean): number {
  if (!enabled || progress <= 0.82) return 0;
  return (progress - 0.82) / 0.18;
}
