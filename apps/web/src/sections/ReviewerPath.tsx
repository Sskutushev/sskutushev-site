import { Terminal } from 'lucide-react';
import type { SiteCopy } from '../content/site-copy';

/**
 * What to do with this page if you are reviewing a candidate.
 *
 * A reviewer has ten minutes and no reason to trust any of the claims above.
 * Each step here ends somewhere that can be checked rather than read: a metric
 * measured in their own browser, a commit hash, an excerpt from a file, a
 * command that runs the whole system on their machine.
 */
export function ReviewerPath({
  copy,
  onEngineering,
}: {
  copy: SiteCopy;
  onEngineering: () => void;
}): React.JSX.Element {
  return (
    <section aria-labelledby="reviewer-title" className="reviewer">
      <div className="reviewer__head">
        <p className="t-meta text-tertiary">{copy.reviewer.label}</p>
        <h2 className="t-h3" id="reviewer-title">
          {copy.reviewer.title}
        </h2>
      </div>
      <ol className="reviewer__steps">
        {copy.reviewer.steps.map((step, index) => (
          <li key={step.title}>
            <span className="reviewer__index t-meta">{String(index + 1).padStart(2, '0')}</span>
            <div>
              <strong className="t-body">{step.title}</strong>
              <p className="t-small text-secondary">{step.body}</p>
            </div>
          </li>
        ))}
      </ol>
      <div className="reviewer__actions">
        <button className="button button--quiet" onClick={onEngineering} type="button">
          {copy.engineering.open}
          <Terminal aria-hidden size={18} strokeWidth={1.5} />
        </button>
        <code className="reviewer__command t-meta">{copy.reviewer.command}</code>
      </div>
    </section>
  );
}
