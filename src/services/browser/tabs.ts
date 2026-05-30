function getLastErrorMessage(): string | undefined {
  const err = chrome.runtime?.lastError;
  return err?.message;
}

export const tabs = {
  query(queryInfo: chrome.tabs.QueryInfo): Promise<chrome.tabs.Tab[]> {
    return new Promise((resolve, reject) => {
      chrome.tabs.query(queryInfo, (result) => {
        const msg = getLastErrorMessage();
        if (msg) {
          reject(new Error(msg));
          return;
        }
        resolve(result);
      });
    });
  },

  getCurrent(): Promise<chrome.tabs.Tab | undefined> {
    return new Promise((resolve, reject) => {
      chrome.tabs.getCurrent((tab) => {
        const msg = getLastErrorMessage();
        if (msg) {
          reject(new Error(msg));
          return;
        }
        resolve(tab ?? undefined);
      });
    });
  },

  async getRecent(limit = 10): Promise<chrome.tabs.Tab[]> {
    const all = await tabs.query({ currentWindow: true });
    const sorted = [...all].sort((a, b) => {
      const aTs = a.lastAccessed ?? 0;
      const bTs = b.lastAccessed ?? 0;
      return bTs - aTs;
    });
    return sorted.slice(0, limit);
  },
};

