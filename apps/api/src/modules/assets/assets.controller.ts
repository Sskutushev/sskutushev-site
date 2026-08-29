import { Controller, Get, Header, Res } from '@nestjs/common';
import type { Response } from 'express';
import { AssetsService } from './assets.service';

@Controller('assets')
export class AssetsController {
  constructor(private readonly assets: AssetsService) {}

  @Get('resume')
  @Header('Cache-Control', 'public, max-age=3600')
  async resume(@Res() response: Response): Promise<void> {
    const body = await this.assets.resumeDownload();
    response.type('application/pdf');
    response.attachment('sergey-kutushev-resume.pdf');
    response.send(Buffer.from(body));
  }
}
