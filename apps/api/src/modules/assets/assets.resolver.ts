import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AssetModel, AssetUploadModel, CreateAssetUploadInput } from './assets.models';
import { AssetsService } from './assets.service';

@Resolver()
export class AssetsResolver {
  constructor(private readonly assets: AssetsService) {}

  @Mutation(() => AssetUploadModel)
  createAssetUpload(@Args('input') input: CreateAssetUploadInput): Promise<AssetUploadModel> {
    return this.assets.createUpload(input);
  }

  @Mutation(() => AssetModel)
  confirmAssetUpload(@Args('assetId') assetId: string): Promise<AssetModel> {
    return this.assets.confirm(assetId);
  }
}
