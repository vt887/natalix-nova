function getLastErrorMessage(): string | undefined {
  const err = chrome.runtime?.lastError;
  return err?.message;
}

export const identity = {
  getAuthToken(details: chrome.identity.TokenDetails): Promise<string> {
    return new Promise((resolve, reject) => {
      chrome.identity.getAuthToken(details, (result) => {
        const msg = getLastErrorMessage();
        if (msg) {
          reject(new Error(msg));
          return;
        }
        const token =
          typeof result === 'string'
            ? result
            : (result as { token?: string } | undefined)?.token;
        if (!token) {
          reject(new Error('No auth token returned'));
          return;
        }
        resolve(token);
      });
    });
  },

  removeCachedToken(token: string): Promise<void> {
    return new Promise((resolve, reject) => {
      chrome.identity.removeCachedAuthToken({ token }, () => {
        const msg = getLastErrorMessage();
        if (msg) {
          reject(new Error(msg));
          return;
        }
        resolve();
      });
    });
  },
};
