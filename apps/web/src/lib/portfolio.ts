import type {
  AskProfileQuery,
  GithubActivityQuery,
  LatestQualityRunQuery,
  PortfolioQuery,
  PortfolioQueryVariables,
} from '../graphql/graphql';

export type Locale = PortfolioQueryVariables['locale'];
export type Portfolio = PortfolioQuery['portfolioData'] & {
  weather: PortfolioQuery['ambientWeather'];
};
export type AssistantAnswer = AskProfileQuery['askProfile'];
export type GithubActivity = GithubActivityQuery['githubActivity'];
export type QualityRun = NonNullable<LatestQualityRunQuery['latestQualityRun']>;

/**
 * The page renders from the bundled fallback and replaces it when the query
 * answers, so the gateway is loaded on first call rather than at start-up.
 * The types above are erased at build time and cost nothing.
 */
const gateway = () => import('./portfolio-gateway');

export async function fetchPortfolio(locale: Locale): Promise<Portfolio> {
  return (await gateway()).fetchPortfolio(locale);
}

export async function askProfile(question: string, locale: Locale): Promise<AssistantAnswer> {
  return (await gateway()).askProfile(question, locale);
}

export async function fetchGithubActivity(): Promise<GithubActivity> {
  return (await gateway()).fetchGithubActivity();
}

export async function fetchLatestQualityRun(): Promise<QualityRun | null> {
  return (await gateway()).fetchLatestQualityRun();
}
