import { Module } from '@nestjs/common';
import { PortfolioResolver } from './portfolio.resolver';
import { PortfolioService } from './portfolio.service';

@Module({ providers: [PortfolioResolver, PortfolioService], exports: [PortfolioService] })
export class PortfolioModule {}
