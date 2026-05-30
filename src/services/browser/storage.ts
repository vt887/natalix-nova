function getLastErrorMessage(): string | undefined {
  const err = chrome.runtime?.lastError;
  return err?.message;
}

export const storage = {
  get<T>(key: string): Promise<T | undefined> {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get(key, (items) => {
        const msg = getLastErrorMessage();
        if (msg) {
          reject(new Error(msg));
          return;
        }
        resolve(items[key] as T | undefined);
      });
    });
  },

  set<T>(key: string, value: T): Promise<void> {
    return new Promise((resolve, reject) => {
      chrome.storage.local.set({ [key]: value }, () => {
        const msg = getLastErrorMessage();
        if (msg) {
          reject(new Error(msg));
          return;
        }
        resolve();
      });
    });
  },

  remove(key: string): Promise<void> {
    return new Promise((resolve, reject) => {
      chrome.storage.local.remove(key, () => {
        const msg = getLastErrorMessage();
        if (msg) {
          reject(new Error(msg));
          return;
        }
        resolve();
      });
    });
  },

  watch<T>(key: string, cb: (newValue: T) => void): () => void {
    const listener = (
      changes: Record<string, chrome.storage.StorageChange>,
      areaName: string,
    ) => {
      if (areaName !== 'local') return;
      const change = changes[key];
      if (!change) return;
      cb(change.newValue as T);
    };

    chrome.storage.onChanged.addListener(listener);
    return () => chrome.storage.onChanged.removeListener(listener);
  },
};

