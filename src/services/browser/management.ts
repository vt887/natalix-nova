function getLastErrorMessage(): string | undefined {
  const err = chrome.runtime?.lastError;
  return err?.message;
}

export const management = {
  getAll(): Promise<chrome.management.ExtensionInfo[]> {
    return new Promise((resolve, reject) => {
      chrome.management.getAll((items) => {
        const msg = getLastErrorMessage();
        if (msg) {
          reject(new Error(msg));
          return;
        }
        resolve(items);
      });
    });
  },

  get(id: string): Promise<chrome.management.ExtensionInfo> {
    return new Promise((resolve, reject) => {
      chrome.management.get(id, (info) => {
        const msg = getLastErrorMessage();
        if (msg) {
          reject(new Error(msg));
          return;
        }
        resolve(info);
      });
    });
  },

  onEnabled(cb: (info: chrome.management.ExtensionInfo) => void): () => void {
    const listener = (info: chrome.management.ExtensionInfo) => cb(info);
    chrome.management.onEnabled.addListener(listener);
    return () => chrome.management.onEnabled.removeListener(listener);
  },

  onDisabled(cb: (info: chrome.management.ExtensionInfo) => void): () => void {
    const listener = (info: chrome.management.ExtensionInfo) => cb(info);
    chrome.management.onDisabled.addListener(listener);
    return () => chrome.management.onDisabled.removeListener(listener);
  },
};

