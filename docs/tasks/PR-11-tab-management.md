# PR-11 — Tab Management

## Scope

Save/restore named tab workspaces, full session restore, and recently closed tabs.

## Tasks

### 1. SW handler (`src/background/handlers/workspace.ts`)

#### Save workspace
- Message: `{ name: 'workspace.save', payload: { name: string } }`
- `chrome.tabs.query({ currentWindow: true })` → collect all open tabs
- Store as `Workspace` object in `workspaces.list`
- Returns saved workspace

#### Restore workspace
- Message: `{ name: 'workspace.restore', payload: { id: string } }`
- Opens all tabs from workspace (in new window or current window)
- Uses `chrome.tabs.create()` for each tab URL

#### Delete workspace
- Message: `{ name: 'workspace.delete', payload: { id: string } }`

### 2. Workspace data model (`src/types/workspace.ts`)
```typescript
interface WorkspaceTab {
  url: string
  title: string
  faviconUrl?: string
}
interface Workspace {
  id: string                // crypto.randomUUID()
  name: string
  savedAt: string           // ISO date
  tabs: WorkspaceTab[]
}
```

### 3. SW handler (`src/background/handlers/session.ts`)

#### Get sessions
- Message: `{ name: 'session.getRecent' }`
- `chrome.sessions.getRecentlyClosed({ maxResults: 25 })`
- Returns list of recent sessions (windows and tabs)

#### Restore session
- Message: `{ name: 'session.restore', payload: { sessionId: string } }`
- `chrome.sessions.restore(sessionId)`

### 4. WorkspacesPanel (`src/features/workspaces/WorkspacesPanel.tsx`)
- "Save current tabs as workspace" → name input → save button
- List of saved workspaces:
  - Name + tab count + saved date
  - Favicon row (first 5 tab favicons)
  - "Restore" button → opens all tabs
  - "Delete" button
- `data-testid="workspaces-panel"`

### 5. Session Restore section (within WorkspacesPanel or separate tab)
- List of recently closed windows/tabs from `chrome.sessions`
- Window entry: tab count + timestamp → "Restore Window" button
- Tab entry: favicon + title + URL → click navigates
- `data-testid="session-list"`

### 6. Recently Closed (quick access, on main page)
- Small button/area below app grid
- Shows last 5 recently closed tabs inline
- Click → navigate to URL
- Same data as session restore, filtered to single tabs only

### 7. Workspaces store slice (`src/store/slices/workspaces.ts`)
- `list: Workspace[]`
- `recentSessions: chrome.sessions.Session[]`
- `addWorkspace`, `removeWorkspace`

## Acceptance Criteria

- [ ] "Save workspace" saves all current open tabs with a name
- [ ] Saved workspaces list shows in panel
- [ ] Restoring a workspace opens all saved tabs
- [ ] Deleting a workspace removes it from list
- [ ] Recently closed section shows last 5 closed tabs/windows
- [ ] Restoring a session re-opens tabs via `chrome.sessions.restore`
- [ ] Workspaces persist across browser restarts (in `chrome.storage.local`)

## Out of Scope

- Workspace sync across devices
- Tab groups (chrome.tabGroups API — requires additional permission)
- Named session categories

## Technical Notes

- `chrome.sessions` permission is already covered by `tabs` permission in MV3
- `chrome.sessions.getRecentlyClosed` returns both `Window` and `Tab` entries — handle both
- Workspace restore: prefer `chrome.windows.create({ url: tabs.map(t => t.url) })` for restoring as a group
- Max 20 saved workspaces — enforce in store

## Test Requirements

- [ ] Unit: workspace store — add, remove, max limit
- [ ] E2E: `tests/workspaces.spec.ts`
  - Save workspace with current tabs
  - List shows saved workspace
  - Restore opens tabs
  - Recently closed shows after closing a tab
