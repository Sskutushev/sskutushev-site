import { Args, Int, Query, Resolver, Subscription } from '@nestjs/graphql';
import { SystemEventModel } from './realtime.models';
import { RealtimeService } from './realtime.service';

@Resolver()
export class RealtimeResolver {
  constructor(private readonly realtime: RealtimeService) {}

  @Query(() => [SystemEventModel])
  systemEvents(@Args('limit', { type: () => Int, defaultValue: 20 }) limit: number) {
    return this.realtime.recent(limit);
  }

  @Subscription(() => SystemEventModel, { resolve: (value: SystemEventModel) => value })
  systemEvent(): AsyncIterable<SystemEventModel> {
    return this.realtime.events();
  }
}
