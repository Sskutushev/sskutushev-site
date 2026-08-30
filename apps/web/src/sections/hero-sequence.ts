/**
 * The hero scroll sequence as pure functions of pinned progress, 0 → 1.
 * See docs/design/HERO_STORYBOARD.md.
 *
 * Expressed as functions rather than interpolation ranges so each beat is
 * directly testable and cannot silently extrapolate past its last stop.
 */

function ramp(value: number, from: number, to: number): number {
  if (value <= from) return 0;
  if (value >= to) return 1;
  return (value - from) / (to - from);
}

/** Display type holds while the sentence is read, then clears by 0.45. */
export function typeOpacity(progress: number): number {
  return 1 - ramp(progress, 0.25, 0.45);
}

export function typeScale(progress: number): number {
  return 1 - ramp(progress, 0.25, 0.45) * 0.08;
}

/** Lead, status and actions leave first: they are not the subject. */
export function asideOpacity(progress: number): number {
  return 1 - ramp(progress, 0.05, 0.18);
}

/** Layer names appear as the object separates into API / DATA / INFRA. */
export function layerOpacity(progress: number): number {
  return ramp(progress, 0.55, 0.68);
}
