import { Module } from '@nestjs/common';
import { AssetsResolver } from './assets.resolver';
import { AssetsService } from './assets.service';
@Module({ providers: [AssetsResolver, AssetsService] })
export class AssetsModule {}
