import { Module } from '@nestjs/common';
import { PortfolioModule } from '../portfolio/portfolio.module';
import { AssistantResolver } from './assistant.resolver';
import { AssistantService } from './assistant.service';
import { GeminiService } from './gemini.service';
import { SemanticService } from './semantic.service';

@Module({
  imports: [PortfolioModule],
  providers: [AssistantResolver, AssistantService, GeminiService, SemanticService],
})
export class AssistantModule {}
