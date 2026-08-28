import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AssetModel, AssetUploadModel, CreateAssetUploadInput } from './assets.models';
import { AssetsService } from './assets.service';
import { UseGuards } from '@nestjs/common';
import { ManagementGuard } from '../../common/security/management.guard';

@Resolver()
export class AssetsResolver {
  constructor(private readonly assets: AssetsService) {}

  @Mutation(() => AssetUploadModel)
  @UseGuards(ManagementGuard)
  createAssetUpload(@Args('input') input: CreateAssetUploadInput): Promise<AssetUploadModel> {
    return this.assets.createUpload(input);
  }

  @Mutation(() => AssetModel)
  @UseGuards(ManagementGuard)
  confirmAssetUpload(@Args('assetId') assetId: string): Promise<AssetModel> {
    return this.assets.confirm(assetId);
  }
}
