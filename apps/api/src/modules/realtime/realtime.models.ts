import { Field, GraphQLISODateTime, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class SystemEventModel {
  @Field() id!: string;
  @Field() type!: string;
  @Field() severity!: string;
  @Field() publicPayload!: string;
  @Field(() => GraphQLISODateTime) createdAt!: Date;
}
