import { Module } from '@nestjs/common';
import { PortfolioModule } from '../portfolio/portfolio.module';
import { AssistantResolver } from './assistant.resolver';
import { AssistantService } from './assistant.service';
import { GeminiService } from './gemini.service';

@Module({
  imports: [PortfolioModule],
  providers: [AssistantResolver, AssistantService, GeminiService],
})
export class AssistantModule {}
