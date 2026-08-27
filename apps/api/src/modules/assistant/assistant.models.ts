import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AssistantSourceModel {
  @Field()
  label!: string;

  @Field()
  excerpt!: string;
}

@ObjectType()
export class AssistantAnswerModel {
  @Field()
  answer!: string;

  @Field(() => [AssistantSourceModel])
  sources!: AssistantSourceModel[];

  @Field()
  generated!: boolean;
}
