import { FlowDiagram } from '../cases/FlowDiagram';
import { siteReadFlow } from '../cases/site-flow';
import type { SiteCopy } from '../content/site-copy';
import type { Locale } from '../lib/portfolio';
import { StatusDot } from '../ui/StatusDot';
import type { DataState } from '../ui/StatusDot';

/**
 * The site's own read path.
 *
 * The node list that used to sit above this drawing named the same seven
 * components in a different order and could drift from it; the drawing is now
 * the only place the topology is stated.
 */
export function Architecture({
  copy,
  locale,
  state,
  detail,
}: {
  copy: SiteCopy;
  locale: Locale;
  state: DataState;
  detail: string;
}): React.JSX.Element {
  return (
    <section className="section" id="architecture">
      <div className="section__head">
        <p className="section__index t-meta">03 / {copy.sections.architecture}</p>
        <p className="section__note t-meta-sm">{copy.architecture.note}</p>
      </div>

      <FlowDiagram flow={siteReadFlow} label={copy.architecture.title} locale={locale} />

      <div className="pipeline__console">
        {copy.architecture.cards.map((card) => (
          <article key={card.label}>
            <p className="t-meta-sm text-tertiary">{card.label}</p>
            <strong className="t-h3">{card.heading}</strong>
            <p className="t-small text-secondary">{card.body}</p>
          </article>
        ))}
      </div>

      <p className="pipeline__state t-meta">
        <StatusDot state={state} />
        {detail}
      </p>
    </section>
  );
}
