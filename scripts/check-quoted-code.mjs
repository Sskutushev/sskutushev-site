/**
 * Every excerpt quoted from another repository is still that repository's code.
 *
 * `case-notes.spec.ts` holds the excerpts taken from this repository to their
 * files on disk. It cannot do the same for the ones taken from Sergey's other
 * public repositories, so this does — by fetching each file at the commit the
 * note pins and asserting the excerpt appears in it verbatim.
 *
 * It is a script rather than a test because it reaches GitHub: a unit suite
 * that needs the network fails for reasons that have nothing to do with the
 * code under it, and the failure is then read as noise. Here a failure means
 * one thing only, and the message says which note and which file.
 *
 * A pinned commit cannot change under us, so this passing today and failing
 * tomorrow means the excerpt was edited here — which is exactly the rot worth
 * catching, because a wrong excerpt reads as evidence while being decoration.
 */
import { readFileSync } from 'node:fs';

const OWNER = 'Sskutushev';
const source = readFileSync('apps/web/src/cases/case-notes.ts', 'utf8');

/**
 * Read the notes without compiling TypeScript. The file is data with a type
 * annotation on top, and pulling in a transpiler to run one check in CI costs
 * more than the parse it replaces.
 */
function quotedNotes() {
  const notes = [];
  const pinned = Object.fromEntries(
    [...source.matchAll(/'([\w.-]+)':\s*'([0-9a-f]{40})',/g)].map(([, name, commit]) => [
      name,
      commit,
    ]),
  );
  const pattern =
    /repository:\s*\{\s*name:\s*'([\w.-]+)',\s*commit:\s*PINNED\['([\w.-]+)'\],?\s*\},\s*file:\s*'([^']+)',\s*language:\s*'([^']+)',\s*lines:\s*\[([\s\S]*?)\n\s*\],/g;
  for (const [, name, pinKey, file, , body] of source.matchAll(pattern)) {
    const commit = pinned[pinKey];
    if (!commit) throw new Error(`No pinned commit for ${pinKey}`);
    const lines = [...body.matchAll(/^\s*'((?:[^'\\]|\\.)*)',$/gm)].map(([, value]) =>
      value.replace(/\\'/g, "'").replace(/\\\\/g, '\\'),
    );
    notes.push({ name, commit, file, excerpt: lines.join('\n') });
  }
  return notes;
}

const notes = quotedNotes();
if (notes.length === 0) {
  console.log('No excerpts are quoted from another repository.');
  process.exit(0);
}

let failed = false;
for (const note of notes) {
  const url = `https://raw.githubusercontent.com/${OWNER}/${note.name}/${note.commit}/${note.file}`;
  const response = await fetch(url);
  if (!response.ok) {
    console.error(`${note.name}/${note.file}: ${response.status} from ${url}`);
    failed = true;
    continue;
  }
  // Line endings are the repository's business, not the excerpt's.
  const body = (await response.text()).replace(/\r\n/g, '\n');
  if (!body.includes(note.excerpt)) {
    console.error(
      `${note.name}/${note.file}: the excerpt is no longer in the file at that commit.`,
    );
    failed = true;
    continue;
  }
  console.log(`${note.name}/${note.file} @ ${note.commit.slice(0, 7)}: verbatim.`);
}

if (failed) process.exit(1);
