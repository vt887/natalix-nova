import type { BackupPayload } from './backup';

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export type WeatherFetchMessage = {
  name: 'weather.fetch';
  payload: { lat: number; lon: number };
};

export type GeoFetchMessage = { name: 'geo.fetch' };

export type CalendarIsAuthorizedMessage = { name: 'calendar.isAuthorized' };
export type CalendarAuthorizeMessage = { name: 'calendar.authorize' };
export type CalendarGetEventsMessage = { name: 'calendar.getEvents' };

export type DriveFetchMessage = { name: 'drive.fetch' };
export type DriveAuthorizeMessage = { name: 'drive.authorize' };

export type GithubFetchMessage = { name: 'github.fetch' };

export type TodoistFetchMessage = { name: 'todoist.fetch' };
export type TodoistCompleteMessage = { name: 'todoist.complete'; payload: { taskId: string } };

export type NotionFetchMessage = { name: 'notion.fetch' };
export type StocksFetchMessage = { name: 'stocks.fetch' };

export type BackupExportMessage = { name: 'backup.export' };
export type BackupImportMessage = { name: 'backup.import'; payload: BackupPayload };

export type WorkspaceSaveMessage = { name: 'workspace.save'; payload: { name: string } };
export type WorkspaceRestoreMessage = { name: 'workspace.restore'; payload: { id: string } };
export type WorkspaceDeleteMessage = { name: 'workspace.delete'; payload: { id: string } };

export type SessionGetRecentMessage = { name: 'session.getRecent' };
export type SessionRestoreMessage = { name: 'session.restore'; payload: { sessionId: string } };

export type NotificationsClearMessage = { name: 'notifications.clear'; payload: { id: string } };
export type NotificationsClearAllMessage = { name: 'notifications.clearAll' };

export type SpeechStartMessage = { name: 'speech.start' };
export type SpeechStopMessage = { name: 'speech.stop' };
export type SpeechResultMessage = { name: 'speech.result'; payload: { transcript: string } };
export type SpeechErrorMessage = { name: 'speech.error'; payload: { error: string } };

export type AIChatMessage = {
  name: 'ai.chat';
  payload: { messages: ChatMessage[]; stream: false };
};
export type AISuggestMessage = { name: 'ai.suggest'; payload: { query: string } };

export type TabsGetRecentMessage = { name: 'tabs.getRecent'; payload?: { limit?: number } };

export type Message =
  | WeatherFetchMessage
  | GeoFetchMessage
  | CalendarIsAuthorizedMessage
  | CalendarAuthorizeMessage
  | CalendarGetEventsMessage
  | DriveFetchMessage
  | DriveAuthorizeMessage
  | GithubFetchMessage
  | TodoistFetchMessage
  | TodoistCompleteMessage
  | NotionFetchMessage
  | StocksFetchMessage
  | BackupExportMessage
  | BackupImportMessage
  | WorkspaceSaveMessage
  | WorkspaceRestoreMessage
  | WorkspaceDeleteMessage
  | SessionGetRecentMessage
  | SessionRestoreMessage
  | NotificationsClearMessage
  | NotificationsClearAllMessage
  | SpeechStartMessage
  | SpeechStopMessage
  | SpeechResultMessage
  | SpeechErrorMessage
  | AIChatMessage
  | AISuggestMessage
  | TabsGetRecentMessage;

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function hasName<T extends string>(value: unknown, name: T): value is { name: T } {
  return isObject(value) && value['name'] === name;
}

export function isWeatherFetchMessage(value: unknown): value is WeatherFetchMessage {
  if (!hasName(value, 'weather.fetch')) return false;
  const payload = (value as Record<string, unknown>)['payload'];
  return (
    isObject(payload) &&
    typeof payload['lat'] === 'number' &&
    typeof payload['lon'] === 'number'
  );
}

export function isGeoFetchMessage(value: unknown): value is GeoFetchMessage {
  return hasName(value, 'geo.fetch');
}

export function isCalendarIsAuthorizedMessage(
  value: unknown,
): value is CalendarIsAuthorizedMessage {
  return hasName(value, 'calendar.isAuthorized');
}

export function isCalendarAuthorizeMessage(value: unknown): value is CalendarAuthorizeMessage {
  return hasName(value, 'calendar.authorize');
}

export function isCalendarGetEventsMessage(value: unknown): value is CalendarGetEventsMessage {
  return hasName(value, 'calendar.getEvents');
}

export function isDriveFetchMessage(value: unknown): value is DriveFetchMessage {
  return hasName(value, 'drive.fetch');
}

export function isDriveAuthorizeMessage(value: unknown): value is DriveAuthorizeMessage {
  return hasName(value, 'drive.authorize');
}

export function isGithubFetchMessage(value: unknown): value is GithubFetchMessage {
  return hasName(value, 'github.fetch');
}

export function isTodoistFetchMessage(value: unknown): value is TodoistFetchMessage {
  return hasName(value, 'todoist.fetch');
}

export function isTodoistCompleteMessage(value: unknown): value is TodoistCompleteMessage {
  if (!hasName(value, 'todoist.complete')) return false;
  const payload = (value as Record<string, unknown>)['payload'];
  return isObject(payload) && typeof payload['taskId'] === 'string';
}

export function isNotionFetchMessage(value: unknown): value is NotionFetchMessage {
  return hasName(value, 'notion.fetch');
}

export function isStocksFetchMessage(value: unknown): value is StocksFetchMessage {
  return hasName(value, 'stocks.fetch');
}

export function isBackupExportMessage(value: unknown): value is BackupExportMessage {
  return hasName(value, 'backup.export');
}

export function isBackupImportMessage(value: unknown): value is BackupImportMessage {
  if (!hasName(value, 'backup.import')) return false;
  const payload = (value as Record<string, unknown>)['payload'];
  return isObject(payload) && (payload as Record<string, unknown>)['version'] === 2;
}

export function isWorkspaceSaveMessage(value: unknown): value is WorkspaceSaveMessage {
  if (!hasName(value, 'workspace.save')) return false;
  const payload = (value as Record<string, unknown>)['payload'];
  return isObject(payload) && typeof payload['name'] === 'string';
}

export function isWorkspaceRestoreMessage(value: unknown): value is WorkspaceRestoreMessage {
  if (!hasName(value, 'workspace.restore')) return false;
  const payload = (value as Record<string, unknown>)['payload'];
  return isObject(payload) && typeof payload['id'] === 'string';
}

export function isWorkspaceDeleteMessage(value: unknown): value is WorkspaceDeleteMessage {
  if (!hasName(value, 'workspace.delete')) return false;
  const payload = (value as Record<string, unknown>)['payload'];
  return isObject(payload) && typeof payload['id'] === 'string';
}

export function isSessionGetRecentMessage(value: unknown): value is SessionGetRecentMessage {
  return hasName(value, 'session.getRecent');
}

export function isSessionRestoreMessage(value: unknown): value is SessionRestoreMessage {
  if (!hasName(value, 'session.restore')) return false;
  const payload = (value as Record<string, unknown>)['payload'];
  return isObject(payload) && typeof payload['sessionId'] === 'string';
}

export function isNotificationsClearMessage(value: unknown): value is NotificationsClearMessage {
  if (!hasName(value, 'notifications.clear')) return false;
  const payload = (value as Record<string, unknown>)['payload'];
  return isObject(payload) && typeof payload['id'] === 'string';
}

export function isNotificationsClearAllMessage(
  value: unknown,
): value is NotificationsClearAllMessage {
  return hasName(value, 'notifications.clearAll');
}

export function isSpeechStartMessage(value: unknown): value is SpeechStartMessage {
  return hasName(value, 'speech.start');
}

export function isSpeechStopMessage(value: unknown): value is SpeechStopMessage {
  return hasName(value, 'speech.stop');
}

export function isSpeechResultMessage(value: unknown): value is SpeechResultMessage {
  if (!hasName(value, 'speech.result')) return false;
  const payload = (value as Record<string, unknown>)['payload'];
  return isObject(payload) && typeof payload['transcript'] === 'string';
}

export function isSpeechErrorMessage(value: unknown): value is SpeechErrorMessage {
  if (!hasName(value, 'speech.error')) return false;
  const payload = (value as Record<string, unknown>)['payload'];
  return isObject(payload) && typeof payload['error'] === 'string';
}

export function isAIChatMessage(value: unknown): value is AIChatMessage {
  if (!hasName(value, 'ai.chat')) return false;
  const payload = (value as Record<string, unknown>)['payload'];
  if (!isObject(payload)) return false;
  if (payload['stream'] !== false) return false;
  const msgs = payload['messages'];
  if (!Array.isArray(msgs)) return false;
  return msgs.every(
    (m) =>
      isObject(m) &&
      (m['role'] === 'system' || m['role'] === 'user' || m['role'] === 'assistant') &&
      typeof m['content'] === 'string',
  );
}

export function isAISuggestMessage(value: unknown): value is AISuggestMessage {
  if (!hasName(value, 'ai.suggest')) return false;
  const payload = (value as Record<string, unknown>)['payload'];
  return isObject(payload) && typeof payload['query'] === 'string';
}

export function isTabsGetRecentMessage(value: unknown): value is TabsGetRecentMessage {
  if (!hasName(value, 'tabs.getRecent')) return false;
  const payload = (value as Record<string, unknown>)['payload'];
  if (payload === undefined) return true;
  return isObject(payload) && (payload['limit'] === undefined || typeof payload['limit'] === 'number');
}

