function getLastErrorMessage(): string | undefined {
  const err = chrome.runtime?.lastError;
  return err?.message;
}

export const bookmarks = {
  getTree(): Promise<chrome.bookmarks.BookmarkTreeNode[]> {
    return new Promise((resolve, reject) => {
      chrome.bookmarks.getTree((nodes) => {
        const msg = getLastErrorMessage();
        if (msg) {
          reject(new Error(msg));
          return;
        }
        resolve(nodes);
      });
    });
  },

  search(
    query:
      | string
      | {
          query?: string;
          title?: string;
          url?: string;
        },
  ): Promise<chrome.bookmarks.BookmarkTreeNode[]> {
    return new Promise((resolve, reject) => {
      chrome.bookmarks.search(query, (nodes) => {
        const msg = getLastErrorMessage();
        if (msg) {
          reject(new Error(msg));
          return;
        }
        resolve(nodes);
      });
    });
  },
};
