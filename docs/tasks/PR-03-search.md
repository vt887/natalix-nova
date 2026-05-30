# PR-03 — Search Bar

## Scope

Fully functional search bar with multi-provider support and autocomplete.

## Tasks

### 1. SearchBar component (`src/features/search/`)
- `SearchBar.tsx` — input field with provider badge on the left, voice button on the right
- Auto-focused on page load via `autoFocus` prop or `useEffect`
- On Enter: navigate to `provider.url + encodeURIComponent(query)`
- `data-testid="search-input"`, `data-testid="search-form"`

### 2. Search providers (`src/features/search/providers.ts`)
Preset providers:
| Key | Name | URL template |
|---|---|---|
| `google` | Google | `https://www.google.com/search?q=` |
| `bing` | Bing | `https://www.bing.com/search?q=` |
| `duckduckgo` | DuckDuckGo | `https://duckduckgo.com/?q=` |
| `brave` | Brave | `https://search.brave.com/search?q=` |
| `perplexity` | Perplexity | `https://www.perplexity.ai/search?q=` |

Storage: `settings.searchProvider` → provider key string

### 3. Provider selector
- `ProviderSelector.tsx` — dropdown showing all providers with icons
- Provider icon: `_favicon/{providerDomain}` or bundled SVG
- Click on badge opens dropdown; click provider sets it and closes
- `data-testid="provider-selector"`, `data-testid="provider-option-{key}"`

### 4. Autocomplete (`src/features/search/Autocomplete.tsx`)
Two suggestion sources (merged, deduplicated):

**a. Bookmarks suggestions**
- On input change: search `chrome.bookmarks` via `src/services/browser/bookmarks.ts`
- Show matching bookmark titles + URLs

**b. History suggestions** (if `history` permission granted)
- `chrome.history.search({ text: query, maxResults: 5 })`
- Show matching page titles + URLs
- Only if `optional_permissions: ['history']` is granted — check first

Suggestion item: favicon + title + URL, click navigates directly.
Max 8 suggestions total. Keyboard navigation (↑↓ Enter Esc).

### 5. Search settings section
In Settings panel (PR-05), add:
- Default search provider dropdown
- Toggle: open search in new tab vs current tab

### 6. useSearch hook (`src/features/search/useSearch.ts`)
- `query: string`, `setQuery`
- `suggestions: Suggestion[]`
- `submit(query)` — navigates to provider URL
- Debounced suggestion fetch (200ms)

### 7. Store slice update (`src/store/slices/settings.ts`)
- `searchProvider: string` (default: `'google'`)
- `searchInNewTab: boolean` (default: `false`)

## Acceptance Criteria

- [ ] Search input is focused on new tab page load
- [ ] Typing and pressing Enter navigates to Google (default provider)
- [ ] Clicking provider badge shows dropdown with all 5 providers
- [ ] Selecting a provider persists across new tabs (stored in `chrome.storage.local`)
- [ ] Autocomplete shows bookmark/history suggestions as user types (≥2 chars)
- [ ] Arrow keys navigate suggestions; Enter selects; Esc closes
- [ ] Suggestions close on click outside
- [ ] Search works on all 5 providers

## Out of Scope

- Voice search (PR-15)
- AI search suggestions (PR-14)
- Frecency/WebSQL engine — not implemented in natalix-nova

## Technical Notes

- Do not call `chrome.history` until user has granted optional permission
- Check permission: `chrome.permissions.contains({ permissions: ['history'] })`
- Suggestion list must have `role="listbox"`, items `role="option"` for a11y
- Debounce: use `useDebounce` hook from `src/hooks/useDebounce.ts`
- Provider icons: fetch from `https://www.google.com/s2/favicons?domain={domain}&sz=32` or bundle as SVGs

## Test Requirements

- [ ] Unit: `providers.test.ts` — URL building for each provider
- [ ] Unit: `useSearch.test.ts` — submit navigates, debounce fires once
- [ ] E2E: `tests/search.spec.ts`
  - Search input is focused
  - Typing triggers suggestions
  - Provider switch persists
  - Enter submits to correct URL
