import type { SessionGetRecentMessage, SessionRestoreMessage } from '../../types/messages';

export async function handleSessionGetRecent(_message: SessionGetRecentMessage): Promise<unknown> {
  return { error: 'not implemented' } as const;
}

export async function handleSessionRestore(_message: SessionRestoreMessage): Promise<unknown> {
  return { error: 'not implemented' } as const;
}

