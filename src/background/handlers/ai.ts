import type { AIChatMessage, AISuggestMessage } from '../../types/messages';

export async function handleAIChat(_message: AIChatMessage): Promise<unknown> {
  return { error: 'not implemented' } as const;
}

export async function handleAISuggest(_message: AISuggestMessage): Promise<unknown> {
  return { error: 'not implemented' } as const;
}

