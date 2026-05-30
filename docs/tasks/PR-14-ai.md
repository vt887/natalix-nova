# PR-14 — AI Panel + AI Search Suggestions

## Scope

AI-powered search suggestions in the search bar and a full AI chat panel.

## Tasks

### 1. AI provider config (`src/features/ai/providers.ts`)
Supported providers:
| Provider | API | Auth |
|---|---|---|
| Claude (Anthropic) | `https://api.anthropic.com/v1/messages` | API key |
| OpenAI | `https://api.openai.com/v1/chat/completions` | API key |
| Gemini | `https://generativelanguage.googleapis.com/v1beta/models/...` | API key |
| Ollama (local) | `http://localhost:11434/api/chat` | None |

Storage: `tokens.aiProvider` (key name), `tokens.aiApiKey`, `tokens.aiModel`

### 2. SW handler (`src/background/handlers/ai.ts`)

#### Chat
- Message: `{ name: 'ai.chat', payload: { messages: ChatMessage[], stream: false } }`
- Routes to configured provider
- Returns `{ content: string }` or `{ error }`
- No streaming in v1 (simplicity)

#### Search suggestions
- Message: `{ name: 'ai.suggest', payload: { query: string } }`
- Sends short prompt: `"Give 3 search refinements for: {query}. Reply as JSON array of strings."`
- Returns `string[]` (max 3 suggestions)
- Cache: keyed by query, TTL 10 min
- Only fires if query ≥ 4 chars and user has AI configured

### 3. AISearchSuggestions (`src/features/ai/AISearchSuggestions.tsx`)
- Shown below regular autocomplete suggestions in search bar
- Visually separated section: "✦ AI suggestions"
- Debounced 400ms after typing stops
- Only shown if `settings.aiSearchEnabled === true` and API key configured
- `data-testid="ai-suggestions"`

### 4. AIPanel (`src/features/ai/AIPanel.tsx`)
- Full-height slide-in panel
- Chat interface: message list + input + send button
- Message bubbles: user (right) + assistant (left)
- System prompt: "You are a helpful assistant for a Chrome new tab extension."
- New conversation button (clears history)
- Chat history stored in `chrome.storage.local` key `ai.history` (last 50 messages)
- `data-testid="ai-panel"`, `data-testid="ai-input"`, `data-testid="ai-send"`

### 5. Settings — AI
In Settings Integrations section:
- Provider dropdown (Claude / OpenAI / Gemini / Ollama)
- API key input (password field)
- Model input (e.g. `claude-sonnet-4-6`, `gpt-4o`)
- Toggle: enable AI search suggestions
- "Test connection" button

### 6. AI store slice (`src/store/slices/ai.ts`)
```typescript
interface AIState {
  history: ChatMessage[]
  status: 'idle' | 'loading' | 'error'
  configured: boolean
}
```

## Acceptance Criteria

- [ ] AI panel opens from toolbar AI button (or search bar shortcut)
- [ ] Chat messages send and receive responses
- [ ] AI suggestions appear in search bar after 400ms of typing (if enabled + configured)
- [ ] AI suggestions are visually distinct from bookmark/history suggestions
- [ ] Ollama (local) works without API key
- [ ] Invalid API key → clear error message, no crash
- [ ] Chat history persists across panel close/open
- [ ] "New conversation" clears history

## Out of Scope

- Streaming responses (non-streaming only in v1)
- Image input (text only)
- Multiple AI conversations / threads
- RAG over bookmarks/history

## Technical Notes

- All AI API calls from SW — API keys never exposed to page context
- Anthropic API requires `anthropic-version: 2023-06-01` header and `x-api-key` (not Bearer)
- Ollama runs on `localhost` — add `http://localhost/*` to `host_permissions` for this to work in MV3
- AI suggestions should be skipped if the query looks like a URL (contains `.` or `:`)
- Max chat history: 50 messages FIFO — enforce before persisting

## Test Requirements

- [ ] Unit: provider URL/header builder for each AI provider
- [ ] Unit: AI suggestion skip logic (URL detection, min length)
- [ ] Unit: chat history FIFO max-50 enforcement
- [ ] E2E: `tests/newtab.spec.ts` — AI panel opens; no-config state shown
