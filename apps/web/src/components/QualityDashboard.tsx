import { useQuery } from '@tanstack/react-query';
import { fetchLatestQualityRun, type Locale } from '../lib/portfolio';

export function QualityDashboard({ locale }: { locale: Locale }): React.JSX.Element {
  const { data, isPending, isError } = useQuery({
    queryKey: ['latest-quality-run'],
    queryFn: fetchLatestQualityRun,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
  return (
    <section className="quality-dashboard" aria-label="Measured delivery quality">
      <header>
        <div>
          <small>CI / MEASURED</small>
          <strong>{locale === 'RU' ? 'КАЧЕСТВО ПОСЛЕДНЕГО SHA' : 'LATEST SHA QUALITY'}</strong>
        </div>
        <span>{isPending ? 'LOADING' : isError ? 'OFFLINE' : data ? 'MEASURED' : 'NO RUN'}</span>
      </header>
      {data && (
        <>
          <dl>
            <div>
              <dt>TESTS</dt>
              <dd>{data.unitTests + data.integrationTests + data.contractTests + data.e2eTests}</dd>
            </div>
            <div>
              <dt>LINES</dt>
              <dd>{data.coverageLines.toFixed(1)}%</dd>
            </div>
            <div>
              <dt>A11Y</dt>
              <dd>{data.lighthouseAccessibility}</dd>
            </div>
            <div>
              <dt>PERF</dt>
              <dd>{data.lighthousePerformance}</dd>
            </div>
            <div>
              <dt>ENTRY</dt>
              <dd>{data.bundleKb} KB</dd>
            </div>
            <div>
              <dt>HIGH+</dt>
              <dd>{data.highVulnerabilities + data.criticalVulnerabilities}</dd>
            </div>
          </dl>
          <p>
            {data.sha.slice(0, 7)} · {data.branch} ·{' '}
            {new Date(data.createdAt).toLocaleString(locale === 'RU' ? 'ru-RU' : 'en-US')}
          </p>
        </>
      )}
      {isError && (
        <p>
          {locale === 'RU'
            ? 'Измерения временно недоступны.'
            : 'Measurements are temporarily unavailable.'}
        </p>
      )}
    </section>
  );
}
