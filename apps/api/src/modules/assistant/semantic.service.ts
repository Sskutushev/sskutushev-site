import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { retrieve, type KnowledgeChunk } from './retrieval';

type RankResponse = {
  matches: { caseStudyId: string; score: number }[];
  modelVersion: string;
};

@Injectable()
export class SemanticService {
  private readonly endpoint: string | undefined;

  constructor(config: ConfigService) {
    this.endpoint = config.get<string>('SEMANTIC_URL');
  }

  async rank(question: string, chunks: KnowledgeChunk[], limit: number): Promise<KnowledgeChunk[]> {
    if (!this.endpoint) return retrieve(question, chunks, limit);
    try {
      const response = await fetch(`${this.endpoint}/v1/rank`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          query: question,
          documents: chunks.map((chunk, index) => ({
            id: String(index),
            text: `${chunk.label} ${chunk.text}`,
          })),
          limit,
        }),
        signal: AbortSignal.timeout(800),
      });
      if (!response.ok) throw new Error(`Similarity service returned ${response.status}`);
      const ranked = (await response.json()) as RankResponse;
      if (!ranked.modelVersion || !Array.isArray(ranked.matches))
        throw new Error('Invalid rank contract');
      const selected = ranked.matches
        .map(({ caseStudyId }) => chunks[Number(caseStudyId)])
        .filter((chunk): chunk is KnowledgeChunk => chunk !== undefined);
      return selected.length ? selected : retrieve(question, chunks, limit);
    } catch {
      return retrieve(question, chunks, limit);
    }
  }
}
