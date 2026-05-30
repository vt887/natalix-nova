function getLastErrorMessage(): string | undefined {
  const err = chrome.runtime?.lastError;
  return err?.message;
}

export const runtime = {
  onMessage(
    cb: (
      message: unknown,
      sender: chrome.runtime.MessageSender,
      sendResponse: (response?: unknown) => void,
    ) => boolean | void,
  ): () => void {
    const listener = (
      message: unknown,
      sender: chrome.runtime.MessageSender,
      sendResponse: (response?: unknown) => void,
    ) => cb(message, sender, sendResponse);
    chrome.runtime.onMessage.addListener(listener);
    return () => chrome.runtime.onMessage.removeListener(listener);
  },

  sendMessage<TResponse = unknown>(message: unknown): Promise<TResponse> {
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage(message, (response) => {
        const msg = getLastErrorMessage();
        if (msg) {
          reject(new Error(msg));
          return;
        }
        resolve(response as TResponse);
      });
    });
  },
};

