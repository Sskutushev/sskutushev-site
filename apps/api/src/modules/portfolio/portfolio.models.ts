import { Type } from 'class-transformer';
import { Field, InputType, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import {
  ArrayMaxSize,
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';

export enum Locale {
  RU = 'ru',
  EN = 'en',
}
registerEnumType(Locale, { name: 'Locale' });

@ObjectType()
export class ProfileModel {
  @Field() fullName!: string;
  @Field() headline!: string;
  @Field() summary!: string;
  @Field() location!: string;
  @Field() availability!: string;
  @Field(() => Int) yearsExperience!: number;
  @Field(() => Int) version!: number;
}

@ObjectType()
export class SkillModel {
  @Field() name!: string;
  @Field() category!: string;
}

@ObjectType()
export class ExperienceModel {
  @Field() company!: string;
  @Field() role!: string;
  @Field() period!: string;
  @Field() summary!: string;
  @Field(() => [String]) highlights!: string[];
}

@ObjectType()
export class CaseStudyModel {
  @Field() slug!: string;
  @Field() title!: string;
  @Field() problem!: string;
  @Field() approach!: string;
  @Field() result!: string;
  @Field(() => [String]) technologies!: string[];
}

@ObjectType()
export class SocialLinkModel {
  @Field() type!: string;
  @Field() url!: string;
}

@ObjectType()
export class PortfolioModel {
  @Field(() => ProfileModel) profile!: ProfileModel;
  @Field(() => [SkillModel]) skills!: SkillModel[];
  @Field(() => [ExperienceModel]) experience!: ExperienceModel[];
  @Field(() => [CaseStudyModel]) caseStudies!: CaseStudyModel[];
  @Field(() => [SocialLinkModel]) socialLinks!: SocialLinkModel[];
  @Field() stale!: boolean;
}

@InputType()
export class SocialLinkInput {
  @Field()
  @IsString()
  @MaxLength(40)
  type!: string;

  @Field()
  @Matches(/^(https:\/\/|mailto:)[^\s]+$/i, { message: 'Social link must use HTTPS or mailto' })
  @MaxLength(500)
  url!: string;
}

@InputType()
export class UpdateProfileInput {
  @Field(() => Int)
  @IsInt()
  @Min(1)
  expectedVersion!: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  fullName?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(180)
  headline?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(2_000)
  summary?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(160)
  location?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(240)
  availability?: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(80)
  yearsExperience?: number;

  @Field(() => [SocialLinkInput], { nullable: true })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(12)
  @ValidateNested({ each: true })
  @Type(() => SocialLinkInput)
  socialLinks?: SocialLinkInput[];
}

@ObjectType()
export class ManagedProfileModel extends ProfileModel {
  @Field()
  updatedAt!: Date;

  @Field(() => [SocialLinkModel])
  socialLinks!: SocialLinkModel[];
}
