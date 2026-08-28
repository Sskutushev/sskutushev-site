import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const artifacts = resolve('artifacts');
const read = (path) => JSON.parse(readFileSync(join(artifacts, path), 'utf8'));
const apiTests = read('api-tests.json');
const webTests = read('web-tests.json');
const apiCoverage = read('api-coverage/coverage-summary.json').total;
const webCoverage = read('web-coverage/coverage-summary.json').total;
const bundle = read('bundle.json');
const e2e = read('e2e-tests.json');
const security = read('security-tests.json');
const integration = read('integration-tests.json');

const lighthouseDirectory = join(artifacts, 'lighthouse');
const lighthouseRuns = readdirSync(lighthouseDirectory)
  .filter((file) => file.endsWith('.report.json'))
  .map((file) => JSON.parse(readFileSync(join(lighthouseDirectory, file), 'utf8')));
if (!lighthouseRuns.length) throw new Error('No Lighthouse report evidence found');

function coverage(metric) {
  const covered = apiCoverage[metric].covered + webCoverage[metric].covered;
  const total = apiCoverage[metric].total + webCoverage[metric].total;
  if (!total) throw new Error(`Coverage evidence for ${metric} is empty`);
  return Number(((covered / total) * 100).toFixed(2));
}

function median(values) {
  const sorted = [...values].sort((left, right) => left - right);
  return sorted[Math.floor(sorted.length / 2)];
}

const required = (name, value) => {
  if (!Number.isFinite(value) || value < 0) throw new Error(`Invalid measured value: ${name}`);
  return value;
};
const sha = process.env.GITHUB_SHA;
if (!sha || !/^[a-f0-9]{7,64}$/i.test(sha)) throw new Error('GITHUB_SHA is required');

const report = {
  sha,
  branch: process.env.GITHUB_REF_NAME ?? 'unknown',
  environment: process.env.QUALITY_ENVIRONMENT ?? 'ci',
  unitTests: required('unitTests', apiTests.numPassedTests + webTests.numPassedTests),
  integrationTests: required('integrationTests', integration.integrationTests),
  contractTests: required('contractTests', integration.contractTests),
  e2eTests: required('e2eTests', e2e.numPassedTests),
  securityTests: required('securityTests', security.passed.length),
  coverageLines: coverage('lines'),
  coverageBranches: coverage('branches'),
  lighthousePerformance: Math.round(
    median(lighthouseRuns.map((run) => run.categories.performance.score * 100)),
  ),
  lighthouseAccessibility: Math.round(
    median(lighthouseRuns.map((run) => run.categories.accessibility.score * 100)),
  ),
  bundleKb: Math.ceil(bundle.entryGzipBytes / 1024),
  criticalVulnerabilities: required('criticalVulnerabilities', security.critical),
  highVulnerabilities: required('highVulnerabilities', security.high),
  generatedAt: new Date().toISOString(),
  evidence: {
    apiTestSuites: apiTests.numPassedTestSuites,
    webTestSuites: webTests.numPassedTestSuites,
    lighthouseRuns: lighthouseRuns.length,
    securityChecks: security.passed,
  },
};

writeFileSync(join(artifacts, 'quality-report.json'), `${JSON.stringify(report, null, 2)}\n`);
console.log(`Quality report created for ${sha} from measured artifacts.`);
