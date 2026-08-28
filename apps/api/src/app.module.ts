import { ApolloDriver, type ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'node:path';
import { CacheModule } from './cache/cache.module';
import { validateConfig } from './config';
import { PrismaModule } from './database/prisma.module';
import { HealthModule } from './modules/health/health.module';
import { GithubModule } from './modules/github/github.module';
import { AssetsModule } from './modules/assets/assets.module';
import { AssistantModule } from './modules/assistant/assistant.module';
import { PortfolioModule } from './modules/portfolio/portfolio.module';
import { StorageModule } from './storage/storage.module';
import { operationLimitsRule } from './common/graphql/operation-limits.rule';
import { QualityModule } from './modules/quality/quality.module';
import { RealtimeModule } from './modules/realtime/realtime.module';
import { ObservabilityModule } from './observability/observability.module';
import { WeatherModule } from './modules/weather/weather.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate: validateConfig }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile:
        process.env.NODE_ENV === 'production' ? true : join(process.cwd(), 'schema.graphql'),
      sortSchema: true,
      playground: process.env.NODE_ENV !== 'production',
      introspection: process.env.NODE_ENV !== 'production',
      csrfPrevention: true,
      validationRules: [operationLimitsRule({ maxDepth: 10, maxFields: 200 })],
      subscriptions: { 'graphql-ws': true },
    }),
    PrismaModule,
    CacheModule,
    StorageModule,
    PortfolioModule,
    AssetsModule,
    AssistantModule,
    GithubModule,
    HealthModule,
    QualityModule,
    RealtimeModule,
    ObservabilityModule,
    WeatherModule,
  ],
})
export class AppModule {}
