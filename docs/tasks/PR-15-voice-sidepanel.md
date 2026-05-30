# PR-15 — Voice Search + Side Panel

## Scope

Voice/speech input for search and Chrome Side Panel integration.

---

## Voice Search (F-13)

### Tasks

#### 1. Offscreen document (`src/offscreen/index.ts` + `pages/offscreen.html`)
- `chrome.offscreen.createDocument` for Web Speech API (not available in SW)
- Message: `{ name: 'speech.start' }` → starts `webkitSpeechRecognition`
- Message: `{ name: 'speech.stop' }` → stops recognition
- Sends result back: `{ name: 'speech.result', payload: { transcript: string } }`
- Sends error: `{ name: 'speech.error', payload: { error: string } }`

#### 2. VoiceSearch component (`src/features/search/VoiceSearch.tsx`)
- Mic button in search bar (right side)
- States: idle (mic icon) → listening (animated pulse) → processing → done
- On result: fills search input with transcript
- On error: shows error icon with tooltip
- `data-testid="voice-search-button"`

#### 3. useVoiceSearch hook (`src/features/search/useVoiceSearch.ts`)
- `start()` → sends `speech.start` to offscreen via SW
- `stop()` → sends `speech.stop`
- Listens for `speech.result` / `speech.error` via `chrome.runtime.onMessage`
- Status: `'idle' | 'listening' | 'error'`

#### 4. Offscreen lifecycle
- Create offscreen document on first voice search request if not exists
- Check: `chrome.offscreen.hasDocument()` before creating
- Only one offscreen document allowed per extension at a time

---

## Side Panel (F-17)

### Tasks

#### 1. Manifest update
```json
"side_panel": {
  "default_path": "sidepanel.html"
}
```
Permission: add `"sidePanel"` to permissions array.

#### 2. Side panel entry (`sidepanel.html` + `src/sidepanel/main.ts`)
- Separate React entry point
- Lighter version of the extension UI: search bar + AI chat + notes
- Shares same `chrome.storage.local` data as new tab page
- `data-testid="sidepanel-root"`

#### 3. Side panel open trigger
- In SW: `chrome.sidePanel.open({ windowId })` on toolbar button click
- OR: user opens via Chrome's side panel button (native)
- Settings toggle: enable/disable side panel feature

#### 4. Side panel contents (`src/sidepanel/SidePanel.tsx`)
- Top: search bar (same as PR-03, reused component)
- Middle: AI chat (same as PR-14, reused component)
- Bottom: quick notes (same as PR-07, reused component)
- No background image, no app grid (those are new tab only)

## Acceptance Criteria

**Voice Search:**
- [ ] Mic button visible in search bar
- [ ] Clicking mic → microphone permission requested if not granted
- [ ] Speaking → transcript appears in search bar
- [ ] Animated pulse visible during listening
- [ ] Stop listening on mic button click (toggle)
- [ ] Error state shown if mic permission denied (no crash)

**Side Panel:**
- [ ] Side panel appears when opened (via Chrome UI or extension trigger)
- [ ] Contains working search bar
- [ ] Contains AI chat (if configured)
- [ ] Contains quick notes
- [ ] Data shared with new tab page (notes typed in side panel appear in new tab notes)

## Out of Scope

- Continuous voice dictation (single-utterance only)
- Voice commands (e.g. "open Gmail")
- Side panel custom layout configuration

## Technical Notes

- `webkitSpeechRecognition` is Chrome-only — no need for fallback in a Chrome extension
- Offscreen document must specify `reasons: ['USER_MEDIA']` for Speech API
- Side panel `sidepanel.html` is a separate Vite entry point — add to `vite.config.ts` input
- Side panel shares `chrome.storage` with new tab — no extra sync needed
- `chrome.sidePanel` API available in Chrome 114+ (within our `minimum_chrome_version: 120`)

## Test Requirements

- [ ] Unit: `useVoiceSearch` — start/stop lifecycle, offscreen message handling
- [ ] E2E: `tests/sidepanel.spec.ts`
  - Side panel opens
  - Search renders
  - Notes shared with new tab
- [ ] E2E: voice search requires manual test (microphone permission in CI is unavailable)
  - Document as manual test in `tests/MANUAL.md`
