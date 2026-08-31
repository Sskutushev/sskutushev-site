import { ArrowRight } from 'lucide-react';
import { Fragment, useState } from 'react';
import type { Locale } from '../lib/portfolio';
import { StatusDot } from '../ui/StatusDot';
import type { DataState } from '../ui/StatusDot';

interface Scenario {
  id: string;
  label: Record<Locale, string>;
  status: string;
  path: Record<Locale, string[]>;
  tone: Exclude<DataState, 'simulated'>;
}

/**
 * A named set of degradation paths, not live traffic. The label states that
 * explicitly: an unlabelled simulation presented next to real telemetry would
 * be exactly the invented-metric problem the site argues against.
 */
const SCENARIOS: Scenario[] = [
  {
    id: 'normal',
    label: { RU: 'Норма', EN: 'Normal' },
    status: '200 · LIVE',
    path: { RU: ['попадание в кэш', 'ответ'], EN: ['cache hit', 'response'] },
    tone: 'ok',
  },
  {
    id: 'miss',
    label: { RU: 'Промах кэша', EN: 'Cache miss' },
    status: '200 · REFRESHED',
    path: {
      RU: ['база', 'заполнение кэша', 'ответ'],
      EN: ['database', 'cache fill', 'response'],
    },
    tone: 'ok',
  },
  {
    id: 'timeout',
    label: { RU: 'Таймаут провайдера', EN: 'Provider timeout' },
    status: '200 · DEGRADED',
    path: {
      RU: ['бюджет таймаута', 'устаревший снимок провайдера'],
      EN: ['timeout budget', 'stale provider snapshot'],
    },
    tone: 'degraded',
  },
  {
    id: 'stale',
    label: { RU: 'Отдача из снимка', EN: 'Stale fallback' },
    status: '200 · STALE',
    path: {
      RU: ['источник недоступен', 'помеченный снимок'],
      EN: ['source unavailable', 'labelled snapshot'],
    },
    tone: 'degraded',
  },
  {
    id: 'incident',
    label: { RU: 'Инцидент', EN: 'Incident' },
    status: '503 · FAIL CLOSED',
    path: {
      RU: ['отказ зависимости', 'отказ вместо ложного успеха'],
      EN: ['dependency failure', 'refusal instead of false success'],
    },
    tone: 'failed',
  },
];

const TITLE: Record<Locale, string> = {
  RU: 'Пути отказоустойчивости',
  EN: 'Resilience paths',
};

const SIMULATED: Record<Locale, string> = {
  RU: 'Симуляция · не боевой трафик',
  EN: 'Simulation · not live traffic',
};

export function CaseSimulation({ locale }: { locale: Locale }): React.JSX.Element {
  const [activeId, setActiveId] = useState(SCENARIOS[0]!.id);
  const active = SCENARIOS.find((scenario) => scenario.id === activeId) ?? SCENARIOS[0]!;

  return (
    <section aria-labelledby="simulation-title" className="simulation">
      <header className="simulation__head">
        <h3 className="t-h3" id="simulation-title">
          {TITLE[locale]}
        </h3>
        <p className="t-meta-sm text-tertiary">
          <StatusDot state="simulated" />
          {SIMULATED[locale]}
        </p>
      </header>
      <div aria-label={TITLE[locale]} className="simulation__controls" role="group">
        {SCENARIOS.map((scenario) => (
          <button
            aria-pressed={scenario.id === activeId}
            key={scenario.id}
            onClick={() => setActiveId(scenario.id)}
            type="button"
          >
            {scenario.label[locale]}
          </button>
        ))}
      </div>
      <output
        aria-live="polite"
        className={`simulation__result simulation__result--${active.tone}`}
      >
        <strong className="t-meta">{active.status}</strong>
        <span className="simulation__path t-small text-secondary">
          {active.path[locale].map((step, index) => (
            <Fragment key={step}>
              {index > 0 && <ArrowRight aria-hidden size={14} strokeWidth={1.5} />}
              {step}
            </Fragment>
          ))}
        </span>
      </output>
    </section>
  );
}
