import { GraphQLClient } from 'graphql-request';
import { graphql } from '../graphql';
import type {
  AskProfileQuery,
  GithubActivityQuery,
  LatestQualityRunQuery,
  PortfolioQuery,
  PortfolioQueryVariables,
} from '../graphql/graphql';

const endpoint = import.meta.env.VITE_GRAPHQL_URL || '/graphql';

export type Locale = PortfolioQueryVariables['locale'];
export type Portfolio = PortfolioQuery['portfolioData'] & {
  weather: PortfolioQuery['ambientWeather'];
};

const portfolioQuery = graphql(`
  query Portfolio($locale: Locale!) {
    portfolioData(locale: $locale) {
      profile {
        fullName
        headline
        summary
        location
        availability
        yearsExperience
      }
      skills {
        name
        category
      }
      experience {
        company
        role
        period
        summary
        highlights
      }
      caseStudies {
        slug
        title
        problem
        approach
        result
        technologies
      }
      socialLinks {
        type
        url
      }
      stale
    }
    ambientWeather {
      city
      temperatureC
      condition
      observedAt
      stale
    }
  }
`);

export async function fetchPortfolio(locale: Locale): Promise<Portfolio> {
  const client = new GraphQLClient(endpoint);
  const response = await client.request(portfolioQuery, { locale });
  return { ...response.portfolioData, weather: response.ambientWeather };
}

export type AssistantAnswer = AskProfileQuery['askProfile'];

const askProfileQuery = graphql(`
  query AskProfile($question: String!, $locale: Locale!) {
    askProfile(question: $question, locale: $locale) {
      answer
      generated
      sources {
        label
        excerpt
      }
    }
  }
`);

export async function askProfile(question: string, locale: Locale): Promise<AssistantAnswer> {
  const client = new GraphQLClient(endpoint);
  const data = await client.request(askProfileQuery, { question, locale });
  return data.askProfile;
}

export type GithubActivity = GithubActivityQuery['githubActivity'];

const githubActivityQuery = graphql(`
  query GithubActivity {
    githubActivity {
      owner
      capturedAt
      stale
      repositories {
        name
        url
        stars
        forks
        openIssues
        pushedAt
      }
    }
  }
`);

export async function fetchGithubActivity(): Promise<GithubActivity> {
  const client = new GraphQLClient(endpoint);
  const data = await client.request(githubActivityQuery);
  return data.githubActivity;
}

export type QualityRun = NonNullable<LatestQualityRunQuery['latestQualityRun']>;

const latestQualityRunQuery = graphql(`
  query LatestQualityRun {
    latestQualityRun {
      sha
      branch
      environment
      unitTests
      integrationTests
      contractTests
      e2eTests
      securityTests
      coverageLines
      coverageBranches
      lighthousePerformance
      lighthouseAccessibility
      bundleKb
      criticalVulnerabilities
      highVulnerabilities
      createdAt
    }
  }
`);

export async function fetchLatestQualityRun(): Promise<QualityRun | null> {
  const client = new GraphQLClient(endpoint);
  const data = await client.request(latestQualityRunQuery);
  return data.latestQualityRun;
}
