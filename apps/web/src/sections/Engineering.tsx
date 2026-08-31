import { useQuery } from '@tanstack/react-query';
import { ArrowUpRight } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { GithubActivity } from '../components/GithubActivity';
import { QualityDashboard } from '../components/QualityDashboard';
import type { SiteCopy } from '../content/site-copy';
import { fetchBuildEvidence, kilobytes } from '../lib/build-evidence';
import type { Locale } from '../lib/portfolio';
import type { EngineeringMetrics } from '../lib/use-engineering-metrics';
import { StatusDot } from '../ui/StatusDot';
import type { DataState } from '../ui/StatusDot';

function Row({ label, children }: { label: string; children: React.ReactNode }): React.JSX.Element {
  return (
    <div className="evidence__row">
      <dt className="t-meta-sm">{label}</dt>
      <dd className="t-small">{children}</dd>
    </div>
  );
}

function Panel({
  title,
  state,
  stateLabel,
  children,
}: {
  title: string;
  state: DataState;
  stateLabel: string;
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <article className="evidence">
      <header className="evidence__head">
        <h3 className="t-meta">{title}</h3>
        <p className="t-meta-sm text-tertiary">
          <StatusDot state={state} />
          {stateLabel}
        </p>
      </header>
      {children}
    </article>
  );
}

/**
 * What a reviewer can check without taking anything on trust.
 *
 * This used to live behind the `~` drawer, which almost nobody opens, so the
 * part of the project with the most engineering in it was the part least likely
 * to be seen. The drawer keeps what belongs to it — frame time, draw calls, web
 * vitals — and everything that is evidence about the system moves here.
 */
export function Engineering({
  copy,
  locale,
  runtime,
  dataState,
  dataDetail,
  onVisible,
}: {
  copy: SiteCopy;
  locale: Locale;
  runtime: EngineeringMetrics;
  dataState: DataState;
  dataDetail: string;
  /** Opens the realtime socket only while this section is on screen. */
  onVisible: (visible: boolean) => void;
}): React.JSX.Element {
  const section = useRef<HTMLElement>(null);

  useEffect(() => {
    const node = section.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) =>
      onVisible(entry?.isIntersecting ?? false),
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [onVisible]);

  const {
    data: evidence,
    isPending,
    isError,
  } = useQuery({
    queryKey: ['build-evidence'],
    queryFn: fetchBuildEvidence,
    staleTime: Number.POSITIVE_INFINITY,
    retry: 0,
  });

  const socket = runtime.websocket;
  const socketState: DataState =
    socket.state === 'live'
      ? 'ok'
      : socket.state === 'offline'
        ? 'failed'
        : // Connecting and reconnecting are the same fact to a reader: the feed
          // is not carrying events yet.
          'degraded';

  return (
    <section className="section section--raised" id="engineering" ref={section}>
      <div className="section__head">
        <p className="section__index t-meta">04 / {copy.sections.engineering}</p>
        <p className="section__note t-meta-sm">{copy.engineeringSection.note}</p>
      </div>

      <div className="evidence__grid">
        <Panel
          state={isError ? 'failed' : isPending ? 'simulated' : 'ok'}
          stateLabel={copy.engineeringSection.atBuild}
          title={copy.engineeringSection.build}
        >
          {evidence ? (
            <dl className="evidence__list">
              <Row label={copy.engineeringSection.commit}>
                {evidence.commitUrl && evidence.sha ? (
                  <a href={evidence.commitUrl} rel="noreferrer" target="_blank">
                    <code>{evidence.sha.slice(0, 7)}</code>
                    <ArrowUpRight aria-hidden size={14} strokeWidth={1.5} />
                  </a>
                ) : (
                  <code>{copy.engineeringSection.unknown}</code>
                )}
              </Row>
              <Row label={copy.engineeringSection.built}>
                {new Date(evidence.builtAt).toLocaleString(locale === 'RU' ? 'ru-RU' : 'en-GB', {
                  dateStyle: 'medium',
                  timeStyle: 'short',
                })}
              </Row>
              <Row label={copy.engineeringSection.gates}>
                {/* A build made outside the pipeline has no gate list to report.
                    Zero would read as "nothing was checked"; it is unknown. */}
                {evidence.gates.length === 0 ? (
                  <code>{copy.engineeringSection.unknown}</code>
                ) : evidence.runUrl ? (
                  <a href={evidence.runUrl} rel="noreferrer" target="_blank">
                    {evidence.gates.length} <ArrowUpRight aria-hidden size={14} strokeWidth={1.5} />
                  </a>
                ) : (
                  evidence.gates.length
                )}
              </Row>
              <Row label={copy.engineeringSection.bundle}>
                {kilobytes(evidence.bundle.entryGzipBytes)} · {evidence.bundle.chunks}{' '}
                {copy.engineeringSection.chunks}
              </Row>
            </dl>
          ) : null}
          {evidence && evidence.gates.length > 0 ? (
            /* Named, not counted. "17 gates" is a number; the list is the claim. */
            <details className="evidence__gates">
              <summary className="t-meta-sm">{copy.engineeringSection.gateList}</summary>
              <ol className="t-small">
                {evidence.gates.map((gate) => (
                  <li key={gate}>{gate}</li>
                ))}
              </ol>
            </details>
          ) : (
            <p className="t-small text-secondary">
              {isError ? copy.engineeringSection.buildMissing : copy.engineeringSection.loading}
            </p>
          )}
        </Panel>

        <Panel
          state={dataState}
          stateLabel={dataDetail}
          title={copy.engineeringSection.liveSurface}
        >
          <dl className="evidence__list">
            <Row label="GraphQL">
              <code>portfolioData(locale: {locale})</code>
            </Row>
            <Row label={copy.engineeringSection.roundTrip}>
              {/* A failed request has a duration too, and showing it as a round
                  trip reads as a slow success. It is reported as a refusal. */}
              {dataState === 'failed' || runtime.graphqlRttMs === null
                ? '—'
                : `${runtime.graphqlRttMs.toFixed(0)} ms${
                    runtime.serverMs === null ? '' : ` · server ${runtime.serverMs.toFixed(0)} ms`
                  }`}
            </Row>
            <Row label={copy.engineeringSection.events}>
              <span className="evidence__socket">
                <StatusDot state={socketState} />
                {socket.state} · {socket.events} · RTT {socket.rttMs?.toFixed(0) ?? '—'} ms
              </span>
            </Row>
          </dl>
          <p className="t-small text-secondary">{copy.engineeringSection.liveNote}</p>
        </Panel>

        <div className="evidence evidence--wide">
          <QualityDashboard locale={locale} />
        </div>
        <div className="evidence evidence--wide">
          <GithubActivity locale={locale} />
        </div>
      </div>
    </section>
  );
}
