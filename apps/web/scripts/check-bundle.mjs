import { gzipSync } from 'node:zlib';
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const assetsDirectory = fileURLToPath(new URL('../dist/assets/', import.meta.url));
const javascript = readdirSync(assetsDirectory).filter((file) => file.endsWith('.js'));
const sizes = javascript.map((file) => ({
  file,
  gzipBytes: gzipSync(readFileSync(join(assetsDirectory, file))).byteLength,
}));
const entry = sizes.find(({ file }) => file.startsWith('index-'));

if (!entry) throw new Error('Bundle budget could not find the application entry chunk');

const violations = [
  ...(entry.gzipBytes > 250_000
    ? [`entry ${entry.file} is ${entry.gzipBytes} bytes gzip (budget 250000)`]
    : []),
  ...sizes
    .filter(({ gzipBytes }) => gzipBytes > 300_000)
    .map(({ file, gzipBytes }) => `${file} is ${gzipBytes} bytes gzip (chunk budget 300000)`),
];

if (violations.length) throw new Error(`Bundle budget exceeded:\n${violations.join('\n')}`);

console.log(
  `Bundle budget passed: entry ${entry.gzipBytes} bytes gzip; largest chunk ${Math.max(...sizes.map(({ gzipBytes }) => gzipBytes))} bytes gzip.`,
);

const reportDirectory = resolve(fileURLToPath(new URL('../../../artifacts/', import.meta.url)));
mkdirSync(reportDirectory, { recursive: true });
writeFileSync(
  join(reportDirectory, 'bundle.json'),
  JSON.stringify({ entryGzipBytes: entry.gzipBytes, chunks: sizes }, null, 2),
);
