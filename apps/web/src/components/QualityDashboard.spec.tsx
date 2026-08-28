// @vitest-environment jsdom

import '@testing-library/jest-dom/vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { fetchLatestQualityRun } from '../lib/portfolio';
import { QualityDashboard } from './QualityDashboard';

vi.mock('../lib/portfolio', () => ({ fetchLatestQualityRun: vi.fn() }));

describe('QualityDashboard', () => {
  afterEach(cleanup);

  it('renders only persisted measurements and their SHA', async () => {
    vi.mocked(fetchLatestQualityRun).mockResolvedValue({
      sha: 'abcdef1234567',
      branch: 'main',
      environment: 'ci',
      unitTests: 46,
      integrationTests: 0,
      contractTests: 0,
      e2eTests: 2,
      securityTests: 1,
      coverageLines: 64.2,
      coverageBranches: 71.3,
      lighthousePerformance: 96,
      lighthouseAccessibility: 100,
      bundleKb: 147,
      criticalVulnerabilities: 0,
      highVulnerabilities: 0,
      createdAt: '2026-08-28T10:00:00.000Z',
    });
    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    render(
      <QueryClientProvider client={client}>
        <QualityDashboard locale="EN" />
      </QueryClientProvider>,
    );
    expect(await screen.findByText('48')).toBeVisible();
    expect(screen.getByText('abcdef1 · main', { exact: false })).toBeVisible();
    expect(screen.getByText('100')).toBeVisible();
  });
});
