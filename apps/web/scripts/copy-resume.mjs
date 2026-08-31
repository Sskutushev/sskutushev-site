import { copyFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

/**
 * Puts the résumé next to the published site.
 *
 * The API serves the same file from object storage, which is the interesting
 * path and the one the architecture section describes. It is not the path the
 * published build can use: GitHub Pages has no API behind it, so both résumé
 * buttons pointed at an origin that does not answer and did nothing at all.
 *
 * The file ships with the build. One copy, one source, and a link that works
 * whether or not anything else is running.
 */
const source = fileURLToPath(
  new URL('../../../infrastructure/assets/sergey-kutushev-resume.pdf', import.meta.url),
);
const target = fileURLToPath(new URL('../dist/sergey-kutushev-resume.pdf', import.meta.url));

if (!existsSync(source)) {
  throw new Error(`The résumé is missing from ${source}; the download links would be dead.`);
}

copyFileSync(source, target);
console.log('Résumé copied into the build.');
