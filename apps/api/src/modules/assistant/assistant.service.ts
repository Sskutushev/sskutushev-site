import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Locale } from '../portfolio/portfolio.models';
import { PortfolioService } from '../portfolio/portfolio.service';
import type { AssistantAnswerModel } from './assistant.models';
import { GeminiService } from './gemini.service';
import { isProfileRelated, retrieve, type KnowledgeChunk } from './retrieval';

@Injectable()
export class AssistantService {
  private requestWindow = { startedAt: Date.now(), count: 0 };

  constructor(
    private readonly portfolio: PortfolioService,
    private readonly gemini: GeminiService,
  ) {}

  async ask(question: string, locale: Locale): Promise<AssistantAnswerModel> {
    const normalized = question.trim();
    if (normalized.length < 2 || normalized.length > 500) {
      throw new BadRequestException('Question must contain between 2 and 500 characters');
    }
    this.consumeQuota();
    const portfolio = await this.portfolio.getPortfolio(locale);
    const evidence = retrieve(normalized, this.toChunks(portfolio), 4);
    const profileRelated = isProfileRelated(normalized);
    const generated = await this.gemini.answer(normalized, evidence, locale, profileRelated);
    return {
      answer: generated ?? this.extractiveAnswer(evidence, locale),
      sources: profileRelated
        ? evidence.map(({ label, text }) => ({ label, excerpt: text.slice(0, 220) }))
        : [],
      generated: generated !== null,
    };
  }

  private consumeQuota(): void {
    const now = Date.now();
    if (now - this.requestWindow.startedAt > 60_000)
      this.requestWindow = { startedAt: now, count: 0 };
    this.requestWindow.count += 1;
    if (this.requestWindow.count > 30)
      throw new HttpException('Assistant is temporarily busy', HttpStatus.TOO_MANY_REQUESTS);
  }

  private toChunks(
    portfolio: Awaited<ReturnType<PortfolioService['getPortfolio']>>,
  ): KnowledgeChunk[] {
    const chunks: KnowledgeChunk[] = [
      {
        label: 'Profile / Position',
        text: `${portfolio.profile.headline}. ${portfolio.profile.summary}`,
      },
      {
        label: 'Profile / Engineering range',
        text: 'Fullstack profile: approximately 60% backend and 40% frontend. Strong practical DevOps, application security, data engineering, observability, testing and production rollout experience.',
      },
      { label: 'Profile / English', text: 'English level: B1. Русский: родной.' },
      { label: 'Profile / Stack', text: portfolio.skills.map(({ name }) => name).join(', ') },
    ];
    for (const item of portfolio.experience) {
      chunks.push({
        label: `Experience / ${item.company}`,
        text: `${item.role}. ${item.period}. ${item.summary} ${item.highlights.join(' ')}`,
      });
    }
    for (const item of portfolio.caseStudies) {
      chunks.push({
        label: `Case / ${item.title}`,
        text: `${item.problem} ${item.approach} ${item.result}. ${item.technologies.join(', ')}`,
      });
    }
    return chunks;
  }

  private extractiveAnswer(evidence: KnowledgeChunk[], locale: Locale): string {
    const facts = evidence
      .slice(0, 2)
      .map(({ text }) => text)
      .join(' ');
    return locale === Locale.RU
      ? `По подтверждённым данным: ${facts}`
      : `According to the verified profile: ${facts}`;
  }
}
