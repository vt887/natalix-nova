import type { Message } from '../types/messages';
import { runtime } from '../services/browser/runtime';
import { registerAlarms } from './alarms';
import { handleAIChat, handleAISuggest } from './handlers/ai';
import { handleBackupExport, handleBackupImport } from './handlers/backup';
import {
  handleCalendarAuthorize,
  handleCalendarGetEvents,
  handleCalendarIsAuthorized,
} from './handlers/calendar';
import { handleDriveAuthorize, handleDriveFetch } from './handlers/drive';
import { handleGeoFetch } from './handlers/geo';
import { handleGithubFetch } from './handlers/github';
import { handleNotionFetch } from './handlers/notion';
import { handleNotificationsClear, handleNotificationsClearAll } from './handlers/notifications';
import { handleSessionGetRecent, handleSessionRestore } from './handlers/session';
import {
  handleSpeechError,
  handleSpeechResult,
  handleSpeechStart,
  handleSpeechStop,
} from './handlers/speech';
import { handleStocksFetch } from './handlers/stocks';
import { handleTabsGetRecent } from './handlers/tabs';
import { handleTodoistComplete, handleTodoistFetch } from './handlers/todoist';
import {
  handleWorkspaceDelete,
  handleWorkspaceRestore,
  handleWorkspaceSave,
} from './handlers/workspace';
import { handleWeatherFetch } from './handlers/weather';

type MessageResult = unknown;

declare const self: ServiceWorkerGlobalScope;

async function routeMessage(message: Message): Promise<MessageResult> {
  switch (message.name) {
    case 'weather.fetch':
      return await handleWeatherFetch(message);
    case 'geo.fetch':
      return await handleGeoFetch(message);
    case 'calendar.isAuthorized':
      return await handleCalendarIsAuthorized(message);
    case 'calendar.authorize':
      return await handleCalendarAuthorize(message);
    case 'calendar.getEvents':
      return await handleCalendarGetEvents(message);
    case 'drive.fetch':
      return await handleDriveFetch(message);
    case 'drive.authorize':
      return await handleDriveAuthorize(message);
    case 'github.fetch':
      return await handleGithubFetch(message);
    case 'todoist.fetch':
      return await handleTodoistFetch(message);
    case 'todoist.complete':
      return await handleTodoistComplete(message);
    case 'notion.fetch':
      return await handleNotionFetch(message);
    case 'stocks.fetch':
      return await handleStocksFetch(message);
    case 'backup.export':
      return await handleBackupExport(message);
    case 'backup.import':
      return await handleBackupImport(message);
    case 'workspace.save':
      return await handleWorkspaceSave(message);
    case 'workspace.restore':
      return await handleWorkspaceRestore(message);
    case 'workspace.delete':
      return await handleWorkspaceDelete(message);
    case 'session.getRecent':
      return await handleSessionGetRecent(message);
    case 'session.restore':
      return await handleSessionRestore(message);
    case 'notifications.clear':
      return await handleNotificationsClear(message);
    case 'notifications.clearAll':
      return await handleNotificationsClearAll(message);
    case 'speech.start':
      return await handleSpeechStart(message);
    case 'speech.stop':
      return await handleSpeechStop(message);
    case 'speech.result':
      return await handleSpeechResult(message);
    case 'speech.error':
      return await handleSpeechError(message);
    case 'ai.chat':
      return await handleAIChat(message);
    case 'ai.suggest':
      return await handleAISuggest(message);
    case 'tabs.getRecent':
      return await handleTabsGetRecent(message);
    default: {
      const _exhaustive: never = message;
      return _exhaustive;
    }
  }
}

function isMessageLike(value: unknown): value is { name: unknown } {
  return typeof value === 'object' && value !== null && 'name' in value;
}

self.addEventListener('install', () => {
  // Required by PR-01: activate immediately.
  self.skipWaiting();
});

self.addEventListener('activate', (event: ExtendableEvent) => {
  event.waitUntil(self.clients.claim());
});

registerAlarms();

runtime.onMessage((message: unknown, _sender, sendResponse) => {
  if (!isMessageLike(message) || typeof message.name !== 'string') {
    sendResponse({ error: 'invalid_message' });
    return false;
  }

  void (async () => {
    try {
      const result = await routeMessage(message as Message);
      sendResponse(result);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      sendResponse({ error: msg });
    }
  })();

  // Keep the message channel open for async response.
  return true;
});
