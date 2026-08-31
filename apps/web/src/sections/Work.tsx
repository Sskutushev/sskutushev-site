import { Code2 } from 'lucide-react';
import { useCallback, useState } from 'react';
import { CaseDialog } from '../cases/CaseDialog';
import { caseNotes } from '../cases/case-notes';
import { caseVisual } from '../cases/case-visuals';
import type { SiteCopy } from '../content/site-copy';
import type { Locale, Portfolio } from '../lib/portfolio';

/**
 * Selected systems, as chapters rather than as rows.
 *
 * Each case owns a viewport, a visual that shows its behaviour, and the code
 * that decides it. As a table these read as six lines of similar-sounding
 * claims; a reviewer wants to check rather than believe, and the excerpt is the
 * part that can be checked.
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
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const closeNote = useCallback(() => setOpenSlug(null), []);
  // Resolved from the notes rather than from `cases`: the portfolio query can
  // resolve, fail or switch locale while the dialog is open, and a lookup into
  // the data would make it vanish mid-read on whichever of those happens first.
  const openNote = openSlug ? caseNotes[openSlug] : undefined;
  const openTitle = cases.find((item) => item.slug === openSlug)?.title ?? openSlug;

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
              {caseNotes[item.slug] && (
                <button
                  className="button button--quiet case__open"
                  onClick={() => setOpenSlug(item.slug)}
                  type="button"
                >
                  {copy.work.open}
                  <Code2 aria-hidden size={18} strokeWidth={1.5} />
                </button>
              )}
            </div>
            {visual && <div className="case__visual">{visual}</div>}
          </article>
        );
      })}

      {openNote && openTitle && (
        <CaseDialog
          copy={copy}
          locale={locale}
          note={openNote}
          onClose={closeNote}
          title={openTitle}
        />
      )}
    </section>
  );
}
