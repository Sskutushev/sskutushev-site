export type RenderQuality = 'STATIC' | 'LOW' | 'HIGH';

export function selectRenderQuality(width: number, reducedMotion: boolean): RenderQuality {
  if (reducedMotion) return 'STATIC';
  if (width < 760) return 'LOW';
  return 'HIGH';
}

export function pointBudget(quality: RenderQuality): number {
  if (quality === 'HIGH') return 230_000;
  if (quality === 'LOW') return 15_000;
  return 0;
}
