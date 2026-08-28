import { Module } from '@nestjs/common';
import { QualityResolver } from './quality.resolver';
import { QualityService } from './quality.service';
import { ManagementGuard } from '../../common/security/management.guard';

@Module({ providers: [QualityResolver, QualityService, ManagementGuard] })
export class QualityModule {}
