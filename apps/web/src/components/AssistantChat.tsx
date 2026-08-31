import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { askProfile, type AssistantAnswer, type Locale } from '../lib/portfolio';

const suggestions = {
  RU: [
    'В чём сильные стороны Сергея?',
    'Какой у него backend-стек?',
    'Что он делал в Refty?',
    'Какой уровень английского?',
  ],
  EN: [
    "What are Sergey's strengths?",
    'What is his backend stack?',
    'What did he build at Refty?',
    'What is his English level?',
  ],
};

export function AssistantChat({ locale }: { locale: Locale }): React.JSX.Element {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState<AssistantAnswer | null>(null);
  const mutation = useMutation({
    mutationFn: (value: string) => askProfile(value, locale),
    onSuccess: setAnswer,
  });

  const submit = (value: string): void => {
    const normalized = value.trim();
    if (normalized.length < 2 || mutation.isPending) return;
    setQuestion(normalized);
    mutation.mutate(normalized);
  };

  return (
    <section className="assistant" aria-label="Profile AI assistant">
      <div className="assistant__status t-meta-sm">
        <i /> GEMINI + GROUNDED PROFILE RAG
      </div>
      <p className="assistant__lead t-small text-secondary">
        {locale === 'RU'
          ? 'Спросите о подтверждённом опыте, стеке и инженерном подходе.'
          : 'Ask about verified experience, stack and engineering approach.'}
      </p>
      <div className="assistant__suggestions">
        {suggestions[locale].map((suggestion) => (
          <button key={suggestion} onClick={() => submit(suggestion)}>
            {suggestion}
          </button>
        ))}
      </div>
      <form
        className="assistant__form"
        onSubmit={(event) => {
          event.preventDefault();
          submit(question);
        }}
      >
        <input
          maxLength={500}
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          placeholder={locale === 'RU' ? 'Спросить о Сергее…' : 'Ask about Sergey…'}
          aria-label="Question"
        />
        <button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? '···' : '↑'}
        </button>
      </form>
      {mutation.isError && (
        <p className="assistant__error t-small">
          {locale === 'RU'
            ? 'API пока недоступен. Запустите backend или повторите позже.'
            : 'API is unavailable. Start the backend or try again later.'}
        </p>
      )}
      {answer && (
        <div className="assistant__answer t-small">
          <small>
            {answer.generated
              ? locale === 'RU'
                ? 'ОТВЕТ AI · ПОДТВЕРЖДЁННЫЕ ИСТОЧНИКИ'
                : 'AI RESPONSE · VERIFIED PROFILE SOURCES'
              : locale === 'RU'
                ? 'ПРОВЕРЕННЫЕ ФАКТЫ · РЕЗЕРВНЫЙ РЕЖИМ'
                : 'VERIFIED FACTS · FALLBACK MODE'}
          </small>
          <p>{answer.answer}</p>
          <details>
            <summary>SOURCES / {answer.sources.length}</summary>
            {answer.sources.map((source) => (
              <article key={source.label}>
                <strong>{source.label}</strong>
                <p>{source.excerpt}</p>
              </article>
            ))}
          </details>
        </div>
      )}
    </section>
  );
}
