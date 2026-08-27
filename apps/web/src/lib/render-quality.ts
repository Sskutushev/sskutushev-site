export type RenderQuality = 'STATIC' | 'LOW' | 'BALANCED' | 'HIGH';

export function selectRenderQuality(width: number, reducedMotion: boolean): RenderQuality {
  if (reducedMotion) return 'STATIC';
  if (width < 760) return 'LOW';
  if (width < 1200) return 'BALANCED';
  return 'HIGH';
}

export function pointBudget(quality: RenderQuality): number {
  if (quality === 'HIGH') return 230_000;
  if (quality === 'BALANCED') return 90_000;
  if (quality === 'LOW') return 15_000;
  return 0;
}
