/* eslint-disable */
/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> =
  T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Locale = 'EN' | 'RU';

export type PortfolioQueryVariables = Exact<{
  locale: Locale;
}>;

export type PortfolioQuery = {
  portfolioData: {
    stale: boolean;
    profile: {
      fullName: string;
      headline: string;
      summary: string;
      location: string;
      availability: string;
      yearsExperience: number;
    };
    skills: Array<{ name: string; category: string }>;
    experience: Array<{
      company: string;
      role: string;
      period: string;
      summary: string;
      highlights: Array<string>;
    }>;
    caseStudies: Array<{
      slug: string;
      title: string;
      problem: string;
      approach: string;
      result: string;
      technologies: Array<string>;
    }>;
    socialLinks: Array<{ type: string; url: string }>;
  };
  ambientWeather: {
    city: string;
    temperatureC: number;
    condition: string;
    observedAt: string;
    stale: boolean;
  } | null;
};

export type AskProfileQueryVariables = Exact<{
  question: string;
  locale: Locale;
}>;

export type AskProfileQuery = {
  askProfile: {
    answer: string;
    generated: boolean;
    sources: Array<{ label: string; excerpt: string }>;
  };
};

export type GithubActivityQueryVariables = Exact<{ [key: string]: never }>;

export type GithubActivityQuery = {
  githubActivity: {
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
};

export type LatestQualityRunQueryVariables = Exact<{ [key: string]: never }>;

export type LatestQualityRunQuery = {
  latestQualityRun: {
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
  } | null;
};

export const PortfolioDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'Portfolio' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'locale' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'Locale' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'portfolioData' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'locale' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'locale' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'profile' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'fullName' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'headline' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'summary' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'location' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'availability' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'yearsExperience' } },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'skills' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'category' } },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'experience' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'company' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'role' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'period' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'summary' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'highlights' } },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'caseStudies' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'title' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'problem' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'approach' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'result' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'technologies' } },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'socialLinks' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'url' } },
                    ],
                  },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'stale' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'ambientWeather' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'city' } },
                { kind: 'Field', name: { kind: 'Name', value: 'temperatureC' } },
                { kind: 'Field', name: { kind: 'Name', value: 'condition' } },
                { kind: 'Field', name: { kind: 'Name', value: 'observedAt' } },
                { kind: 'Field', name: { kind: 'Name', value: 'stale' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<PortfolioQuery, PortfolioQueryVariables>;
export const AskProfileDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'AskProfile' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'question' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'locale' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'Locale' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'askProfile' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'question' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'question' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'locale' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'locale' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'answer' } },
                { kind: 'Field', name: { kind: 'Name', value: 'generated' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'sources' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'label' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'excerpt' } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<AskProfileQuery, AskProfileQueryVariables>;
export const GithubActivityDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GithubActivity' },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'githubActivity' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'owner' } },
                { kind: 'Field', name: { kind: 'Name', value: 'capturedAt' } },
                { kind: 'Field', name: { kind: 'Name', value: 'stale' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'repositories' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'url' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'stars' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'forks' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'openIssues' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'pushedAt' } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GithubActivityQuery, GithubActivityQueryVariables>;
export const LatestQualityRunDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'LatestQualityRun' },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'latestQualityRun' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'sha' } },
                { kind: 'Field', name: { kind: 'Name', value: 'branch' } },
                { kind: 'Field', name: { kind: 'Name', value: 'environment' } },
                { kind: 'Field', name: { kind: 'Name', value: 'unitTests' } },
                { kind: 'Field', name: { kind: 'Name', value: 'integrationTests' } },
                { kind: 'Field', name: { kind: 'Name', value: 'contractTests' } },
                { kind: 'Field', name: { kind: 'Name', value: 'e2eTests' } },
                { kind: 'Field', name: { kind: 'Name', value: 'securityTests' } },
                { kind: 'Field', name: { kind: 'Name', value: 'coverageLines' } },
                { kind: 'Field', name: { kind: 'Name', value: 'coverageBranches' } },
                { kind: 'Field', name: { kind: 'Name', value: 'lighthousePerformance' } },
                { kind: 'Field', name: { kind: 'Name', value: 'lighthouseAccessibility' } },
                { kind: 'Field', name: { kind: 'Name', value: 'bundleKb' } },
                { kind: 'Field', name: { kind: 'Name', value: 'criticalVulnerabilities' } },
                { kind: 'Field', name: { kind: 'Name', value: 'highVulnerabilities' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<LatestQualityRunQuery, LatestQualityRunQueryVariables>;
