import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  retries: 0,
  use: {
    // Extensions generally require headful Chromium.
    headless: false,
  },
});

