import { Field, Float, GraphQLISODateTime, InputType, Int, ObjectType } from '@nestjs/graphql';
import { IsInt, IsNumber, IsString, Matches, Max, MaxLength, Min } from 'class-validator';

@InputType()
export class ImportQualityRunInput {
  @Field() @Matches(/^[a-f0-9]{7,64}$/i) sha!: string;
  @Field() @IsString() @MaxLength(120) branch!: string;
  @Field() @IsString() @MaxLength(40) environment!: string;
  @Field(() => Int) @IsInt() @Min(0) unitTests!: number;
  @Field(() => Int) @IsInt() @Min(0) integrationTests!: number;
  @Field(() => Int) @IsInt() @Min(0) contractTests!: number;
  @Field(() => Int) @IsInt() @Min(0) e2eTests!: number;
  @Field(() => Int) @IsInt() @Min(0) securityTests!: number;
  @Field(() => Float) @IsNumber() @Min(0) @Max(100) coverageLines!: number;
  @Field(() => Float) @IsNumber() @Min(0) @Max(100) coverageBranches!: number;
  @Field(() => Int) @IsInt() @Min(0) @Max(100) lighthousePerformance!: number;
  @Field(() => Int) @IsInt() @Min(0) @Max(100) lighthouseAccessibility!: number;
  @Field(() => Int) @IsInt() @Min(0) bundleKb!: number;
  @Field(() => Int) @IsInt() @Min(0) criticalVulnerabilities!: number;
  @Field(() => Int) @IsInt() @Min(0) highVulnerabilities!: number;
}

@ObjectType()
export class QualityRunModel {
  @Field() sha!: string;
  @Field() branch!: string;
  @Field() environment!: string;
  @Field(() => Int) unitTests!: number;
  @Field(() => Int) integrationTests!: number;
  @Field(() => Int) contractTests!: number;
  @Field(() => Int) e2eTests!: number;
  @Field(() => Int) securityTests!: number;
  @Field(() => Float) coverageLines!: number;
  @Field(() => Float) coverageBranches!: number;
  @Field(() => Int) lighthousePerformance!: number;
  @Field(() => Int) lighthouseAccessibility!: number;
  @Field(() => Int) bundleKb!: number;
  @Field(() => Int) criticalVulnerabilities!: number;
  @Field(() => Int) highVulnerabilities!: number;
  @Field(() => GraphQLISODateTime) createdAt!: Date;
}
