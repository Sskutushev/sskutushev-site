import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../../database/prisma.service';
import { StorageService } from '../../storage/storage.service';
import type { AssetModel, AssetUploadModel, CreateAssetUploadInput } from './assets.models';

@Injectable()
export class AssetsService {
  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
    private readonly storage: StorageService,
  ) {}

  async createUpload(input: CreateAssetUploadInput): Promise<AssetUploadModel> {
    this.assertMutationsEnabled();
    const profile = await this.prisma.profile.findUniqueOrThrow({
      where: { slug: 'sergey-kutushev' },
      select: { id: true },
    });
    const extension =
      input.fileName
        .split('.')
        .at(-1)
        ?.replace(/[^a-zA-Z0-9]/g, '')
        .toLowerCase() ?? 'bin';
    const storageKey = `portfolio/${profile.id}/${randomUUID()}.${extension}`;
    const asset = await this.prisma.asset.create({
      data: {
        profileId: profile.id,
        type: 'PORTFOLIO',
        storageKey,
        contentType: input.contentType,
      },
    });
    const uploadUrl = await this.storage.presignUpload(storageKey, input.contentType);
    return { assetId: asset.id, uploadUrl, expiresAt: new Date(Date.now() + 300_000) };
  }

  async confirm(assetId: string): Promise<AssetModel> {
    this.assertMutationsEnabled();
    const asset = await this.prisma.asset.findUnique({ where: { id: assetId } });
    if (!asset) throw new NotFoundException('Asset not found');
    if (asset.status === 'READY')
      return { id: asset.id, status: asset.status, contentType: asset.contentType };
    const object = await this.storage.inspect(asset.storageKey);
    if (object.contentType !== asset.contentType)
      throw new ForbiddenException('Uploaded object type does not match the request');
    const ready = await this.prisma.asset.update({
      where: { id: asset.id },
      data: { status: 'READY', sizeBytes: object.sizeBytes },
    });
    return { id: ready.id, status: ready.status, contentType: ready.contentType };
  }

  private assertMutationsEnabled(): void {
    if (this.config.get<string>('ENABLE_MUTATIONS') !== 'true')
      throw new ForbiddenException('Mutations are disabled in this environment');
  }
}
