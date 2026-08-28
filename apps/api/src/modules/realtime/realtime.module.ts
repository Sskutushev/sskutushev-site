import { Global, Module } from '@nestjs/common';
import { RealtimeResolver } from './realtime.resolver';
import { RealtimeService } from './realtime.service';

@Global()
@Module({ providers: [RealtimeResolver, RealtimeService], exports: [RealtimeService] })
export class RealtimeModule {}
