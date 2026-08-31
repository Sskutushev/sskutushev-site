import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

/**
 * Facts about this build, emitted next to it.
 *
 * The published site is a static build with no API behind it, so every live
 * panel on it is honestly offline. That left nothing concrete for a reviewer to
 * look at. These are measurements the build itself made — the commit it came
 * from, the gates that had to pass before it was allowed to publish, and the
 * bundle sizes the budget check just weighed — so the page can show real
 * numbers offline without presenting them as runtime state.
 *
 * Everything here is derived. Nothing is written by hand, so nothing can drift.
 */

const bundle = JSON.parse(
  readFileSync(fileURLToPath(new URL('../../../artifacts/bundle.json', import.meta.url)), 'utf8'),
);

function gitSha() {
  if (process.env.GITHUB_SHA) return process.env.GITHUB_SHA;
  try {
    return execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
  } catch {
    // A build from a source archive has no repository. The panel reports the
    // commit as unknown rather than inventing one.
    return null;
  }
}

/**
 * The gates this build had to clear, read from the workflow so the list cannot
 * fall behind it. Publishing and deployment are jobs, not gates: they run after
 * this build exists and counting them would overstate what was checked.
 */
function gates() {
  const workflow = readFileSync(
    fileURLToPath(new URL('../../../.github/workflows/ci.yml', import.meta.url)),
    'utf8',
  );
  return [...workflow.matchAll(/^ {4}name: (\d+ · .+)$/gm)]
    .map(([, name]) => name)
    .filter((name) => !/Publish Pages|Deploy production/.test(name));
}

const sha = gitSha();
const server = process.env.GITHUB_SERVER_URL ?? 'https://github.com';
const evidence = {
  sha,
  ref: process.env.GITHUB_REF_NAME ?? null,
  builtAt: new Date().toISOString(),
  runUrl:
    process.env.GITHUB_RUN_ID && process.env.GITHUB_REPOSITORY
      ? `${server}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`
      : null,
  commitUrl:
    sha && process.env.GITHUB_REPOSITORY
      ? `${server}/${process.env.GITHUB_REPOSITORY}/commit/${sha}`
      : sha
        ? `https://github.com/Sskutushev/sskutushev-site/commit/${sha}`
        : null,
  bundle: {
    entryGzipBytes: bundle.entryGzipBytes,
    largestChunkGzipBytes: Math.max(...bundle.chunks.map((chunk) => chunk.gzipBytes)),
    chunks: bundle.chunks.length,
  },
  gates: gates(),
};

writeFileSync(
  fileURLToPath(new URL('../dist/evidence.json', import.meta.url)),
  `${JSON.stringify(evidence, null, 2)}\n`,
);

console.log(
  `Build evidence written: ${evidence.sha?.slice(0, 7) ?? 'unknown commit'}, ${evidence.gates.length} gates, entry ${evidence.bundle.entryGzipBytes} bytes gzip.`,
);
