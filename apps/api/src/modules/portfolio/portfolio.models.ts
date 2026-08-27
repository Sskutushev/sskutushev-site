import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';

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
}

@ObjectType()
export class SkillModel {
  @Field() name!: string;
  @Field() category!: string;
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
  @Field(() => [CaseStudyModel]) caseStudies!: CaseStudyModel[];
  @Field(() => [SocialLinkModel]) socialLinks!: SocialLinkModel[];
  @Field() stale!: boolean;
}
