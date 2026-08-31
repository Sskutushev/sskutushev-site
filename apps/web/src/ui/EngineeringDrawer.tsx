import { X } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { AssistantChat } from '../components/AssistantChat';
import type { SiteCopy } from '../content/site-copy';
import { sparklinePoints } from '../lib/graphql-websocket-metrics';
import type { Locale } from '../lib/portfolio';
import { pointBudget, type RenderQuality } from '../lib/render-quality';
import type { EngineeringMetrics } from '../lib/use-engineering-metrics';

function Metric({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <div>
      <dt>{label}</dt>
      <dd>{children}</dd>
    </div>
  );
}

export function EngineeringDrawer({
  copy,
  locale,
  quality,
  runtime,
  dataState,
  onClose,
}: {
  copy: SiteCopy;
  locale: Locale;
  quality: RenderQuality;
  runtime: EngineeringMetrics;
  dataState: string;
  onClose: () => void;
}): React.JSX.Element {
  const close = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    close.current?.focus();
    const onKey = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <aside aria-labelledby="engineering-title" className="drawer" role="dialog">
      <header className="drawer__head">
        <h2 className="t-meta" id="engineering-title">
          {copy.engineering.title}
        </h2>
        <button
          aria-label={copy.engineering.close}
          className="icon-button"
          onClick={onClose}
          ref={close}
          type="button"
        >
          <X aria-hidden size={18} strokeWidth={1.5} />
        </button>
      </header>
      <div className="drawer__body">
        <dl className="drawer__metrics">
          <Metric label="FPS / frame">
            {runtime.frameMs
              ? `${Math.round(1000 / runtime.frameMs)} / ${runtime.frameMs.toFixed(1)} ms`
              : '—'}
          </Metric>
          <Metric label="Render profile">{quality}</Metric>
          <Metric label="Point budget">
            {pointBudget(quality).toLocaleString('en-GB') || '—'}
          </Metric>
          <Metric label="DPR">{window.devicePixelRatio.toFixed(2)}</Metric>
          <Metric label="Draw calls">{runtime.drawCalls || '—'}</Metric>
          <Metric label="GraphQL / server">
            {runtime.graphqlRttMs?.toFixed(0) ?? '—'} / {runtime.serverMs?.toFixed(0) ?? '—'} ms
          </Metric>
          <Metric label="WebSocket RTT">
            <span className="websocket-metric">
              <span>{runtime.websocket.rttMs?.toFixed(0) ?? '—'} ms</span>
              <svg
                aria-label="WebSocket round-trip time, latest 30 samples"
                height="24"
                role="img"
                viewBox="0 0 120 24"
                width="120"
              >
                <polyline points={sparklinePoints(runtime.websocket.samples)} />
              </svg>
              <small>
                {runtime.websocket.state} · {runtime.websocket.samples.length}/30 ·{' '}
                {runtime.websocket.reconnects} reconnects
              </small>
            </span>
          </Metric>
          <Metric label="Subscription">
            {runtime.websocket.events} events ·{' '}
            {runtime.websocket.lastEventType ?? 'awaiting event'}
          </Metric>
          <Metric label="LCP / INP / CLS">
            {runtime.vitals.LCP?.toFixed(0) ?? '—'} / {runtime.vitals.INP?.toFixed(0) ?? '—'} /{' '}
            {runtime.vitals.CLS?.toFixed(3) ?? '—'}
          </Metric>
          <Metric label="Portfolio data">{dataState}</Metric>
        </dl>
        <p className="drawer__note t-small">{copy.engineering.note}</p>
        <div className="drawer__panel">
          <AssistantChat locale={locale} />
        </div>
      </div>
    </aside>
  );
}
