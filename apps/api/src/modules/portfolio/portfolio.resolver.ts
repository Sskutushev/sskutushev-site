import { Args, Query, Resolver } from '@nestjs/graphql';
import { Locale, PortfolioModel } from './portfolio.models';
import { PortfolioService } from './portfolio.service';

@Resolver()
export class PortfolioResolver {
  constructor(private readonly portfolio: PortfolioService) {}

  @Query(() => PortfolioModel)
  portfolioData(@Args('locale', { type: () => Locale }) locale: Locale): Promise<PortfolioModel> {
    return this.portfolio.getPortfolio(locale);
  }
}
