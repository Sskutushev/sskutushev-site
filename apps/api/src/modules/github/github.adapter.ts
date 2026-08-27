import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export type GithubRepository = {
  name: string;
  url: string;
  stars: number;
  forks: number;
  openIssues: number;
  pushedAt: Date | null;
};

type GithubRepositoryResponse = {
  name: string;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  pushed_at: string | null;
  fork: boolean;
};

@Injectable()
export class GithubAdapter {
  constructor(private readonly config: ConfigService) {}

  async repositories(owner: string): Promise<GithubRepository[]> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);
    const token = this.config.get<string>('GITHUB_TOKEN');
    try {
      const response = await fetch(
        `https://api.github.com/users/${encodeURIComponent(owner)}/repos?per_page=12&sort=pushed`,
        {
          signal: controller.signal,
          headers: {
            Accept: 'application/vnd.github+json',
            'X-GitHub-Api-Version': '2022-11-28',
            'User-Agent': 'sskutushev-portfolio',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        },
      );
      if (!response.ok) throw new Error(`GitHub API returned ${response.status}`);
      const repositories = (await response.json()) as GithubRepositoryResponse[];
      return repositories
        .filter((repository) => !repository.fork)
        .slice(0, 6)
        .map((repository) => ({
          name: repository.name,
          url: repository.html_url,
          stars: repository.stargazers_count,
          forks: repository.forks_count,
          openIssues: repository.open_issues_count,
          pushedAt: repository.pushed_at ? new Date(repository.pushed_at) : null,
        }));
    } finally {
      clearTimeout(timeout);
    }
  }
}
