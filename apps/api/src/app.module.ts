import { ApolloDriver, type ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'node:path';
import { CacheModule } from './cache/cache.module';
import { validateConfig } from './config';
import { PrismaModule } from './database/prisma.module';
import { HealthModule } from './modules/health/health.module';
import { AssetsModule } from './modules/assets/assets.module';
import { PortfolioModule } from './modules/portfolio/portfolio.module';
import { StorageModule } from './storage/storage.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate: validateConfig }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'schema.graphql'),
      sortSchema: true,
      playground: process.env.NODE_ENV !== 'production',
      introspection: process.env.NODE_ENV !== 'production',
      csrfPrevention: true,
    }),
    PrismaModule,
    CacheModule,
    StorageModule,
    PortfolioModule,
    AssetsModule,
    HealthModule,
  ],
})
export class AppModule {}
