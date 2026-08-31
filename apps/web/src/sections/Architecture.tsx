import { ArrowRight } from 'lucide-react';
import { Fragment } from 'react';
import type { SiteCopy } from '../content/site-copy';
import { StatusDot } from '../ui/StatusDot';
import type { DataState } from '../ui/StatusDot';

const NODES = [
  { id: 'client', label: 'React / R3F', role: 'Client' },
  { id: 'graphql', label: 'GraphQL', role: 'Contract' },
  { id: 'nest', label: 'NestJS', role: 'Domain' },
  { id: 'redis', label: 'Redis', role: 'Cache / queue' },
  { id: 'prisma', label: 'Prisma', role: 'Access' },
  { id: 'cockroach', label: 'CockroachDB', role: 'Source of truth' },
  { id: 's3', label: 'S3', role: 'Assets' },
] as const;

const READ_PATH = ['Request', 'contract', 'domain', 'data', 'response'] as const;

export function Architecture({
  copy,
  state,
  detail,
  children,
}: {
  copy: SiteCopy;
  state: DataState;
  detail: string;
  children?: React.ReactNode;
}): React.JSX.Element {
  return (
    <section className="section" id="architecture">
      <div className="section__head">
        <p className="section__index t-meta">03 / {copy.sections.architecture}</p>
        <p className="section__note t-meta-sm">
          {READ_PATH.map((step, index) => (
            <Fragment key={step}>
              {index > 0 && <ArrowRight aria-hidden size={13} strokeWidth={1.5} />}
              {step}
            </Fragment>
          ))}
        </p>
      </div>

      <ol className="pipeline">
        {NODES.map((node, index) => (
          <li className="pipeline__node" key={node.id}>
            <span className="pipeline__step t-meta-sm">{String(index + 1).padStart(2, '0')}</span>
            <strong className="t-small">{node.label}</strong>
            <span className="t-meta-sm text-tertiary">{node.role}</span>
          </li>
        ))}
      </ol>

      <div className="pipeline__console">
        <article>
          <p className="t-meta-sm text-tertiary">Read path</p>
          <strong className="t-h3">GraphQL aggregate</strong>
          <p className="t-small text-secondary">
            One typed, localised query. The frontend has no second source.
          </p>
        </article>
        <article>
          <p className="t-meta-sm text-tertiary">Resilience</p>
          <strong className="t-h3">Redis SWR</strong>
          <p className="t-small text-secondary">
            Fresh, then stale, then an honest fallback — never a silent zero.
          </p>
        </article>
        <article>
          <p className="t-meta-sm text-tertiary">Data / assets</p>
          <strong className="t-h3">Cockroach + S3</strong>
          <p className="t-small text-secondary">
            Source of truth in the database, binaries uploaded straight to storage.
          </p>
        </article>
      </div>

      <p className="pipeline__state t-meta">
        <StatusDot state={state} />
        {detail}
      </p>

      {children}
    </section>
  );
}
