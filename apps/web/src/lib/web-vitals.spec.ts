import { describe, expect, it } from 'vitest';
import { vitalPayload } from './web-vitals';

describe('web vitals telemetry', () => {
  it('emits only bounded metric fields and no visitor identifier', () => {
    const payload = vitalPayload({
      name: 'LCP',
      value: 1200,
      rating: 'good',
      navigationType: 'navigate',
      delta: 1200,
      id: 'visitor-derived-id-must-not-leave-browser',
      navigationId: 7,
      entries: [],
    });

    expect(payload).toEqual({
      name: 'LCP',
      value: 1200,
      rating: 'good',
      navigationType: 'navigate',
    });
    expect(payload).not.toHaveProperty('id');
  });
});
