import { caseVisual } from '../cases/case-visuals';
import type { SiteCopy } from '../content/site-copy';
import type { Locale, Portfolio } from '../lib/portfolio';

/**
 * Selected systems, as chapters rather than as rows.
 *
 * Each case owns a viewport and a visual that explains its specific problem.
 * As a table these read as six lines of similar-sounding claims; the visual is
 * the part that shows the behaviour instead of asserting it, which is the whole
 * argument the page is making.
 */
export function Work({
  copy,
  locale,
  cases,
}: {
  copy: SiteCopy;
  locale: Locale;
  cases: Portfolio['caseStudies'];
}): React.JSX.Element {
  return (
    <section className="section section--work" id="work">
      <div className="section__head">
        <p className="section__index t-meta">02 / {copy.sections.work}</p>
        <p className="section__note t-meta-sm">{copy.work.note}</p>
      </div>

      {cases.map((item, index) => {
        const visual = caseVisual(item.slug, locale);
        return (
          <article className="case" id={`case-${item.slug}`} key={item.slug}>
            <p className="case__index t-meta">{String(index + 1).padStart(2, '0')}</p>
            <p className="case__tag t-meta-sm">{item.approach}</p>
            <div className="case__copy">
              <h3 className="case__title t-h2">{item.title}</h3>
              <p className="case__problem t-lead">{item.problem}</p>
              <p className="case__result t-small text-secondary">{item.result}</p>
              <ul className="case__stack">
                {item.technologies.map((technology) => (
                  <li key={technology}>{technology}</li>
                ))}
              </ul>
            </div>
            {visual && <div className="case__visual">{visual}</div>}
          </article>
        );
      })}
    </section>
  );
}
