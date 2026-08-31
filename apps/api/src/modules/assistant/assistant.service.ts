import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Locale } from '../portfolio/portfolio.models';
import { PortfolioService } from '../portfolio/portfolio.service';
import type { AssistantAnswerModel } from './assistant.models';
import { GeminiService } from './gemini.service';
import { judgementChunks } from './judgement';
import { isProfileRelated, type KnowledgeChunk } from './retrieval';
import { SemanticService } from './semantic.service';

@Injectable()
export class AssistantService {
  private requestWindow = { startedAt: Date.now(), count: 0 };

  constructor(
    private readonly portfolio: PortfolioService,
    private readonly gemini: GeminiService,
    private readonly semantic: SemanticService,
  ) {}

  async ask(question: string, locale: Locale): Promise<AssistantAnswerModel> {
    const normalized = question.trim();
    if (normalized.length < 2 || normalized.length > 500) {
      throw new BadRequestException('Question must contain between 2 and 500 characters');
    }
    this.consumeQuota();
    const portfolio = await this.portfolio.getPortfolio(locale);
    const evidence = await this.semantic.rank(normalized, this.toChunks(portfolio, locale), 4);
    const profileRelated = isProfileRelated(normalized);
    // A question about the profile with nothing retrieved has no grounding, so
    // the model is not asked: it would answer from its own priors, and the
    // answer would be about a person it has never read anything about.
    const grounded = !profileRelated || evidence.length > 0;
    const generated = grounded
      ? await this.gemini.answer(normalized, evidence, locale, profileRelated)
      : null;
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
    locale: Locale,
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
    // What was decided, refused and got wrong. Without these the questions the
    // interface actually offers have nothing to retrieve against.
    chunks.push(...judgementChunks(locale));
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
