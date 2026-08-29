import { describe, expect, it, vi } from 'vitest';
import type { Response } from 'express';
import { AssetsController } from './assets.controller';
import type { AssetsService } from './assets.service';

describe('AssetsController', () => {
  it('streams the S3-backed resume as a PDF attachment', async () => {
    const assets = {
      resumeDownload: vi.fn().mockResolvedValue(new Uint8Array([1, 2, 3])),
    } as unknown as AssetsService;
    const type = vi.fn();
    const attachment = vi.fn();
    const send = vi.fn();
    const response = {
      type,
      attachment,
      send,
    } as unknown as Response;

    await new AssetsController(assets).resume(response);

    expect(type).toHaveBeenCalledWith('application/pdf');
    expect(attachment).toHaveBeenCalledWith('sergey-kutushev-resume.pdf');
    expect(send).toHaveBeenCalledWith(Buffer.from([1, 2, 3]));
  });
});
