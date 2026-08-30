export type DataState = 'ok' | 'degraded' | 'failed' | 'simulated';

/**
 * Every metric on the site resolves to one of four states. `degraded` is never
 * rendered in the same colour as `ok`: the distinction between fresh and stale
 * is a claim the site makes explicitly.
 */
export function StatusDot({ state }: { state: DataState }): React.JSX.Element {
  return <i aria-hidden className={`status-dot status-dot--${state}`} />;
}
