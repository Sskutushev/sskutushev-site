import { useState } from 'react';

const scenarios = {
  NORMAL: { status: '200 · LIVE', path: 'cache hit → GraphQL response', tone: 'ok' },
  'CACHE MISS': { status: '200 · REFRESHED', path: 'database → cache fill → response', tone: 'ok' },
  'PROVIDER TIMEOUT': {
    status: '200 · DEGRADED',
    path: 'timeout budget → stale provider snapshot',
    tone: 'warn',
  },
  'STALE FALLBACK': {
    status: '200 · STALE',
    path: 'source unavailable → labelled snapshot',
    tone: 'warn',
  },
  INCIDENT: {
    status: '503 · FAIL CLOSED',
    path: 'dependency failure → no false success',
    tone: 'error',
  },
} as const;

type Scenario = keyof typeof scenarios;

export function CaseSimulation(): React.JSX.Element {
  const [active, setActive] = useState<Scenario>('NORMAL');
  const result = scenarios[active];
  return (
    <section className="case-simulation" aria-labelledby="simulation-title">
      <header>
        <p className="section-no">SIMULATION · NOT LIVE TRAFFIC</p>
        <h3 id="simulation-title">RESILIENCE PATH EXPLORER</h3>
      </header>
      <div className="simulation-controls" role="group" aria-label="Simulated request condition">
        {(Object.keys(scenarios) as Scenario[]).map((scenario) => (
          <button
            aria-pressed={active === scenario}
            className={active === scenario ? 'active' : ''}
            key={scenario}
            onClick={() => setActive(scenario)}
          >
            {scenario}
          </button>
        ))}
      </div>
      <output className={`simulation-result ${result.tone}`} aria-live="polite">
        <strong>{result.status}</strong>
        <span>{result.path}</span>
      </output>
    </section>
  );
}
