# PR-09 — Bookmarks + Notifications

## Scope

Bookmarks panel and notifications panel via toolbar.

---

## Bookmarks Panel (F-12)

### Tasks

#### 1. BookmarksPanel (`src/features/bookmarks/BookmarksPanel.tsx`)
- Slide-in panel (full height) from left toolbar
- Search input at top — filters bookmarks by title or URL
- Tree view: folder hierarchy collapsible
- Bookmark item: favicon + title + URL
- Click item: navigate to URL
- `data-testid="bookmarks-panel"`, `data-testid="bookmarks-search"`

#### 2. BookmarkTree (`src/features/bookmarks/BookmarkTree.tsx`)
- Recursive component for `chrome.bookmarks.BookmarkTreeNode`
- Folders: collapsible, chevron icon
- Bookmarks: favicon + title, click navigates
- Keyboard: ↑↓ navigate, Enter open, → expand folder

#### 3. useBookmarks hook (`src/features/bookmarks/useBookmarks.ts`)
- Fetch tree: `chrome.bookmarks.getTree()`
- Search: `chrome.bookmarks.search({ query })` — debounced 200ms
- Returns flat list when searching, tree when not

---

## Notifications Panel (F-08)

### Tasks

#### 1. NotificationsPanel (`src/features/notifications/NotificationsPanel.tsx`)
- Slide-in panel showing Chrome notifications list
- Each item: icon + title + message + time ago
- "Clear all" button
- Unread badge on toolbar button (`indicator-global`)
- `data-testid="notifications-panel"`

#### 2. SW handler (`src/background/handlers/notifications.ts`)
- `chrome.notifications.onClicked` → clear notification + navigate to relevant URL if known
- Track all created notifications in `chrome.storage.local` key `notifications.history`
- `chrome.storage.onChanged` propagates to UI reactively
- Message: `{ name: 'notifications.clear', payload: { id } }`
- Message: `{ name: 'notifications.clearAll' }`

#### 3. Notifications store slice (`src/store/slices/notifications.ts`)
- `items: NotificationItem[]`
- `unreadCount: number`
- Subscribe to `chrome.storage.onChanged` for `notifications.history`

#### 4. Global unread badge
- Badge count = `notifications.unreadCount`
- Displayed on toolbar Notifications button
- Resets to 0 when panel is opened

## Acceptance Criteria

**Bookmarks:**
- [ ] Panel opens from toolbar button
- [ ] Full bookmark tree renders (folders + items)
- [ ] Folders expand/collapse on click
- [ ] Search input filters results in real-time
- [ ] Clicking a bookmark navigates to the URL
- [ ] Favicons load for bookmark items

**Notifications:**
- [ ] Notification panel shows Chrome notifications history
- [ ] Unread badge count shown on toolbar button
- [ ] Badge resets to 0 when panel opened
- [ ] "Clear all" removes all items
- [ ] Individual notification clear works

## Out of Scope

- Creating bookmarks from the new tab page
- Editing bookmarks
- Drag-and-drop bookmark reordering
- Push notifications from external services

## Technical Notes

- `chrome.bookmarks.getTree()` returns the full tree including "Bookmarks bar" and "Other bookmarks" as top-level nodes — skip the invisible root node
- Notification history max 50 items (FIFO, drop oldest)
- Favicon for bookmarks: same `_favicon/?pageUrl=` pattern as app grid

## Test Requirements

- [ ] Unit: `useBookmarks` — tree structure, search flattening
- [ ] E2E: `tests/newtab.spec.ts` — bookmarks panel opens
- [ ] E2E: `tests/notifications.spec.ts` — badge count, clear all
