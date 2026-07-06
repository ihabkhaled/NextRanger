import { expect, test } from '@playwright/test';

import { LOCALE_COOKIE_NAME } from '@/packages/i18n/locale.constants';
import { TEST_IDS } from '@/shared/constants/test-ids.constants';

const VIEWPORTS = {
  desktop: { width: 1280, height: 800 },
  tablet: { width: 820, height: 1180 },
  mobile: { width: 390, height: 844 },
} as const;

test.describe('visual baselines', () => {
  for (const [name, viewport] of Object.entries(VIEWPORTS)) {
    test(`home LTR ${name}`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto('/');

      await expect(page).toHaveScreenshot(`home-ltr-${name}.png`, { fullPage: true });
    });
  }

  test('home RTL desktop', async ({ context, page, baseURL }) => {
    await context.addCookies([
      { name: LOCALE_COOKIE_NAME, value: 'ar', url: baseURL ?? 'http://localhost:3000' },
    ]);
    await page.setViewportSize(VIEWPORTS.desktop);
    await page.goto('/');

    await expect(page).toHaveScreenshot('home-rtl-desktop.png', { fullPage: true });
  });

  test('articles desktop', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.desktop);
    await page.goto('/articles');
    await expect(page.getByTestId(TEST_IDS.articlesList)).toBeVisible();

    await expect(page).toHaveScreenshot('articles-desktop.png', { fullPage: true });
  });

  test('settings dark theme desktop', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.desktop);
    await page.goto('/settings');
    await page.getByTestId('settings-theme-dark').click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

    await expect(page).toHaveScreenshot('settings-dark-desktop.png', { fullPage: true });
  });
});
