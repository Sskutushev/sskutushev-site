import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

/**
 * Every class a component renders has to exist in the stylesheet.
 *
 * The assistant, the quality dashboard and the GitHub activity panel all
 * rendered completely unstyled for weeks: the stylesheet had been written in
 * BEM (`assistant__form`) and the markup had not (`assistant-chat`), and
 * nothing in the build compares the two. Typecheck cannot see it, ESLint cannot
 * see it, and a screenshot only shows it to someone who scrolls to the panel.
 */

const sourceRoot = fileURLToPath(new URL('../', import.meta.url));

function walk(directory: string, extension: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return walk(path, extension);
    return entry.name.endsWith(extension) && !entry.name.endsWith('.spec.tsx') ? [path] : [];
  });
}

/** Class tokens written as literals in JSX. Interpolated ones are skipped. */
function renderedClasses(): Map<string, string> {
  const owners = new Map<string, string>();
  for (const file of walk(sourceRoot, '.tsx')) {
    const source = readFileSync(file, 'utf8');
    for (const [, value] of source.matchAll(/className=(?:"([^"]*)"|\{`([^`]*)`\})/g)) {
      const literal = value ?? '';
      for (const token of literal.split(/\s+/)) {
        // `is-${state}` and friends resolve at runtime; the modifier classes
        // they produce are asserted by the tests that drive those states.
        if (!token || token.includes('${') || token.includes('{')) continue;
        if (!owners.has(token)) owners.set(token, file.slice(sourceRoot.length));
      }
    }
  }
  return owners;
}

function definedClasses(): Set<string> {
  const defined = new Set<string>();
  const files = [join(sourceRoot, 'styles.css'), ...walk(join(sourceRoot, 'styles'), '.css')];
  for (const file of files) {
    for (const [, name] of readFileSync(file, 'utf8').matchAll(/\.(-?[_a-zA-Z][\w-]*)/g)) {
      if (name) defined.add(name);
    }
  }
  return defined;
}

describe('rendered class names', () => {
  it('are all defined in the stylesheet', () => {
    const defined = definedClasses();
    const missing = [...renderedClasses()]
      .filter(([token]) => !defined.has(token))
      .map(([token, file]) => `${token} (${file})`);
    expect(missing).toEqual([]);
  });
});
