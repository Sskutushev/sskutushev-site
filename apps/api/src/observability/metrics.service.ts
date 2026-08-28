import { Injectable } from '@nestjs/common';

type Metric = { requests: number; errors: number; durationSeconds: number };

@Injectable()
export class MetricsService {
  private readonly metrics = new Map<string, Metric>();

  observe(method: string, route: string, status: number, durationSeconds: number): void {
    const key = `${method} ${this.normalize(route)}`;
    const current = this.metrics.get(key) ?? { requests: 0, errors: 0, durationSeconds: 0 };
    current.requests += 1;
    current.errors += status >= 500 ? 1 : 0;
    current.durationSeconds += durationSeconds;
    this.metrics.set(key, current);
  }

  render(): string {
    const lines = [
      '# HELP portfolio_http_requests_total Completed HTTP requests.',
      '# TYPE portfolio_http_requests_total counter',
      '# HELP portfolio_http_errors_total Completed HTTP 5xx responses.',
      '# TYPE portfolio_http_errors_total counter',
      '# HELP portfolio_http_request_duration_seconds HTTP request duration.',
      '# TYPE portfolio_http_request_duration_seconds summary',
    ];
    for (const [key, metric] of this.metrics) {
      const [method, route] = key.split(' ', 2);
      const labels = `method="${method}",route="${route}"`;
      lines.push(`portfolio_http_requests_total{${labels}} ${metric.requests}`);
      lines.push(`portfolio_http_errors_total{${labels}} ${metric.errors}`);
      lines.push(
        `portfolio_http_request_duration_seconds_sum{${labels}} ${metric.durationSeconds}`,
      );
      lines.push(`portfolio_http_request_duration_seconds_count{${labels}} ${metric.requests}`);
    }
    return `${lines.join('\n')}\n`;
  }

  private normalize(route: string): string {
    if (route === '/graphql') return route;
    if (route.startsWith('/health/')) return '/health/:check';
    return '/other';
  }
}
