import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
  Locale,
  ManagedProfileModel,
  PortfolioModel,
  UpdateProfileInput,
} from './portfolio.models';
import { PortfolioService } from './portfolio.service';
import { UseGuards } from '@nestjs/common';
import { ManagementGuard } from '../../common/security/management.guard';

@Resolver()
export class PortfolioResolver {
  constructor(private readonly portfolio: PortfolioService) {}

  @Query(() => PortfolioModel)
  portfolioData(@Args('locale', { type: () => Locale }) locale: Locale): Promise<PortfolioModel> {
    return this.portfolio.getPortfolio(locale);
  }

  @Mutation(() => ManagedProfileModel)
  @UseGuards(ManagementGuard)
  updateProfile(@Args('input') input: UpdateProfileInput): Promise<ManagedProfileModel> {
    return this.portfolio.updateProfile(input);
  }
}
