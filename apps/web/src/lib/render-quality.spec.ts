import { describe, expect, it } from 'vitest';
import { lowerRenderQuality, pointBudget, selectRenderQuality } from './render-quality';

const capable = {
  width: 1680,
  reducedMotion: false,
  deviceMemory: 16,
  hardwareConcurrency: 12,
  devicePixelRatio: 1.5,
  maxTextureSize: 16_384,
};

describe('render quality', () => {
  it('selects all profiles from browser constraints', () => {
    expect(selectRenderQuality(capable)).toBe('ULTRA');
    expect(selectRenderQuality({ ...capable, width: 1300 })).toBe('HIGH');
    expect(selectRenderQuality({ ...capable, deviceMemory: 4 })).toBe('BALANCED');
    expect(selectRenderQuality({ ...capable, hardwareConcurrency: 2 })).toBe('LOW');
    expect(selectRenderQuality({ ...capable, reducedMotion: true })).toBe('STATIC');
    expect(selectRenderQuality({ ...capable, maxTextureSize: 0 })).toBe('STATIC');
  });

  it('degrades one level on slow-frame evidence', () => {
    expect(lowerRenderQuality('ULTRA', 30)).toBe('HIGH');
    expect(lowerRenderQuality('BALANCED', 23)).toBe('LOW');
    expect(lowerRenderQuality('LOW', 16)).toBe('LOW');
    expect(lowerRenderQuality('STATIC', 30)).toBe('STATIC');
  });

  it('keeps declared point budgets', () => {
    expect(pointBudget('ULTRA')).toBe(230_000);
    expect(pointBudget('BALANCED')).toBe(90_000);
    expect(pointBudget('LOW')).toBe(15_000);
    expect(pointBudget('STATIC')).toBe(0);
  });
});
