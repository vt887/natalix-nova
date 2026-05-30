function getLastErrorMessage(): string | undefined {
  const err = chrome.runtime?.lastError;
  return err?.message;
}

export const notifications = {
  create(
    notificationId: string | undefined,
    options: chrome.notifications.NotificationCreateOptions,
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const cb = (id: string) => {
        const msg = getLastErrorMessage();
        if (msg) {
          reject(new Error(msg));
          return;
        }
        resolve(id);
      };

      if (notificationId) {
        chrome.notifications.create(notificationId, options, cb);
      } else {
        chrome.notifications.create(options, cb);
      }
    });
  },

  clear(notificationId: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      chrome.notifications.clear(notificationId, (wasCleared) => {
        const msg = getLastErrorMessage();
        if (msg) {
          reject(new Error(msg));
          return;
        }
        resolve(wasCleared);
      });
    });
  },
};
