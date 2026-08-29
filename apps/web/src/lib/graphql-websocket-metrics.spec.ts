import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  GraphqlWebSocketMonitor,
  graphqlWebSocketUrl,
  sparklinePoints,
  type WebSocketMetrics,
} from './graphql-websocket-metrics';

class FakeWebSocket extends EventTarget {
  static readonly OPEN = 1;
  static instances: FakeWebSocket[] = [];
  readonly sent: string[] = [];
  readyState = FakeWebSocket.OPEN;

  constructor(
    readonly url: string,
    readonly protocol: string,
  ) {
    super();
    FakeWebSocket.instances.push(this);
  }

  send(data: string): void {
    this.sent.push(data);
  }

  close(): void {
    this.readyState = 3;
    this.dispatchEvent(new Event('close'));
  }

  message(value: unknown): void {
    this.dispatchEvent(new MessageEvent('message', { data: JSON.stringify(value) }));
  }
}

describe('GraphqlWebSocketMonitor', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    FakeWebSocket.instances = [];
    vi.stubGlobal('WebSocket', FakeWebSocket);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('derives secure and local websocket endpoints', () => {
    expect(graphqlWebSocketUrl('https://api.example.com/graphql', 'https://site.example.com')).toBe(
      'wss://api.example.com/graphql',
    );
    expect(graphqlWebSocketUrl('/graphql', 'http://localhost:3000')).toBe(
      'ws://localhost:3000/graphql',
    );
  });

  it('maps measured samples to bounded sparkline coordinates', () => {
    expect(sparklinePoints([])).toBe('');
    expect(sparklinePoints([10, 20, 15], 100, 20)).toBe('0.0,20.0 50.0,0.0 100.0,10.0');
  });

  it('subscribes, measures protocol pong RTT, and reports real events', () => {
    const reports: WebSocketMetrics[] = [];
    const now = vi.spyOn(performance, 'now').mockReturnValueOnce(100).mockReturnValueOnce(142);
    const monitor = new GraphqlWebSocketMonitor('ws://localhost/graphql', (value) =>
      reports.push(value),
    );

    monitor.start();
    const socket = FakeWebSocket.instances[0]!;
    expect(socket.protocol).toBe('graphql-transport-ws');
    socket.dispatchEvent(new Event('open'));
    expect(JSON.parse(socket.sent[0]!)).toEqual({ type: 'connection_init' });

    socket.message({ type: 'connection_ack' });
    expect(JSON.parse(socket.sent[1]!)).toMatchObject({
      id: 'engineering-events',
      type: 'subscribe',
    });
    expect(JSON.parse(socket.sent[2]!)).toEqual({ type: 'ping', payload: { sentAt: 100 } });
    socket.message({ type: 'pong', payload: { sentAt: 100 } });
    socket.message({
      type: 'next',
      payload: { data: { systemEvent: { type: 'QUALITY_IMPORTED' } } },
    });

    expect(reports.at(-1)).toMatchObject({
      state: 'live',
      rttMs: 42,
      samples: [42],
      events: 1,
      lastEventType: 'QUALITY_IMPORTED',
    });
    monitor.stop();
    now.mockRestore();
  });

  it('reconnects with bounded backoff after an unexpected close', async () => {
    const reports: WebSocketMetrics[] = [];
    const monitor = new GraphqlWebSocketMonitor('ws://localhost/graphql', (value) =>
      reports.push(value),
    );
    monitor.start();
    FakeWebSocket.instances[0]!.close();

    expect(reports.at(-1)).toMatchObject({ state: 'reconnecting', reconnects: 1 });
    await vi.advanceTimersByTimeAsync(999);
    expect(FakeWebSocket.instances).toHaveLength(1);
    await vi.advanceTimersByTimeAsync(1);
    expect(FakeWebSocket.instances).toHaveLength(2);
    monitor.stop();
  });
});
