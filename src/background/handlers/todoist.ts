import type { TodoistCompleteMessage, TodoistFetchMessage } from '../../types/messages';

export async function handleTodoistFetch(_message: TodoistFetchMessage): Promise<unknown> {
  return { error: 'not implemented' } as const;
}

export async function handleTodoistComplete(_message: TodoistCompleteMessage): Promise<unknown> {
  return { error: 'not implemented' } as const;
}

