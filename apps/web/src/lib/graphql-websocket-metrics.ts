export type WebSocketState = 'connecting' | 'live' | 'reconnecting' | 'offline';

export interface WebSocketMetrics {
  state: WebSocketState;
  rttMs: number | null;
  samples: number[];
  reconnects: number;
  events: number;
  lastEventType: string | null;
}

const subscription = `subscription EngineeringSystemEvents {
  systemEvent {
    type
  }
}`;

export const initialWebSocketMetrics: WebSocketMetrics = {
  state: 'offline',
  rttMs: null,
  samples: [],
  reconnects: 0,
  events: 0,
  lastEventType: null,
};

export function graphqlWebSocketUrl(graphqlUrl: string, origin: string): string {
  const url = new URL(graphqlUrl, origin);
  url.protocol = url.protocol === 'https:' ? 'wss:' : 'ws:';
  return url.toString();
}

export function sparklinePoints(samples: number[], width = 120, height = 24): string {
  if (samples.length === 0) return '';
  const minimum = Math.min(...samples);
  const range = Math.max(Math.max(...samples) - minimum, 1);
  return samples
    .map((sample, index) => {
      const x = samples.length === 1 ? width : (index / (samples.length - 1)) * width;
      const y = height - ((sample - minimum) / range) * height;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');
}

export class GraphqlWebSocketMonitor {
  private socket: WebSocket | null = null;
  private pingTimer: ReturnType<typeof setInterval> | null = null;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private stopped = false;
  private reconnects = 0;
  private samples: number[] = [];
  private events = 0;
  private lastEventType: string | null = null;

  constructor(
    private readonly url: string,
    private readonly report: (metrics: WebSocketMetrics) => void,
    private readonly pingIntervalMs = 5_000,
  ) {}

  start(): void {
    this.stopped = false;
    this.connect(false);
  }

  stop(): void {
    this.stopped = true;
    if (this.pingTimer !== null) globalThis.clearInterval(this.pingTimer);
    if (this.reconnectTimer !== null) globalThis.clearTimeout(this.reconnectTimer);
    this.pingTimer = null;
    this.reconnectTimer = null;
    this.socket?.close(1000, 'Engineering Mode closed');
    this.socket = null;
    this.emit('offline');
  }

  private connect(reconnecting: boolean): void {
    this.emit(reconnecting ? 'reconnecting' : 'connecting');
    const socket = new WebSocket(this.url, 'graphql-transport-ws');
    this.socket = socket;
    socket.addEventListener('open', () => {
      socket.send(JSON.stringify({ type: 'connection_init' }));
    });
    socket.addEventListener('message', (event) => this.onMessage(socket, String(event.data)));
    socket.addEventListener('close', () => this.onClose(socket));
    socket.addEventListener('error', () => socket.close());
  }

  private onMessage(socket: WebSocket, raw: string): void {
    let message: { type?: string; payload?: unknown };
    try {
      message = JSON.parse(raw) as { type?: string; payload?: unknown };
    } catch {
      return;
    }
    if (message.type === 'connection_ack') {
      this.emit('live');
      socket.send(
        JSON.stringify({
          id: 'engineering-events',
          type: 'subscribe',
          payload: { query: subscription },
        }),
      );
      this.sendPing(socket);
      this.pingTimer = globalThis.setInterval(() => this.sendPing(socket), this.pingIntervalMs);
      return;
    }
    if (message.type === 'pong') {
      const sentAt = (message.payload as { sentAt?: unknown } | undefined)?.sentAt;
      if (typeof sentAt === 'number' && Number.isFinite(sentAt)) {
        const rtt = Math.max(0, performance.now() - sentAt);
        this.samples = [...this.samples, rtt].slice(-30);
        this.emit('live');
      }
      return;
    }
    if (message.type === 'next') {
      const type = (message.payload as { data?: { systemEvent?: { type?: unknown } } } | undefined)
        ?.data?.systemEvent?.type;
      this.events += 1;
      this.lastEventType = typeof type === 'string' ? type : null;
      this.emit('live');
    }
  }

  private sendPing(socket: WebSocket): void {
    if (socket.readyState !== WebSocket.OPEN) return;
    socket.send(JSON.stringify({ type: 'ping', payload: { sentAt: performance.now() } }));
  }

  private onClose(socket: WebSocket): void {
    if (this.socket !== socket) return;
    if (this.pingTimer !== null) globalThis.clearInterval(this.pingTimer);
    this.pingTimer = null;
    this.socket = null;
    if (this.stopped) return;
    this.reconnects += 1;
    this.emit('reconnecting');
    const delay = Math.min(1_000 * 2 ** (this.reconnects - 1), 15_000);
    this.reconnectTimer = globalThis.setTimeout(() => this.connect(true), delay);
  }

  private emit(state: WebSocketState): void {
    this.report({
      state,
      rttMs: this.samples.at(-1) ?? null,
      samples: this.samples,
      reconnects: this.reconnects,
      events: this.events,
      lastEventType: this.lastEventType,
    });
  }
}
