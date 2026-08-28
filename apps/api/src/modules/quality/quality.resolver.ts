import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ImportQualityRunInput, QualityRunModel } from './quality.models';
import { QualityService } from './quality.service';
import { UseGuards } from '@nestjs/common';
import { ManagementGuard } from '../../common/security/management.guard';

@Resolver()
export class QualityResolver {
  constructor(private readonly quality: QualityService) {}

  @Query(() => QualityRunModel, { nullable: true })
  latestQualityRun(): Promise<QualityRunModel | null> {
    return this.quality.latest();
  }

  @Mutation(() => QualityRunModel)
  @UseGuards(ManagementGuard)
  importQualityRun(@Args('input') input: ImportQualityRunInput): Promise<QualityRunModel> {
    return this.quality.import(input);
  }
}
