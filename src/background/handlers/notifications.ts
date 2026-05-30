import type { NotificationsClearAllMessage, NotificationsClearMessage } from '../../types/messages';

export async function handleNotificationsClear(_message: NotificationsClearMessage): Promise<unknown> {
  return { error: 'not implemented' } as const;
}

export async function handleNotificationsClearAll(
  _message: NotificationsClearAllMessage,
): Promise<unknown> {
  return { error: 'not implemented' } as const;
}

