import type { SiteCopy } from '../content/site-copy';

export function Manifesto({ copy }: { copy: SiteCopy }): React.JSX.Element {
  return (
    <section className="section section--raised" id="about">
      <div className="section__head">
        <p className="section__index t-meta">01 / {copy.sections.manifesto}</p>
      </div>
      <div className="grid">
        <h2 className="manifesto__title t-h1">
          {copy.manifesto.lines.map((line) => (
            <span key={line}>
              {line}
              <br />
            </span>
          ))}
        </h2>
        <figure className="manifesto__portrait">
          <img
            alt="Сергей Кутушев"
            height="640"
            loading="lazy"
            src={`${import.meta.env.BASE_URL}profile.jpg`}
            width="512"
          />
          <figcaption className="t-meta-sm">
            <span>Sergey Kutushev</span>
            <span>Saint Petersburg · UTC+3</span>
          </figcaption>
        </figure>
        <p className="manifesto__body t-body-lg">{copy.manifesto.body}</p>
        <dl className="manifesto__stack">
          {copy.manifesto.stack.map((entry) => (
            <div key={entry.label}>
              <dt>{entry.label}</dt>
              <dd>{entry.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
