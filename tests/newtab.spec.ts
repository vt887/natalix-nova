import { test, expect } from './fixtures/extension';

test('new tab loads with no console errors and SW is active', async ({ context, extensionId }) => {
  const page = await context.newPage();

  const consoleErrors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });

  await page.goto('chrome://newtab/');
  await expect(page.locator('#page-bg')).toBeVisible();
  await expect(page.locator('#left-toolbar')).toBeVisible();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  expect(consoleErrors).toEqual([]);

  // Service worker should be registered by the extension.
  // The exact URL includes the extension id.
  expect(extensionId).not.toEqual('');
});
