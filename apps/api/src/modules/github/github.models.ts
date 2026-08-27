import { Field, GraphQLISODateTime, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class GithubRepositoryModel {
  @Field()
  name!: string;

  @Field()
  url!: string;

  @Field(() => Int)
  stars!: number;

  @Field(() => Int)
  forks!: number;

  @Field(() => Int)
  openIssues!: number;

  @Field(() => GraphQLISODateTime, { nullable: true })
  pushedAt!: Date | null;
}

@ObjectType()
export class GithubActivityModel {
  @Field()
  owner!: string;

  @Field(() => [GithubRepositoryModel])
  repositories!: GithubRepositoryModel[];

  @Field(() => GraphQLISODateTime)
  capturedAt!: Date;

  @Field()
  stale!: boolean;
}
