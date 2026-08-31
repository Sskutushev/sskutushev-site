import * as THREE from 'three';
import type { RenderQuality } from '../lib/render-quality';
import { SIGNAL_ICONS } from './signal-icons';

/**
 * What travels out of the core: the stack this profile works in, as marks.
 *
 * Anonymous dots said nothing — the object could have belonged to any site.
 * Names set in type were tried first and read as a smear at this size: eight
 * words orbiting a small object overlap each other far more often than they are
 * legible. A mark inside a disc holds its shape at any size and at any angle.
 */
export function signalCount(quality: RenderQuality): number {
  if (quality === 'ULTRA' || quality === 'HIGH') return SIGNAL_ICONS.length;
  if (quality === 'BALANCED') return 5;
  return 3;
}

/** Device pixels per world unit for the badge texture. */
const RESOLUTION = 330;
const SIZE = 96;

export interface MarkPalette {
  /** Disc behind the mark. */
  disc: string;
  /** The mark itself. */
  ink: string;
  /** Hairline around the disc. */
  edge: string;
}

/**
 * One badge, drawn once into a canvas.
 *
 * `Path2D` takes the outline directly, so the brand marks are the real ones
 * rather than approximations, and nothing is fetched at runtime.
 */
export function markTexture(path: string, palette: MarkPalette): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = SIZE;
  canvas.height = SIZE;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Signal marks need a 2D context');

  const centre = SIZE / 2;
  context.beginPath();
  context.arc(centre, centre, centre - 2, 0, Math.PI * 2);
  context.fillStyle = palette.disc;
  context.fill();
  context.lineWidth = 2;
  context.strokeStyle = palette.edge;
  context.stroke();

  // The outlines are authored in a 24 × 24 box; this centres one inside the disc.
  const inset = SIZE * 0.28;
  const scale = (SIZE - inset * 2) / 24;
  context.save();
  context.translate(inset, inset);
  context.scale(scale, scale);
  context.fillStyle = palette.ink;
  context.fill(new Path2D(path));
  context.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

/** World size of a badge. */
export const MARK_SCALE: [number, number, number] = [SIZE / RESOLUTION, SIZE / RESOLUTION, 1];

/**
 * How visible a mark is at a given point on the orbit, from the sine of its
 * angle: 1 at the front, dimmer at the back. Marks are never hidden entirely —
 * the set is the point, and one that vanishes reads as a bug rather than as
 * depth.
 */
export function markDepthOpacity(front: number): number {
  return 0.42 + ((front + 1) / 2) * 0.58;
}
