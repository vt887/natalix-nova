# PR-04 — App Grid

## Scope

Pinned apps speed-dial grid with drag-and-drop reordering and badge indicators.

## Tasks

### 1. AppGrid component (`src/features/apps/`)
- `AppGrid.tsx` — renders ordered list of `AppItem` components
- Reads ordered app list from `apps` store slice
- `data-testid="app-grid"`

### 2. AppItem component (`src/features/apps/AppItem.tsx`)
- Icon (favicon or custom) + label + optional badge
- Click → navigate to app URL
- Right-click context menu: "Remove", "Edit name"
- `data-testid="app-item"`, `data-app-id="{id}"`

### 3. App data model
```typescript
interface AppItem {
  id: string
  title: string
  url: string
  faviconUrl?: string
  customIconDataUrl?: string  // base64 if user uploaded custom icon
  badge?: number              // unread count
}
```

### 4. Apps store slice (`src/store/slices/apps.ts`)
- `items: AppItem[]` — ordered array
- `addApp(app)`, `removeApp(id)`, `reorder(fromIndex, toIndex)`
- `setBadge(id, count)`
- On mount: load from `chrome.storage.local` key `apps.items`
- Persist on every change

### 5. Default apps
On first install (no stored apps), populate with a sensible default set:
Google, YouTube, Gmail, GitHub, ChatGPT, Claude — stored as URL-based items.

### 6. Add App panel (`src/features/apps/AddAppPanel.tsx`)
- Search input with debounced filter
- Lists installed Chrome apps via `chrome.management.getAll()`
- Also allows manually entering any URL
- Click to add to grid
- `data-testid="add-app-panel"`, `data-testid="add-app-search"`

### 7. Drag-and-drop reordering
- Use HTML5 Drag and Drop API (no library)
- `draggable={true}` on `AppItem`
- `onDragStart`, `onDragOver`, `onDrop` handlers
- Visual: dragged item opacity 0.4, drop target highlighted
- On drop: call `store.reorder(fromIndex, toIndex)` → persists automatically

### 8. Badge indicators
- SW handler: `src/background/handlers/badges.ts`
- Listen to `chrome.webNavigation.onCompleted` for Gmail URL → read unread count from page title
- Send `{ name: 'badge.update', payload: { id, count } }` to new tab via `chrome.storage.local` (not message — storage onChange is reactive)
- `AppItem` shows badge if `badge > 0`

### 9. Favicon loading
- Use `chrome.runtime.getURL('_favicon/?pageUrl=' + encodeURIComponent(url) + '&size=32')`
- Fallback: first letter of title in a colored circle

## Acceptance Criteria

- [ ] App grid renders on new tab load with default apps
- [ ] Clicking an app navigates to its URL
- [ ] "+" button opens Add App panel
- [ ] Search in Add App panel filters installed apps and manual URLs
- [ ] Drag-and-drop reorders apps; new order persists across tabs
- [ ] Right-click context menu shows Remove option; removing works
- [ ] Badge number visible on app icon when count > 0
- [ ] Favicons load for all default apps

## Out of Scope

- Gmail API integration (badge is heuristic from page title, not API)
- Custom icon upload UI (stored in backup, but upload UI is in Settings, PR-05)
- App store panel (legacy feature — dropped)

## Technical Notes

- `chrome.management.getAll()` returns all installed extensions, not just "apps" — filter by `type === 'hosted_app' || type === 'packaged_app' || type === 'legacy_packaged_app'`
- In practice most users won't have Chrome apps — grid is primarily URL-based
- Drag-and-drop: calculate drop index from `dragOverIndex` state, not element position
- Store `apps.items` as JSON array, max 50 items

## Test Requirements

- [ ] Unit: `apps` store slice — add, remove, reorder
- [ ] Unit: favicon URL builder
- [ ] E2E: `tests/newtab.spec.ts` — app grid visible, count > 0
- [ ] E2E: `tests/icons.spec.ts` — favicons load, fallback renders
