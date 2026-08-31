import type { Locale } from '../lib/portfolio';
import { FlowDiagram } from './FlowDiagram';
import { concurrencyFlow, cacheFlow, moneyFlow, rolloutFlow } from './flows';
import { PointProjection } from './PointProjection';
import { embeddingProjection, rankingProjection } from './projection';

const SCENARIOS: Record<Locale, string> = { RU: 'Сценарии', EN: 'Scenarios' };
const BASIS: Record<Locale, string> = { RU: 'Проекции', EN: 'Projections' };

/**
 * The visual belonging to each case chapter, keyed by the slug the API returns.
 *
 * Two engines cover all six. Four cases are a request travelling through a
 * topology; two are one dataset under several explicit projections. Six
 * bespoke widgets would have produced six visual languages on one page.
 */
export function caseVisual(slug: string, locale: Locale): React.JSX.Element | null {
  switch (slug) {
    case 'money':
      return <FlowDiagram flow={moneyFlow} label={SCENARIOS[locale]} locale={locale} />;
    case 'cache':
      return <FlowDiagram flow={cacheFlow} label={SCENARIOS[locale]} locale={locale} />;
    case 'financial-concurrency':
      return <FlowDiagram flow={concurrencyFlow} label={SCENARIOS[locale]} locale={locale} />;
    case 'rollout':
      return <FlowDiagram flow={rolloutFlow} label={SCENARIOS[locale]} locale={locale} />;
    case 'ranking':
      return <PointProjection data={rankingProjection()} label={BASIS[locale]} locale={locale} />;
    case 'vision':
      return <PointProjection data={embeddingProjection()} label={BASIS[locale]} locale={locale} />;
    default:
      return null;
  }
}
