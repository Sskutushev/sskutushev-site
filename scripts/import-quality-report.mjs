import { readFileSync } from 'node:fs';

const endpoint = process.env.QUALITY_IMPORT_URL;
const token = process.env.QUALITY_IMPORT_TOKEN;
if (!endpoint || !token)
  throw new Error('QUALITY_IMPORT_URL and QUALITY_IMPORT_TOKEN are required');

const report = JSON.parse(readFileSync('artifacts/quality-report.json', 'utf8'));
const fields = [
  'sha',
  'branch',
  'environment',
  'unitTests',
  'integrationTests',
  'contractTests',
  'e2eTests',
  'securityTests',
  'coverageLines',
  'coverageBranches',
  'lighthousePerformance',
  'lighthouseAccessibility',
  'bundleKb',
  'criticalVulnerabilities',
  'highVulnerabilities',
];
const input = Object.fromEntries(fields.map((field) => [field, report[field]]));
const response = await fetch(endpoint, {
  method: 'POST',
  headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' },
  body: JSON.stringify({
    query: `mutation ImportQuality($input: ImportQualityRunInput!) {
      importQualityRun(input: $input) { sha createdAt }
    }`,
    variables: { input },
  }),
});
const payload = await response.json();
if (!response.ok || payload.errors?.length) {
  throw new Error(`Quality import failed: ${JSON.stringify(payload.errors ?? payload)}`);
}
console.log(`Imported measured quality run ${payload.data.importQualityRun.sha}.`);
