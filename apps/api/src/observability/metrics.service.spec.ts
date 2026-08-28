import { describe, expect, it } from 'vitest';
import { MetricsService } from './metrics.service';

describe('MetricsService', () => {
  it('exports bounded route labels and measured counters', () => {
    const metrics = new MetricsService();
    metrics.observe('POST', '/graphql', 200, 0.125);
    metrics.observe('GET', '/users/private-id', 503, 0.25);
    const output = metrics.render();
    expect(output).toContain('portfolio_http_requests_total{method="POST",route="/graphql"} 1');
    expect(output).toContain('portfolio_http_errors_total{method="GET",route="/other"} 1');
    expect(output).not.toContain('private-id');
  });
});
