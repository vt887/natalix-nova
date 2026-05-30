import type { NotionFetchMessage } from '../../types/messages';

export async function handleNotionFetch(_message: NotionFetchMessage): Promise<unknown> {
  return { error: 'not implemented' } as const;
}

