# PR-12 — Integrations: GitHub + Google Drive

## Scope

GitHub notifications/PRs widget and Google Drive recent files widget.
Both require user-provided credentials stored in `chrome.storage.local`.

---

## GitHub Widget (F-34)

### Tasks

#### 1. SW handler (`src/background/handlers/github.ts`)
- Message: `{ name: 'github.fetch' }`
- Reads token from `tokens.github` storage key
- If no token: returns `{ error: 'no_token' }`
- Fetches:
  - `GET https://api.github.com/notifications` (unread notifications)
  - `GET https://api.github.com/search/issues?q=is:pr+is:open+review-requested:@me` (PRs to review)
- Headers: `Authorization: token {token}`, `Accept: application/vnd.github.v3+json`
- Cache: 5 min TTL in `github.data` + `github.cachedAt`
- On 401: return `{ error: 'invalid_token' }`

#### 2. GithubWidget (`src/features/github/GithubWidget.tsx`)
- Setup state (no token): shows "Connect GitHub" button → opens settings
- Loaded state: unread count badge + list of notifications
- PR section: open PRs assigned for review
- Each notification: repo name + title + type icon + time ago
- Click → opens GitHub URL
- `data-testid="github-widget"`

#### 3. GitHub token in Settings
In Settings → Integrations section:
- `<input type="password">` for token (shown as ••••)
- "Save" button → stores in `tokens.github`
- "Test connection" button → sends `github.fetch` → shows username on success
- "Remove" button → clears token

---

## Google Drive Widget (F-33)

### Tasks

#### 1. SW handler (`src/background/handlers/drive.ts`)
- Message: `{ name: 'drive.fetch' }`
- Uses `chrome.identity.getAuthToken({ interactive: false, scopes: ['https://www.googleapis.com/auth/drive.metadata.readonly'] })`
- If no token (user not authorized): return `{ error: 'unauthorized' }`
- Fetch:
  ```
  GET https://www.googleapis.com/drive/v3/files
    ?pageSize=8
    &orderBy=viewedByMeTime+desc
    &fields=files(id,name,mimeType,webViewLink,iconLink,modifiedTime)
    Authorization: Bearer {token}
  ```
- Cache: 5 min TTL in `drive.files` + `drive.cachedAt`
- On 401: `chrome.identity.removeCachedAuthToken` → return `{ error: 'unauthorized' }`

#### 2. DriveWidget (`src/features/drive/DriveWidget.tsx`)
- Unauthorized state: "Connect Google Drive" button → triggers auth
- Loaded state: list of 8 recent files
- Each file: Google file type icon + name + modified date
- Click → open `webViewLink` in new tab
- `data-testid="drive-widget"`

#### 3. Drive auth flow
- `{ name: 'drive.authorize' }` message → `chrome.identity.getAuthToken({ interactive: true })` → refetch

#### 4. Drive type icons
Map `mimeType` to icon:
- `application/vnd.google-apps.document` → Docs icon
- `application/vnd.google-apps.spreadsheet` → Sheets icon
- `application/vnd.google-apps.presentation` → Slides icon
- `application/pdf` → PDF icon
- Default → generic file icon

## Acceptance Criteria

**GitHub:**
- [ ] "Connect GitHub" → settings → token saved → widget shows notifications
- [ ] Notification count badge shown on widget
- [ ] List of unread notifications with repo + title
- [ ] PRs for review listed separately
- [ ] Invalid token shows "reconnect" prompt (not crash)
- [ ] Data refreshes every 5 min

**Google Drive:**
- [ ] "Connect Google Drive" → OAuth consent → files shown
- [ ] 8 recent files listed with correct type icons
- [ ] Click opens file in browser
- [ ] Unauthorized state after token revoke shows reconnect button

## Out of Scope

- GitHub Actions / CI status
- Creating or editing Drive files
- GitHub issue management
- Multiple GitHub accounts

## Technical Notes

- GitHub PAT: use Classic token with `notifications` + `repo` scopes — document this in Settings UI
- Drive `drive.metadata.readonly` scope: shows file names/links but not content — privacy-friendly
- Both widgets respect `settings.widgets.{name}.enabled` toggle from Settings
- Tokens stored at `tokens.github`, OAuth tokens managed by `chrome.identity` (not stored manually)

## Test Requirements

- [ ] Unit: `github.ts` handler — caching, 401 handling
- [ ] Unit: Drive mimeType → icon mapping
- [ ] E2E: `tests/newtab.spec.ts` — widgets render in "no token" state without crashing
