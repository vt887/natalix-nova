# PR-07 — Notes + Google Calendar

## Scope

Quick Notes widget and Google Calendar events widget.

---

## Quick Notes (F-09)

### Tasks

#### 1. QuickNotes component (`src/features/notes/QuickNotes.tsx`)
- Slide-in panel or inline widget (toggled via toolbar `#qnotes-button`)
- `contenteditable` div — plain text only
- Paste handler: strip HTML, insert plain text only
- Auto-save on every keystroke (debounced 500ms)
- Storage key: `notes.content` → string
- `data-testid="notes-panel"`, `data-testid="notes-textarea"`

#### 2. Notes store slice (`src/store/slices/notes.ts`)
- `content: string`
- `setContent(text)` — updates store + persists to storage debounced

---

## Google Calendar (F-06)

### Tasks

#### 1. SW handler (`src/background/handlers/calendar.ts`)
Messages handled:
- `{ name: 'calendar.isAuthorized' }` → `boolean`
- `{ name: 'calendar.authorize' }` → starts OAuth, returns `boolean`
- `{ name: 'calendar.getEvents' }` → `CalendarEvent[]` or `{ error }`

OAuth flow:
```typescript
const token = await chrome.identity.getAuthToken({ interactive: true, scopes: ['https://www.googleapis.com/auth/calendar.readonly'] })
```

Fetch events:
```
GET https://www.googleapis.com/calendar/v3/calendars/primary/events
  ?maxResults=10
  &orderBy=startTime
  &singleEvents=true
  &timeMin={now.toISOString()}
  &timeMax={+7days.toISOString()}
  Authorization: Bearer {token}
```

Cache: `calendar.events` + `calendar.cachedAt`, TTL 5 min.
On 401: `chrome.identity.removeCachedAuthToken` → retry once.

#### 2. CalendarWidget component (`src/features/calendar/CalendarWidget.tsx`)
- Shows next 3 upcoming events
- Each event: time + title + calendar color dot
- "Sign in with Google" button if not authorized
- Click event → open Google Calendar URL
- `data-testid="calendar-widget"`

#### 3. Event formatting (`src/features/calendar/format.ts`)
- All-day events: show day name ("Today", "Tomorrow", "Monday")
- Timed events: show time ("2:30 PM") + duration
- Ongoing events: "In progress"

#### 4. Calendar store slice (`src/store/slices/calendar.ts`)
- `events: CalendarEvent[]`
- `authorized: boolean`
- `status: 'idle' | 'loading' | 'success' | 'error' | 'unauthorized'`

#### 5. useCalendar hook (`src/features/calendar/useCalendar.ts`)
- On mount: check `calendar.isAuthorized` → if yes fetch events
- Refetch every 5 min

## Acceptance Criteria

**Notes:**
- [ ] Notes panel opens via toolbar button
- [ ] Text typed persists after closing and reopening panel
- [ ] Text persists across new tab opens
- [ ] Pasting HTML (from browser) strips formatting, inserts plain text

**Calendar:**
- [ ] Widget shows "Sign in with Google" when not authorized
- [ ] Clicking "Sign in" opens OAuth consent screen
- [ ] After auth, upcoming events displayed (3 max)
- [ ] Events refresh every 5 min without user action
- [ ] Revoked token → re-prompts for auth gracefully

## Out of Scope

- Creating/editing calendar events
- Multiple calendar accounts
- Calendar sync (read-only only)

## Technical Notes

- Calendar OAuth: `interactive: true` must be called from a user gesture context (button click), not automatically on page load
- Store `authorized` state in `chrome.storage.local` — persists across reloads without re-checking identity
- Notes: `contenteditable` vs `<textarea>` — use `<textarea>` for simplicity; style to look like `contenteditable`
- Notes max length: 10,000 characters (enforce in `setContent`)

## Test Requirements

- [ ] Unit: `format.ts` — all-day, timed, multi-day, ongoing event formatting
- [ ] Unit: `notes` store slice — debounce persists, max length enforced
- [ ] E2E: `tests/notes.spec.ts` — open, type, reload, verify persisted
- [ ] E2E: `tests/calendar.spec.ts` — unauthorized state shown; events shown with mocked token
