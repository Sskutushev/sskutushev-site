import { execFileSync } from 'node:child_process';

const tracked = execFileSync('git', ['ls-files', '-z'], { encoding: 'utf8' })
  .split('\0')
  .filter(Boolean)
  .map((path) => path.replaceAll('\\', '/'));

const forbidden = tracked.filter(
  (path) =>
    /(^|\/)__pycache__\//u.test(path) ||
    /\.py[cod]$/u.test(path) ||
    /(^|\/)node_modules\//u.test(path) ||
    /(^|\/)coverage\//u.test(path) ||
    /(^|\/)dist\//u.test(path),
);

if (forbidden.length > 0) {
  throw new Error(`Generated artifacts are tracked:\n${forbidden.join('\n')}`);
}

const resumeAsset = 'infrastructure/assets/sergey-kutushev-resume.pdf';
if (!tracked.includes(resumeAsset)) {
  throw new Error(`${resumeAsset} must remain a versioned deployment input`);
}
if (tracked.includes('apps/web/public/sergey-kutushev-resume.pdf')) {
  throw new Error('The resume must not be bundled as a frontend static asset');
}

console.log(`Repository hygiene passed for ${tracked.length} tracked files.`);
