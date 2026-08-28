import { GraphQLClient, gql } from 'graphql-request';

const endpoint = import.meta.env.VITE_GRAPHQL_URL ?? 'http://localhost:4000/graphql';

export type Locale = 'RU' | 'EN';
export interface Portfolio {
  profile: {
    fullName: string;
    headline: string;
    summary: string;
    location: string;
    availability: string;
    yearsExperience: number;
  };
  skills: { name: string; category: string }[];
  experience: {
    company: string;
    role: string;
    period: string;
    summary: string;
    highlights: string[];
  }[];
  caseStudies: {
    slug: string;
    title: string;
    problem: string;
    approach: string;
    result: string;
    technologies: string[];
  }[];
  socialLinks: { type: string; url: string }[];
  stale: boolean;
}

const query = gql`
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
  }
`;

export async function fetchPortfolio(locale: Locale): Promise<Portfolio> {
  const client = new GraphQLClient(endpoint);
  const response = await client.request<{ portfolioData: Portfolio }>(query, { locale });
  return response.portfolioData;
}

export type AssistantAnswer = {
  answer: string;
  generated: boolean;
  sources: Array<{ label: string; excerpt: string }>;
};

export async function askProfile(question: string, locale: Locale): Promise<AssistantAnswer> {
  const client = new GraphQLClient(endpoint);
  const data = await client.request<{ askProfile: AssistantAnswer }>(
    `query AskProfile($question: String!, $locale: Locale!) {
      askProfile(question: $question, locale: $locale) {
        answer
        generated
        sources { label excerpt }
      }
    }`,
    { question, locale },
  );
  return data.askProfile;
}

export type GithubActivity = {
  owner: string;
  capturedAt: string;
  stale: boolean;
  repositories: Array<{
    name: string;
    url: string;
    stars: number;
    forks: number;
    openIssues: number;
    pushedAt: string | null;
  }>;
};

export async function fetchGithubActivity(): Promise<GithubActivity> {
  const client = new GraphQLClient(endpoint);
  const data = await client.request<{ githubActivity: GithubActivity }>(gql`
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
  return data.githubActivity;
}

export type QualityRun = {
  sha: string;
  branch: string;
  environment: string;
  unitTests: number;
  integrationTests: number;
  contractTests: number;
  e2eTests: number;
  securityTests: number;
  coverageLines: number;
  coverageBranches: number;
  lighthousePerformance: number;
  lighthouseAccessibility: number;
  bundleKb: number;
  criticalVulnerabilities: number;
  highVulnerabilities: number;
  createdAt: string;
};

export async function fetchLatestQualityRun(): Promise<QualityRun | null> {
  const client = new GraphQLClient(endpoint);
  const data = await client.request<{ latestQualityRun: QualityRun | null }>(gql`
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
  return data.latestQualityRun;
}
