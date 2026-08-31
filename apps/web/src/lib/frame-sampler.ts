/**
 * Turns a stream of per-frame deltas into a frame time worth reporting.
 *
 * Two things went wrong with reporting the raw delta. A canvas that has been
 * paused — a backgrounded tab, a scene scrolled off screen — resumes with a
 * delta covering the entire pause, and the drawer printed one of those as
 * `15202500.0 ms` at 0 FPS: four hours of not rendering, presented as a frame.
 * And a single delta is noise; the panel claims to say what the renderer is
 * doing, which is the average over a window, not the last frame in it.
 *
 * So: gaps are discarded rather than averaged, because they measure absence,
 * and a window with nothing left in it reports nothing rather than a zero.
 */

/** No real frame takes this long. Past it, the number is measuring a pause. */
export const MAX_PLAUSIBLE_FRAME_MS = 250;

/** How much rendering to average before reporting, in seconds. */
export const SAMPLE_WINDOW_S = 0.5;

export interface FrameSampler {
  /** Records one frame. Returns the mean frame time when a window closes. */
  push(deltaSeconds: number): number | null;
}

export function createFrameSampler(
  windowSeconds: number = SAMPLE_WINDOW_S,
  maxFrameMs: number = MAX_PLAUSIBLE_FRAME_MS,
): FrameSampler {
  let elapsed = 0;
  let frames = 0;
  let total = 0;

  return {
    push(deltaSeconds: number): number | null {
      const frameMs = deltaSeconds * 1000;
      elapsed += deltaSeconds;
      if (frameMs > 0 && frameMs <= maxFrameMs) {
        frames += 1;
        total += frameMs;
      }
      if (elapsed < windowSeconds) return null;

      elapsed = 0;
      // A window made only of gaps has no frame time to report. Zero would
      // read as "instant"; silence leaves the last real measurement standing.
      if (frames === 0) return null;

      const mean = total / frames;
      frames = 0;
      total = 0;
      return mean;
    },
  };
}
