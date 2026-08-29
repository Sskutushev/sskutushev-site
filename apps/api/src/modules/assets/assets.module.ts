import { Module } from '@nestjs/common';
import { AssetsResolver } from './assets.resolver';
import { AssetsService } from './assets.service';
import { ManagementGuard } from '../../common/security/management.guard';
import { AssetsController } from './assets.controller';
@Module({
  controllers: [AssetsController],
  providers: [AssetsResolver, AssetsService, ManagementGuard],
})
export class AssetsModule {}
