export type KnowledgeChunk = { label: string; text: string };

const words = (value: string): string[] =>
  value
    .toLocaleLowerCase()
    .match(/[\p{L}\p{N}+#.]{2,}/gu)
    ?.filter((word) => !['что', 'как', 'the', 'and', 'with', 'для', 'про', 'это'].includes(word)) ??
  [];

export function retrieve(question: string, chunks: KnowledgeChunk[], limit = 4): KnowledgeChunk[] {
  const query = new Set(words(question));
  return chunks
    .map((chunk, index) => {
      const textWords = words(`${chunk.label} ${chunk.text}`);
      const matches = textWords.reduce((score, word) => score + (query.has(word) ? 1 : 0), 0);
      return { chunk, index, score: matches / Math.max(Math.sqrt(textWords.length), 1) };
    })
    .sort((left, right) => right.score - left.score || left.index - right.index)
    .slice(0, limit)
    .map(({ chunk }) => chunk);
}

/**
 * Whether a question is about this profile at all.
 *
 * The second alternation is the vocabulary of judgement — decisions, refusals,
 * mistakes, proof. Those questions are the ones the interface now offers, and
 * without them here the assistant treated its own suggestions as off-topic.
 */
export function isProfileRelated(question: string): boolean {
  return (
    /(серг|serg|кутуш|kutush|стек|stack|опыт|experience|уме|skill|навык|работ|work|англий|english|backend|frontend|fullstack|devops|security|безопас|данн|data|проект|project|refty|уров|level|резюме|resume)/iu.test(
      question,
    ) ||
    /(решени|выбра|ошиб|отказ|доказ|скучн|инцидент|слаб|риск|decision|choose|chose|wrong|mistake|refus|prove|boring|incident|weak|risk|trade)/iu.test(
      question,
    )
  );
}
