import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const files = execFileSync('git', ['ls-files', '-z', 'apps/**/*.ts', 'apps/**/*.tsx'], {
  encoding: 'utf8',
})
  .split('\0')
  .filter(Boolean);
const violations = [];

for (const file of files) {
  const source = readFileSync(file, 'utf8');
  if (
    file.startsWith('apps/web/') &&
    /from\s+['\"][^'\"]*(?:apps\/api|@sskutushev\/api)/.test(source)
  ) {
    violations.push(`${file}: web imports API internals`);
  }
  if (
    file.endsWith('.resolver.ts') &&
    /from\s+['\"](?:@prisma\/client|[^'\"]*(?:database|storage)[^'\"]*)['\"]/.test(source)
  ) {
    violations.push(`${file}: resolver imports infrastructure directly`);
  }
  if (
    file.endsWith('.models.ts') &&
    /from\s+['\"][^'\"]*(?:database|storage)[^'\"]*['\"]/.test(source)
  ) {
    violations.push(`${file}: domain model imports infrastructure`);
  }
}

if (violations.length) {
  console.error(`Architecture boundary check failed:\n${violations.join('\n')}`);
  process.exit(1);
}
console.log(`Architecture boundaries passed across ${files.length} TypeScript source files.`);
