# PR-10 — Backup / Restore

## Scope

Full export/import of user data (manual + auto-backup).

## Tasks

### 1. SW handler (`src/background/handlers/backup.ts`)

#### Export
- Message: `{ name: 'backup.export' }`
- Reads all storage namespaces: `settings.*`, `apps.*`, `notes.*`, `habits.*`, `workspaces.*`, `widgets.*`
- Builds `BackupPayload` v2 (see `src/types/backup.ts`)
- Returns JSON string to new tab page
- New tab page triggers download via `<a download="natalix-nova-backup-{date}.json">`

#### Import
- Message: `{ name: 'backup.import', payload: BackupPayload }`
- Validates payload: checks `version === 2`, required fields present
- Writes all keys to `chrome.storage.local`
- `chrome.storage.onChanged` triggers store refresh automatically
- Returns `{ success: true }` or `{ error: 'invalid_payload' | 'write_failed' }`

#### Auto-backup
- `chrome.alarms.create('auto-backup', { periodInMinutes: 60 * 24 })` — daily
- On alarm: collect data, store compressed in `backup.auto_{timestamp}`
- Keep last 7 auto-backups (delete oldest on new save)
- Storage key list: `backup.autoList` → `string[]` of timestamps

### 2. Backup payload schema (`src/types/backup.ts`)
```typescript
interface BackupPayload {
  version: 2
  exportedAt: string
  settings: Record<string, unknown>
  apps: AppItem[]
  notes: { content: string; focus: string }
  habits: Habit[]
  workspaces: Workspace[]
  widgets: Record<string, unknown>
}
```

### 3. BackupPanel (`src/features/backup/BackupPanel.tsx`)
- Manual export button → triggers `backup.export` message → download file
- Manual import: `<input type="file" accept=".json">` → reads file → sends `backup.import`
- Auto-backup section: list of last 7 auto-backups with date + size
- Each auto-backup: "Restore" button → `backup.import` with that payload
- `data-testid="backup-panel"`, `data-testid="export-button"`, `data-testid="import-input"`

### 4. Alarm registration
In `src/background/alarms.ts`:
- Register `auto-backup` alarm on SW install/startup
- Dispatch to `backup.ts` handler on alarm fire

## Acceptance Criteria

- [ ] Export button downloads a valid `.json` file
- [ ] Exported JSON contains settings, apps, notes, habits
- [ ] Importing the exported file restores all data (test: export → change settings → import → verify restored)
- [ ] Auto-backup fires once per day (verify alarm registered in chrome://extensions)
- [ ] Max 7 auto-backups stored; oldest deleted when 8th created
- [ ] Invalid JSON file on import shows error message (no crash)
- [ ] Backup panel lists auto-backups with dates

## Out of Scope

- Cloud backup (Google Drive sync)
- Encrypted backups
- Partial restore (apps-only or settings-only mode)

## Technical Notes

- File download from extension page: create `Blob`, `URL.createObjectURL`, click `<a download>`
- File read: `FileReader.readAsText()` → `JSON.parse()` → validate → send to SW
- `version: 2` must be checked on import — reject older formats with a clear error message
- Auto-backup size: warn in console if > 5MB (large custom icons bloat the backup)

## Test Requirements

- [ ] Unit: `normalizeBackupPayload` — accepts v2, rejects null/malformed
- [ ] Unit: auto-backup rotation — 8th backup deletes 1st
- [ ] E2E: `tests/backup.spec.ts`
  - Export creates a downloadable file
  - Import restores settings (intercept storage write)
  - Import with invalid JSON shows error
