/**
 * Every runtime dependency on GraphQL lives here — the client, the generated
 * document map and the graphql package itself. Nothing in it is needed to
 * paint the first screen, so `portfolio.ts` reaches it through a dynamic
 * import and it never enters the entry chunk.
 */
import { GraphQLClient } from 'graphql-request';
import { graphql } from '../graphql';
import type { AssistantAnswer, GithubActivity, Locale, Portfolio, QualityRun } from './portfolio';

const endpoint = import.meta.env.VITE_GRAPHQL_URL || '/graphql';

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
