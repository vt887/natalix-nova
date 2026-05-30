function getLastErrorMessage(): string | undefined {
  const err = chrome.runtime?.lastError;
  return err?.message;
}

export const alarms = {
  create(name: string, alarmInfo: chrome.alarms.AlarmCreateInfo): Promise<void> {
    return new Promise((resolve, reject) => {
      chrome.alarms.create(name, alarmInfo);
      const msg = getLastErrorMessage();
      if (msg) {
        reject(new Error(msg));
        return;
      }
      resolve();
    });
  },

  clear(name: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      chrome.alarms.clear(name, (wasCleared) => {
        const msg = getLastErrorMessage();
        if (msg) {
          reject(new Error(msg));
          return;
        }
        resolve(wasCleared);
      });
    });
  },

  onAlarm(cb: (alarm: chrome.alarms.Alarm) => void): () => void {
    const listener = (alarm: chrome.alarms.Alarm) => cb(alarm);
    chrome.alarms.onAlarm.addListener(listener);
    return () => chrome.alarms.onAlarm.removeListener(listener);
  },
};

