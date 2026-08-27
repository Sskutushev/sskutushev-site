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
