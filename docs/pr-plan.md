# PR Plan — Natalix Nova

## Overview

| PR | Title | Features | Priority | Depends On |
|---|---|---|---|---|
| PR-01 | Foundation | Project scaffold, types, services, SW skeleton | P0 | — |
| PR-02 | New Tab Shell + Background + Themes | F-01, F-10, F-36, F-37 | P0 | PR-01 |
| PR-03 | Search Bar | F-03 | P0 | PR-02 |
| PR-04 | App Grid | F-02, F-19 | P0 | PR-02 |
| PR-05 | Toolbar + Settings + Focus + Onboarding | F-11, F-14, F-15, F-16 | P0 | PR-02 |
| PR-06 | Weather Widget | F-05 | P0 | PR-02 |
| PR-07 | Notes + Calendar | F-09, F-06 | P1 | PR-05 |
| PR-08 | Pomodoro + Habits + World Clock | F-26, F-27, F-29 | P2 | PR-05 |
| PR-09 | Bookmarks + Notifications | F-12, F-08 | P1 | PR-05 |
| PR-10 | Backup / Restore | F-25 | P1 | PR-01 |
| PR-11 | Tab Management | F-31, F-32, F-22 | P2 | PR-02 |
| PR-12 | Integrations: GitHub + Google Drive | F-33, F-34 | P3 | PR-10 |
| PR-13 | Integrations: Todoist + Stocks | F-35, F-28 | P3 | PR-10 |
| PR-14 | AI Panel + AI Search | F-21, F-30 | P3 | PR-03 |
| PR-15 | Voice Search + Side Panel | F-13, F-17 | P2 | PR-03 |

## Delivery Order

```
PR-01 Foundation
  └── PR-02 Shell + Background + Themes
        ├── PR-03 Search
        ├── PR-04 App Grid
        ├── PR-06 Weather
        └── PR-05 Toolbar + Settings
              ├── PR-07 Notes + Calendar
              ├── PR-08 Pomodoro + Habits + Clock
              └── PR-09 Bookmarks + Notifications

PR-01 Foundation
  └── PR-10 Backup/Restore
        ├── PR-12 GitHub + Drive
        └── PR-13 Todoist + Stocks

PR-03 Search
  ├── PR-14 AI Panel
  └── PR-15 Voice + Side Panel

PR-02 Shell
  └── PR-11 Tab Management
```

## Extension Release Milestones

| Milestone | PRs | Status |
|---|---|---|
| M1 — Alpha (usable new tab) | PR-01 → PR-06 | P0 complete |
| M2 — Beta (full P1 features) | + PR-07, PR-09, PR-10 | P1 complete |
| M3 — RC (productivity widgets) | + PR-08, PR-11, PR-15 | P2 complete |
| M4 — Release (integrations + AI) | + PR-12, PR-13, PR-14 | P3 complete |
