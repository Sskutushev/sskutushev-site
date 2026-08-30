import type { SiteCopy } from '../content/site-copy';
import type { Portfolio } from '../lib/portfolio';

export function Experience({
  copy,
  items,
}: {
  copy: SiteCopy;
  items: Portfolio['experience'];
}): React.JSX.Element {
  return (
    <section className="section" id="experience">
      <div className="section__head">
        <p className="section__index t-meta">05 / {copy.sections.experience}</p>
      </div>
      <div className="timeline">
        {items.map((item) => (
          <article className="timeline__item" key={`${item.company}-${item.period}`}>
            <p className="timeline__period t-meta">{item.period}</p>
            <div>
              <h3 className="t-h3">{item.company}</h3>
              <strong className="timeline__role t-small">{item.role}</strong>
            </div>
            <div>
              <p className="t-body">{item.summary}</p>
              {item.highlights.length > 0 && (
                <ul className="timeline__highlights t-small">
                  {item.highlights.map((highlight) => (
                    <li key={highlight}>{highlight}</li>
                  ))}
                </ul>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
