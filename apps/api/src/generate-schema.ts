import 'reflect-metadata';
import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { NestFactory } from '@nestjs/core';
import { GraphQLSchemaBuilderModule, GraphQLSchemaFactory } from '@nestjs/graphql';
import { lexicographicSortSchema, printSchema } from 'graphql';
import { AssistantResolver } from './modules/assistant/assistant.resolver';
import { AssetsResolver } from './modules/assets/assets.resolver';
import { GithubResolver } from './modules/github/github.resolver';
import { PortfolioResolver } from './modules/portfolio/portfolio.resolver';
import { QualityResolver } from './modules/quality/quality.resolver';
import { RealtimeResolver } from './modules/realtime/realtime.resolver';
import { WeatherResolver } from './modules/weather/weather.resolver';

async function generateSchema(): Promise<void> {
  const context = await NestFactory.createApplicationContext(GraphQLSchemaBuilderModule, {
    logger: false,
  });

  try {
    const factory = context.get(GraphQLSchemaFactory);
    const schema = await factory.create([
      AssistantResolver,
      AssetsResolver,
      GithubResolver,
      PortfolioResolver,
      QualityResolver,
      RealtimeResolver,
      WeatherResolver,
    ]);
    const output = `${printSchema(lexicographicSortSchema(schema))}\n`;
    await writeFile(resolve(process.cwd(), 'schema.graphql'), output, 'utf8');
  } finally {
    await context.close();
  }
}

void generateSchema();
