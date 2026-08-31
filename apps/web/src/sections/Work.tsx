import { ArrowUpRight } from 'lucide-react';
import type { SiteCopy } from '../content/site-copy';
import type { Portfolio } from '../lib/portfolio';

export function Work({
  copy,
  cases,
}: {
  copy: SiteCopy;
  cases: Portfolio['caseStudies'];
}): React.JSX.Element {
  return (
    <section className="section" id="work">
      <div className="section__head">
        <p className="section__index t-meta">02 / {copy.sections.work}</p>
        <p className="section__note t-meta-sm">
          Real constraints
          <br />
          Measurable behaviour
        </p>
      </div>
      <div className="cases">
        {cases.map((item, index) => (
          <article className="case" key={item.slug}>
            <span className="case__index t-meta">{String(index + 1).padStart(2, '0')}</span>
            <div>
              <p className="case__tag t-meta-sm">{item.approach}</p>
              <h3 className="case__title t-h3">{item.title}</h3>
            </div>
            <div className="case__detail">
              <p className="t-body">{item.problem}</p>
              <p className="t-small text-secondary">{item.result}</p>
              <div className="case__stack">
                {item.technologies.map((technology) => (
                  <span key={technology}>{technology}</span>
                ))}
              </div>
            </div>
            <ArrowUpRight aria-hidden className="case__arrow" size={20} strokeWidth={1.5} />
          </article>
        ))}
      </div>
    </section>
  );
}
