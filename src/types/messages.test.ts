import { describe, expect, it } from 'vitest';

import {
  isAIChatMessage,
  isAISuggestMessage,
  isBackupExportMessage,
  isBackupImportMessage,
  isCalendarAuthorizeMessage,
  isCalendarGetEventsMessage,
  isCalendarIsAuthorizedMessage,
  isDriveAuthorizeMessage,
  isDriveFetchMessage,
  isGeoFetchMessage,
  isGithubFetchMessage,
  isNotionFetchMessage,
  isNotificationsClearAllMessage,
  isNotificationsClearMessage,
  isSessionGetRecentMessage,
  isSessionRestoreMessage,
  isSpeechErrorMessage,
  isSpeechResultMessage,
  isSpeechStartMessage,
  isSpeechStopMessage,
  isStocksFetchMessage,
  isTabsGetRecentMessage,
  isTodoistCompleteMessage,
  isTodoistFetchMessage,
  isWeatherFetchMessage,
  isWorkspaceDeleteMessage,
  isWorkspaceRestoreMessage,
  isWorkspaceSaveMessage,
} from './messages';

describe('types/messages type guards', () => {
  it('accepts valid messages', () => {
    expect(isWeatherFetchMessage({ name: 'weather.fetch', payload: { lat: 1, lon: 2 } })).toBe(true);
    expect(isGeoFetchMessage({ name: 'geo.fetch' })).toBe(true);
    expect(isCalendarIsAuthorizedMessage({ name: 'calendar.isAuthorized' })).toBe(true);
    expect(isCalendarAuthorizeMessage({ name: 'calendar.authorize' })).toBe(true);
    expect(isCalendarGetEventsMessage({ name: 'calendar.getEvents' })).toBe(true);
    expect(isDriveFetchMessage({ name: 'drive.fetch' })).toBe(true);
    expect(isDriveAuthorizeMessage({ name: 'drive.authorize' })).toBe(true);
    expect(isGithubFetchMessage({ name: 'github.fetch' })).toBe(true);
    expect(isTodoistFetchMessage({ name: 'todoist.fetch' })).toBe(true);
    expect(isTodoistCompleteMessage({ name: 'todoist.complete', payload: { taskId: 't1' } })).toBe(
      true,
    );
    expect(isNotionFetchMessage({ name: 'notion.fetch' })).toBe(true);
    expect(isStocksFetchMessage({ name: 'stocks.fetch' })).toBe(true);
    expect(isBackupExportMessage({ name: 'backup.export' })).toBe(true);
    expect(
      isBackupImportMessage({
        name: 'backup.import',
        payload: { version: 2 } as unknown,
      }),
    ).toBe(true);
    expect(isWorkspaceSaveMessage({ name: 'workspace.save', payload: { name: 'w' } })).toBe(true);
    expect(isWorkspaceRestoreMessage({ name: 'workspace.restore', payload: { id: '1' } })).toBe(true);
    expect(isWorkspaceDeleteMessage({ name: 'workspace.delete', payload: { id: '1' } })).toBe(true);
    expect(isSessionGetRecentMessage({ name: 'session.getRecent' })).toBe(true);
    expect(isSessionRestoreMessage({ name: 'session.restore', payload: { sessionId: 's' } })).toBe(
      true,
    );
    expect(isNotificationsClearMessage({ name: 'notifications.clear', payload: { id: 'n' } })).toBe(
      true,
    );
    expect(isNotificationsClearAllMessage({ name: 'notifications.clearAll' })).toBe(true);
    expect(isSpeechStartMessage({ name: 'speech.start' })).toBe(true);
    expect(isSpeechStopMessage({ name: 'speech.stop' })).toBe(true);
    expect(isSpeechResultMessage({ name: 'speech.result', payload: { transcript: 'hi' } })).toBe(
      true,
    );
    expect(isSpeechErrorMessage({ name: 'speech.error', payload: { error: 'no' } })).toBe(true);
    expect(
      isAIChatMessage({
        name: 'ai.chat',
        payload: { stream: false, messages: [{ role: 'user', content: 'hi' }] },
      }),
    ).toBe(true);
    expect(isAISuggestMessage({ name: 'ai.suggest', payload: { query: 'q' } })).toBe(true);
    expect(isTabsGetRecentMessage({ name: 'tabs.getRecent' })).toBe(true);
    expect(isTabsGetRecentMessage({ name: 'tabs.getRecent', payload: { limit: 5 } })).toBe(true);
  });

  it('rejects invalid messages', () => {
    expect(isWeatherFetchMessage({ name: 'weather.fetch', payload: { lat: 'x', lon: 2 } })).toBe(
      false,
    );
    expect(isTodoistCompleteMessage({ name: 'todoist.complete', payload: {} })).toBe(false);
    expect(isAIChatMessage({ name: 'ai.chat', payload: { stream: true, messages: [] } })).toBe(false);
    expect(isTabsGetRecentMessage({ name: 'tabs.getRecent', payload: { limit: 'x' } })).toBe(false);
  });
});

