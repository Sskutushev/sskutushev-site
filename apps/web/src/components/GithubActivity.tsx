import { useQuery } from '@tanstack/react-query';
import { ArrowUpRight, CircleDot, GitFork, Star } from 'lucide-react';
import { fetchGithubActivity, type Locale } from '../lib/portfolio';

export function GithubActivity({ locale }: { locale: Locale }): React.JSX.Element {
  const { data, isPending, isError } = useQuery({
    queryKey: ['github-activity'],
    queryFn: fetchGithubActivity,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
  const stale = data ? data.stale : false;
  const repositories = data ? data.repositories : [];

  return (
    <section className="github-activity" aria-label="GitHub activity">
      <header>
        <div>
          <small>GITHUB / LIVE SNAPSHOT</small>
          <strong>{locale === 'RU' ? 'ПУБЛИЧНАЯ АКТИВНОСТЬ' : 'PUBLIC ACTIVITY'}</strong>
        </div>
        <span className={stale ? 'is-stale' : ''}>
          {isPending ? 'SYNCING' : isError ? 'OFFLINE' : stale ? 'STALE' : 'LIVE'}
        </span>
      </header>
      {repositories.map((repository) => (
        <a href={repository.url} target="_blank" rel="noreferrer" key={repository.name}>
          <strong>{repository.name}</strong>
          <span>
            <Star aria-hidden size={13} strokeWidth={1.5} />
            {repository.stars}
            <GitFork aria-hidden size={13} strokeWidth={1.5} />
            {repository.forks}
            <CircleDot aria-hidden size={13} strokeWidth={1.5} />
            {repository.openIssues}
          </span>
          <ArrowUpRight aria-hidden size={16} strokeWidth={1.5} />
        </a>
      ))}
      {isError && (
        <p>
          {locale === 'RU'
            ? 'GitHub API не ответил — основной профиль остаётся доступен.'
            : 'GitHub API did not respond; the core profile remains available.'}
        </p>
      )}
    </section>
  );
}
