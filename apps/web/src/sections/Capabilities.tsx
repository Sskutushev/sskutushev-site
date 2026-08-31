import { capabilityMeta } from '../content/capabilities';
import type { SiteCopy } from '../content/site-copy';
import type { Locale, Portfolio } from '../lib/portfolio';

function groupByCategory(skills: Portfolio['skills']): Map<string, string[]> {
  const groups = new Map<string, string[]>();
  for (const skill of skills) {
    groups.set(skill.category, [...(groups.get(skill.category) ?? []), skill.name]);
  }
  return groups;
}

export function Capabilities({
  copy,
  locale,
  skills,
}: {
  copy: SiteCopy;
  locale: Locale;
  skills: Portfolio['skills'];
}): React.JSX.Element {
  return (
    <section className="section section--raised" id="capabilities">
      <div className="section__head">
        <p className="section__index t-meta">05 / {copy.sections.capabilities}</p>
      </div>
      <div className="capabilities__grid">
        {Array.from(groupByCategory(skills), ([category, names]) => {
          const meta = capabilityMeta[category];
          const Icon = meta?.icon;
          return (
            <article className="capability" key={category}>
              <div className="capability__head">
                {Icon ? (
                  <Icon aria-hidden className="capability__icon" size={22} strokeWidth={1.5} />
                ) : (
                  <span />
                )}
                <span className="t-meta-sm">{meta?.weight}</span>
              </div>
              <h3 className="t-h3">{category}</h3>
              {meta && <p className="t-small text-secondary">{meta.description[locale]}</p>}
              <div className="capability__stack">
                {names.map((name) => (
                  <span key={name}>{name}</span>
                ))}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
