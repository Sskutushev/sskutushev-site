import { ForbiddenException } from '@nestjs/common';
import type { ConfigService } from '@nestjs/config';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { PrismaService } from '../../database/prisma.service';
import type { StorageService } from '../../storage/storage.service';
import { AssetsService } from './assets.service';

const checksum = 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=';

function createService(enabled = true) {
  const asset = {
    id: 'asset-1',
    status: 'PENDING',
    storageKey: 'portfolio/profile-1/file.pdf',
    contentType: 'application/pdf',
    checksum,
  };
  const prisma = {
    profile: { findUniqueOrThrow: vi.fn().mockResolvedValue({ id: 'profile-1' }) },
    asset: {
      create: vi.fn().mockResolvedValue(asset),
      findUnique: vi.fn().mockResolvedValue(asset),
      update: vi.fn().mockImplementation(({ data }) => Promise.resolve({ ...asset, ...data })),
    },
  };
  const storage = {
    presignUpload: vi.fn().mockResolvedValue('https://storage.example/upload'),
    download: vi.fn().mockResolvedValue(new Uint8Array([1, 2, 3])),
    inspect: vi.fn().mockResolvedValue({
      contentType: 'application/pdf',
      checksumSha256: checksum,
      sizeBytes: 42n,
    }),
  };
  const config = {
    get: vi.fn(() => enabled),
    getOrThrow: vi.fn(() => 10_485_760),
  };
  return {
    service: new AssetsService(
      config as unknown as ConfigService,
      prisma as unknown as PrismaService,
      storage as unknown as StorageService,
    ),
    prisma,
    storage,
  };
}

describe('AssetsService', () => {
  beforeEach(() => vi.clearAllMocks());

  it('fails closed before creating an upload', async () => {
    const { service, prisma } = createService(false);
    await expect(
      service.createUpload({
        fileName: 'resume.pdf',
        contentType: 'application/pdf',
        checksumSha256: checksum,
      }),
    ).rejects.toBeInstanceOf(ForbiddenException);
    expect(prisma.asset.create).not.toHaveBeenCalled();
  });

  it('returns a fresh signed URL for the fixed public resume object', async () => {
    const { service, storage } = createService();
    await expect(service.resumeDownload()).resolves.toEqual(new Uint8Array([1, 2, 3]));
    expect(storage.download).toHaveBeenCalledWith('public/sergey-kutushev-resume.pdf');
  });

  it('binds the requested checksum to both metadata and the signed upload', async () => {
    const { service, prisma, storage } = createService();
    await service.createUpload({
      fileName: 'resume.pdf',
      contentType: 'application/pdf',
      checksumSha256: checksum,
    });
    expect(prisma.asset.create).toHaveBeenCalledOnce();
    expect(storage.presignUpload).toHaveBeenCalledWith(
      expect.stringMatching(/^portfolio\/profile-1\/[\da-f-]+\.pdf$/),
      'application/pdf',
      checksum,
    );
  });

  it('marks a constraint mismatch as failed', async () => {
    const { service, prisma, storage } = createService();
    storage.inspect.mockResolvedValue({
      contentType: 'application/pdf',
      checksumSha256: checksum,
      sizeBytes: 10_485_761n,
    });
    await expect(service.confirm('asset-1')).rejects.toBeInstanceOf(ForbiddenException);
    expect(prisma.asset.update).toHaveBeenCalledWith({
      where: { id: 'asset-1' },
      data: { status: 'FAILED' },
    });
  });

  it('confirms a matching object and remains idempotent once ready', async () => {
    const { service, prisma, storage } = createService();
    await expect(service.confirm('asset-1')).resolves.toMatchObject({ status: 'READY' });
    expect(prisma.asset.update).toHaveBeenCalledWith({
      where: { id: 'asset-1' },
      data: { status: 'READY', sizeBytes: 42n },
    });

    prisma.asset.findUnique.mockResolvedValue({
      id: 'asset-1',
      status: 'READY',
      storageKey: 'portfolio/profile-1/file.pdf',
      contentType: 'application/pdf',
      checksum,
    });
    await service.confirm('asset-1');
    expect(storage.inspect).toHaveBeenCalledOnce();
  });
});
