import { describe, expect, it } from 'vitest';
import { pointBudget, selectRenderQuality } from './render-quality';

describe('render quality', () => {
  it('preserves the 230k desktop art contract', () => {
    expect(pointBudget(selectRenderQuality(1440, false))).toBe(230_000);
  });

  it('prioritizes reduced motion over device capability', () => {
    expect(selectRenderQuality(1920, true)).toBe('STATIC');
  });

  it('reduces geometry on narrow screens', () => {
    expect(pointBudget(selectRenderQuality(390, false))).toBe(15_000);
  });

  it('uses a balanced budget for tablets and compact laptops', () => {
    expect(pointBudget(selectRenderQuality(1024, false))).toBe(90_000);
  });
});
