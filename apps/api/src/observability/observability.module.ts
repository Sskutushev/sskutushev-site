import { Global, Module } from '@nestjs/common';
import { MetricsController } from './metrics.controller';
import { MetricsService } from './metrics.service';
import { VitalsController } from './vitals.controller';

@Global()
@Module({
  controllers: [MetricsController, VitalsController],
  providers: [MetricsService],
  exports: [MetricsService],
})
export class ObservabilityModule {}
