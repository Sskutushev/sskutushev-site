/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
  '\n  query Portfolio($locale: Locale!) {\n    portfolioData(locale: $locale) {\n      profile {\n        fullName\n        headline\n        summary\n        location\n        availability\n        yearsExperience\n      }\n      skills {\n        name\n        category\n      }\n      experience {\n        company\n        role\n        period\n        summary\n        highlights\n      }\n      caseStudies {\n        slug\n        title\n        problem\n        approach\n        result\n        technologies\n      }\n      socialLinks {\n        type\n        url\n      }\n      stale\n    }\n    ambientWeather {\n      city\n      temperatureC\n      condition\n      observedAt\n      stale\n    }\n  }\n': typeof types.PortfolioDocument;
  '\n  query AskProfile($question: String!, $locale: Locale!) {\n    askProfile(question: $question, locale: $locale) {\n      answer\n      generated\n      sources {\n        label\n        excerpt\n      }\n    }\n  }\n': typeof types.AskProfileDocument;
  '\n  query GithubActivity {\n    githubActivity {\n      owner\n      capturedAt\n      stale\n      repositories {\n        name\n        url\n        stars\n        forks\n        openIssues\n        pushedAt\n      }\n    }\n  }\n': typeof types.GithubActivityDocument;
  '\n  query LatestQualityRun {\n    latestQualityRun {\n      sha\n      branch\n      environment\n      unitTests\n      integrationTests\n      contractTests\n      e2eTests\n      securityTests\n      coverageLines\n      coverageBranches\n      lighthousePerformance\n      lighthouseAccessibility\n      bundleKb\n      criticalVulnerabilities\n      highVulnerabilities\n      createdAt\n    }\n  }\n': typeof types.LatestQualityRunDocument;
};
const documents: Documents = {
  '\n  query Portfolio($locale: Locale!) {\n    portfolioData(locale: $locale) {\n      profile {\n        fullName\n        headline\n        summary\n        location\n        availability\n        yearsExperience\n      }\n      skills {\n        name\n        category\n      }\n      experience {\n        company\n        role\n        period\n        summary\n        highlights\n      }\n      caseStudies {\n        slug\n        title\n        problem\n        approach\n        result\n        technologies\n      }\n      socialLinks {\n        type\n        url\n      }\n      stale\n    }\n    ambientWeather {\n      city\n      temperatureC\n      condition\n      observedAt\n      stale\n    }\n  }\n':
    types.PortfolioDocument,
  '\n  query AskProfile($question: String!, $locale: Locale!) {\n    askProfile(question: $question, locale: $locale) {\n      answer\n      generated\n      sources {\n        label\n        excerpt\n      }\n    }\n  }\n':
    types.AskProfileDocument,
  '\n  query GithubActivity {\n    githubActivity {\n      owner\n      capturedAt\n      stale\n      repositories {\n        name\n        url\n        stars\n        forks\n        openIssues\n        pushedAt\n      }\n    }\n  }\n':
    types.GithubActivityDocument,
  '\n  query LatestQualityRun {\n    latestQualityRun {\n      sha\n      branch\n      environment\n      unitTests\n      integrationTests\n      contractTests\n      e2eTests\n      securityTests\n      coverageLines\n      coverageBranches\n      lighthousePerformance\n      lighthouseAccessibility\n      bundleKb\n      criticalVulnerabilities\n      highVulnerabilities\n      createdAt\n    }\n  }\n':
    types.LatestQualityRunDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query Portfolio($locale: Locale!) {\n    portfolioData(locale: $locale) {\n      profile {\n        fullName\n        headline\n        summary\n        location\n        availability\n        yearsExperience\n      }\n      skills {\n        name\n        category\n      }\n      experience {\n        company\n        role\n        period\n        summary\n        highlights\n      }\n      caseStudies {\n        slug\n        title\n        problem\n        approach\n        result\n        technologies\n      }\n      socialLinks {\n        type\n        url\n      }\n      stale\n    }\n    ambientWeather {\n      city\n      temperatureC\n      condition\n      observedAt\n      stale\n    }\n  }\n',
): (typeof documents)['\n  query Portfolio($locale: Locale!) {\n    portfolioData(locale: $locale) {\n      profile {\n        fullName\n        headline\n        summary\n        location\n        availability\n        yearsExperience\n      }\n      skills {\n        name\n        category\n      }\n      experience {\n        company\n        role\n        period\n        summary\n        highlights\n      }\n      caseStudies {\n        slug\n        title\n        problem\n        approach\n        result\n        technologies\n      }\n      socialLinks {\n        type\n        url\n      }\n      stale\n    }\n    ambientWeather {\n      city\n      temperatureC\n      condition\n      observedAt\n      stale\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query AskProfile($question: String!, $locale: Locale!) {\n    askProfile(question: $question, locale: $locale) {\n      answer\n      generated\n      sources {\n        label\n        excerpt\n      }\n    }\n  }\n',
): (typeof documents)['\n  query AskProfile($question: String!, $locale: Locale!) {\n    askProfile(question: $question, locale: $locale) {\n      answer\n      generated\n      sources {\n        label\n        excerpt\n      }\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query GithubActivity {\n    githubActivity {\n      owner\n      capturedAt\n      stale\n      repositories {\n        name\n        url\n        stars\n        forks\n        openIssues\n        pushedAt\n      }\n    }\n  }\n',
): (typeof documents)['\n  query GithubActivity {\n    githubActivity {\n      owner\n      capturedAt\n      stale\n      repositories {\n        name\n        url\n        stars\n        forks\n        openIssues\n        pushedAt\n      }\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query LatestQualityRun {\n    latestQualityRun {\n      sha\n      branch\n      environment\n      unitTests\n      integrationTests\n      contractTests\n      e2eTests\n      securityTests\n      coverageLines\n      coverageBranches\n      lighthousePerformance\n      lighthouseAccessibility\n      bundleKb\n      criticalVulnerabilities\n      highVulnerabilities\n      createdAt\n    }\n  }\n',
): (typeof documents)['\n  query LatestQualityRun {\n    latestQualityRun {\n      sha\n      branch\n      environment\n      unitTests\n      integrationTests\n      contractTests\n      e2eTests\n      securityTests\n      coverageLines\n      coverageBranches\n      lighthousePerformance\n      lighthouseAccessibility\n      bundleKb\n      criticalVulnerabilities\n      highVulnerabilities\n      createdAt\n    }\n  }\n'];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> =
  TDocumentNode extends DocumentNode<infer TType, any> ? TType : never;
