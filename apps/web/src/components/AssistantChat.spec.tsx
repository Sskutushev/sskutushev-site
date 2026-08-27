// @vitest-environment jsdom

import '@testing-library/jest-dom/vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { askProfile } from '../lib/portfolio';
import { AssistantChat } from './AssistantChat';

vi.mock('../lib/portfolio', () => ({ askProfile: vi.fn() }));

const renderAssistant = (): void => {
  const client = new QueryClient({ defaultOptions: { mutations: { retry: false } } });
  render(
    <QueryClientProvider client={client}>
      <AssistantChat locale="EN" />
    </QueryClientProvider>,
  );
};

describe('AssistantChat', () => {
  beforeEach(() => vi.mocked(askProfile).mockReset());
  afterEach(cleanup);

  it('exposes an accessible question form and verified sources', async () => {
    vi.mocked(askProfile).mockResolvedValue({
      answer: 'Sergey is a fullstack product engineer.',
      generated: true,
      sources: [{ label: 'Profile / Position', excerpt: 'Backend 60%, frontend 40%.' }],
    });
    renderAssistant();

    const input = screen.getByRole('textbox', { name: 'Question' });
    fireEvent.change(input, { target: { value: 'What is his stack?' } });
    fireEvent.submit(input.closest('form')!);

    expect(await screen.findByText('Sergey is a fullstack product engineer.')).toBeVisible();
    expect(screen.getByText('SOURCES / 1')).toBeVisible();
    expect(askProfile).toHaveBeenCalledWith('What is his stack?', 'EN');
  });

  it('prevents empty requests and submits a suggested profile question', async () => {
    vi.mocked(askProfile).mockResolvedValue({ answer: 'Verified.', generated: false, sources: [] });
    renderAssistant();

    fireEvent.submit(screen.getByRole('textbox', { name: 'Question' }).closest('form')!);
    expect(askProfile).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: "What are Sergey's strengths?" }));
    await waitFor(() => expect(askProfile).toHaveBeenCalledOnce());
    expect(askProfile).toHaveBeenCalledWith("What are Sergey's strengths?", 'EN');
  });
});
