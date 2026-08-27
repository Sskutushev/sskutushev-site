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

export function isProfileRelated(question: string): boolean {
  return /(серг|serg|кутуш|kutush|стек|stack|опыт|experience|уме|skill|навык|работ|work|англий|english|backend|frontend|fullstack|devops|security|безопас|данн|data|проект|project|refty|уров|level|резюме|resume)/iu.test(
    question,
  );
}
