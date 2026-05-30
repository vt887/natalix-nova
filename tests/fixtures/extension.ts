import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { test as base, chromium, type BrowserContext } from '@playwright/test';

type Fixtures = {
  context: BrowserContext;
  extensionId: string;
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const test = base.extend<Fixtures>({
  context: async (_args, use) => {
    const extensionPath = path.resolve(__dirname, '../../dist');

    const context = await chromium.launchPersistentContext('', {
      headless: false,
      args: [
        `--disable-extensions-except=${extensionPath}`,
        `--load-extension=${extensionPath}`,
      ],
    });

    await use(context);
    await context.close();
  },

  extensionId: async ({ context }, use) => {
    // Discover the extension id by looking for any chrome-extension:// page.
    const background = context.backgroundPages()[0];
    if (background) {
      const url = background.url();
      const id = new URL(url).host;
      await use(id);
      return;
    }

    // Fallback: open a new tab and wait for any extension page to appear.
    const page = await context.newPage();
    await page.goto('chrome://extensions/');
    const pages = context.pages();
    const extPage = pages.find((p) => p.url().startsWith('chrome-extension://'));
    const id = extPage ? new URL(extPage.url()).host : '';
    await use(id);
  },
});

export const expect = test.expect;
