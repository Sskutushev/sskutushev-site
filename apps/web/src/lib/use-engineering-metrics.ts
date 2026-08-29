import { useEffect, useState } from 'react';
import type { RenderMetrics } from '../scenes/RuntimeProfiler';
import {
  GraphqlWebSocketMonitor,
  graphqlWebSocketUrl,
  initialWebSocketMetrics,
  type WebSocketMetrics,
} from './graphql-websocket-metrics';

export interface EngineeringMetrics extends RenderMetrics {
  graphqlRttMs: number | null;
  serverMs: number | null;
  vitals: Partial<Record<'LCP' | 'INP' | 'CLS' | 'TTFB', number>>;
  websocket: WebSocketMetrics;
}

const initial: EngineeringMetrics = {
  drawCalls: 0,
  frameMs: 0,
  graphqlRttMs: null,
  serverMs: null,
  vitals: {},
  websocket: initialWebSocketMetrics,
};

export function useEngineeringMetrics(enabled: boolean): EngineeringMetrics {
  const [metrics, setMetrics] = useState(initial);
  useEffect(() => {
    const render = (event: Event) => {
      const detail = (event as CustomEvent<RenderMetrics>).detail;
      setMetrics((current) => ({ ...current, ...detail }));
    };
    const vital = (event: Event) => {
      const detail = (
        event as CustomEvent<{ name: keyof EngineeringMetrics['vitals']; value: number }>
      ).detail;
      setMetrics((current) => ({
        ...current,
        vitals: { ...current.vitals, [detail.name]: detail.value },
      }));
    };
    const resource = new PerformanceObserver((list) => {
      const resources = list
        .getEntries()
        .filter((entry) => entry.entryType === 'resource') as PerformanceResourceTiming[];
      const graphql = resources.reverse().find((entry) => entry.name.includes('/graphql'));
      if (!graphql) return;
      const server = graphql.serverTiming.find((entry) => entry.name === 'app');
      setMetrics((current) => ({
        ...current,
        graphqlRttMs: graphql.duration,
        serverMs: server?.duration ?? null,
      }));
    });
    window.addEventListener('portfolio-render-metrics', render);
    window.addEventListener('portfolio-web-vital', vital);
    resource.observe({ type: 'resource', buffered: true });
    return () => {
      window.removeEventListener('portfolio-render-metrics', render);
      window.removeEventListener('portfolio-web-vital', vital);
      resource.disconnect();
    };
  }, []);
  useEffect(() => {
    if (!enabled) {
      setMetrics((current) => ({ ...current, websocket: initialWebSocketMetrics }));
      return;
    }
    const graphqlUrl = import.meta.env.VITE_GRAPHQL_URL || '/graphql';
    const monitor = new GraphqlWebSocketMonitor(
      graphqlWebSocketUrl(graphqlUrl, window.location.origin),
      (websocket) => setMetrics((current) => ({ ...current, websocket })),
    );
    monitor.start();
    return () => monitor.stop();
  }, [enabled]);
  return metrics;
}
