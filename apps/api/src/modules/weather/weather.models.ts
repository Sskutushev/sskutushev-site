import { Field, Float, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AmbientWeather {
  @Field() city!: string;
  @Field(() => Float) temperatureC!: number;
  @Field() condition!: string;
  @Field() observedAt!: Date;
  @Field() stale!: boolean;
}
