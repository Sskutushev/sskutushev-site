/**
 * Facts the build recorded about itself, written to `dist/evidence.json` by
 * `scripts/build-evidence.mjs`.
 *
 * This is a fourth data state alongside live, stale and failed: measured, but
 * measured at build time rather than now. The published site has no API behind
 * it, so without this the whole engineering section would be a column of
 * honest but useless "offline" labels.
 */
export interface BuildEvidence {
  /** Null when the build had no repository, e.g. from a source archive. */
  sha: string | null;
  ref: string | null;
  builtAt: string;
  runUrl: string | null;
  commitUrl: string | null;
  bundle: { entryGzipBytes: number; largestChunkGzipBytes: number; chunks: number };
  gates: string[];
}

function isEvidence(value: unknown): value is BuildEvidence {
  if (typeof value !== 'object' || value === null) return false;
  const candidate = value as Partial<BuildEvidence>;
  return (
    typeof candidate.builtAt === 'string' &&
    Array.isArray(candidate.gates) &&
    typeof candidate.bundle?.entryGzipBytes === 'number'
  );
}

export async function fetchBuildEvidence(): Promise<BuildEvidence> {
  const response = await fetch(`${import.meta.env.BASE_URL}evidence.json`, { cache: 'no-cache' });
  if (!response.ok) throw new Error(`Build evidence responded ${response.status}`);
  const value: unknown = await response.json();
  // A truncated or rewritten file is a failure, not a panel of undefineds.
  if (!isEvidence(value)) throw new Error('Build evidence is not in the expected shape');
  return value;
}

export function kilobytes(bytes: number): string {
  return `${(bytes / 1000).toFixed(1)} KB`;
}
