import { onCLS, onINP, onLCP, onTTFB, type Metric } from 'web-vitals';

type Fetcher = typeof fetch;

export function vitalPayload(metric: Metric) {
  return {
    name: metric.name,
    value: metric.value,
    rating: metric.rating,
    navigationType: metric.navigationType,
  };
}

export function startWebVitalsReporting(
  sampleRate = 0.1,
  random: () => number = Math.random,
  fetcher: Fetcher = fetch,
): void {
  const sampled = sampleRate > 0 && random() < Math.min(sampleRate, 1);

  const graphqlUrl = import.meta.env.VITE_GRAPHQL_URL || `${window.location.origin}/graphql`;
  const endpoint = new URL('/telemetry/vitals', new URL(graphqlUrl, window.location.origin).origin);
  const report = (metric: Metric) => {
    window.dispatchEvent(
      new CustomEvent('portfolio-web-vital', {
        detail: { name: metric.name, value: metric.value },
      }),
    );
    if (!sampled) return;
    void fetcher(endpoint, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(vitalPayload(metric)),
      keepalive: true,
      credentials: 'omit',
    }).catch(() => undefined);
  };

  onLCP(report);
  onINP(report);
  onCLS(report);
  onTTFB(report);
}
