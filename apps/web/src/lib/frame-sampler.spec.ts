import { describe, expect, it } from 'vitest';
import { createFrameSampler } from './frame-sampler';

/** 60fps in seconds, the delta a healthy frame produces. */
const SMOOTH = 1 / 60;

describe('createFrameSampler', () => {
  it('reports nothing until a window closes', () => {
    const sampler = createFrameSampler(0.5);
    for (let i = 0; i < 20; i += 1) expect(sampler.push(SMOOTH)).toBeNull();
  });

  it('reports the mean of the window rather than its last frame', () => {
    const sampler = createFrameSampler(0.1);
    sampler.push(0.01);
    sampler.push(0.03);
    // 10ms and 30ms, then a frame that closes the window at 20ms: the mean is
    // 20, and reporting the last delta alone would have said 20 by luck. Make
    // the closing frame different so only the mean can produce the answer.
    expect(sampler.push(0.06)).toBeCloseTo((10 + 30 + 60) / 3, 5);
  });

  it('discards the resume delta after a pause instead of averaging it in', () => {
    const sampler = createFrameSampler(0.5);
    // Four hours of a paused canvas, which is what produced a reported frame
    // time of 15202500ms at 0 FPS.
    expect(sampler.push(15202.5)).toBeNull();
    // Run until the next window closes rather than counting frames to it:
    // thirty deltas of 1/60 sum to just under 0.5 in binary floating point.
    let reported: number | null = null;
    for (let i = 0; i < 40 && reported === null; i += 1) reported = sampler.push(SMOOTH);
    expect(reported).toBeCloseTo(1000 / 60, 3);
  });

  it('reports nothing when a window contains only gaps', () => {
    const sampler = createFrameSampler(0.5);
    expect(sampler.push(600)).toBeNull();
    expect(sampler.push(600)).toBeNull();
  });

  it('keeps a genuinely slow frame, which is the signal quality control needs', () => {
    // 40ms is a dropped frame, not a pause: the quality ladder steps down on
    // exactly this, so the cutoff must not swallow it.
    const sampler = createFrameSampler(0.04);
    expect(sampler.push(0.04)).toBeCloseTo(40, 5);
  });
});
