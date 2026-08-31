import { describe, expect, it } from 'vitest';
import { asideOpacity, layerOpacity, typeOpacity, typeScale } from './hero-sequence';

describe('hero sequence', () => {
  it('holds the display type while the sentence is read', () => {
    expect(typeOpacity(0)).toBe(1);
    expect(typeOpacity(0.25)).toBe(1);
    expect(typeOpacity(0.35)).toBeCloseTo(0.5);
  });

  it('clears the display type and never extrapolates past the last stop', () => {
    expect(typeOpacity(0.45)).toBe(0);
    expect(typeOpacity(0.8)).toBe(0);
    expect(typeOpacity(1)).toBe(0);
  });

  it('scales the display type within a bounded range', () => {
    expect(typeScale(0)).toBe(1);
    expect(typeScale(1)).toBeCloseTo(0.92);
  });

  it('removes supporting content before the display type', () => {
    expect(asideOpacity(0.18)).toBe(0);
    expect(typeOpacity(0.18)).toBe(1);
  });

  it('reveals the layer names only once the object separates', () => {
    expect(layerOpacity(0.54)).toBe(0);
    expect(layerOpacity(0.68)).toBe(1);
    expect(layerOpacity(1)).toBe(1);
  });
});
