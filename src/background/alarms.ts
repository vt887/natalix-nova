import { alarms } from '../services/browser/alarms';

export const ALARM_NAMES = {
  AUTO_BACKUP_DAILY: 'backup.auto_daily',
} as const;

export type AlarmName = (typeof ALARM_NAMES)[keyof typeof ALARM_NAMES];

export function registerAlarms(): void {
  alarms.onAlarm((alarm) => {
    void dispatchAlarm(alarm.name);
  });
}

async function dispatchAlarm(name: string): Promise<void> {
  switch (name) {
    case ALARM_NAMES.AUTO_BACKUP_DAILY:
      // PR-01: handler implemented in later PR.
      return;
    default:
      return;
  }
}
