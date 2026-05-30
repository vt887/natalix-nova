import type { GithubFetchMessage } from '../../types/messages';

export async function handleGithubFetch(_message: GithubFetchMessage): Promise<unknown> {
  return { error: 'not implemented' } as const;
}

