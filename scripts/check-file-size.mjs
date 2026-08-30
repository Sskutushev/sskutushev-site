import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const tracked = execFileSync('git', ['ls-files', '-z'], { encoding: 'utf8' })
  .split('\0')
  .filter(Boolean);
// This is a code-complexity guard. Stylesheets are governed by CSS tooling and
// can legitimately be long without increasing executable control-flow risk.
const sourcePattern = /\.(?:[cm]?[jt]sx?|py|go)$/;
const generatedPattern =
  /(?:^|\/)(?:dist|coverage|generated|node_modules)(?:\/|$)|^apps\/web\/src\/graphql\//;
const warnings = [];
const failures = [];

for (const file of tracked) {
  if (!sourcePattern.test(file) || generatedPattern.test(file)) continue;
  const lines = readFileSync(file, 'utf8').split(/\r?\n/).length;
  if (lines > 600) failures.push(`${file}: ${lines} lines (limit 600)`);
  else if (lines > 350) warnings.push(`${file}: ${lines} lines (warning threshold 350)`);
}

for (const warning of warnings) console.warn(`WARN ${warning}`);
if (failures.length) {
  console.error(`Source file size guard failed:\n${failures.join('\n')}`);
  process.exit(1);
}
console.log(`File size guard passed (${warnings.length} warning(s), no file above 600 lines).`);
