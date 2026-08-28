import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsIn, IsString, Matches, MaxLength } from 'class-validator';

const allowedTypes = ['image/avif', 'image/jpeg', 'image/png', 'application/pdf'] as const;

@InputType()
export class CreateAssetUploadInput {
  @Field()
  @IsString()
  @MaxLength(120)
  fileName!: string;

  @Field()
  @IsIn(allowedTypes)
  contentType!: string;

  @Field()
  @Matches(/^[A-Za-z0-9+/]{43}=$/, { message: 'checksumSha256 must be base64 SHA-256' })
  checksumSha256!: string;
}

@ObjectType()
export class AssetUploadModel {
  @Field() assetId!: string;
  @Field() uploadUrl!: string;
  @Field() expiresAt!: Date;
}

@ObjectType()
export class AssetModel {
  @Field() id!: string;
  @Field() status!: string;
  @Field() contentType!: string;
}
