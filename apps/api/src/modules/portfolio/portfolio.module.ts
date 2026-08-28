import { Module } from '@nestjs/common';
import { PortfolioResolver } from './portfolio.resolver';
import { PortfolioService } from './portfolio.service';
import { ManagementGuard } from '../../common/security/management.guard';

@Module({
  providers: [PortfolioResolver, PortfolioService, ManagementGuard],
  exports: [PortfolioService],
})
export class PortfolioModule {}
