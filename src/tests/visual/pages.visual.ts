import { expect, test } from '@playwright/test';

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
      await page.goto('/en');

      await expect(page).toHaveScreenshot(`home-ltr-${name}.png`, { fullPage: true });
    });
  }

  test('home RTL desktop', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.desktop);
    await page.goto('/ar');

    await expect(page).toHaveScreenshot('home-rtl-desktop.png', { fullPage: true });
  });

  test('articles desktop', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.desktop);
    await page.goto('/en/articles');
    await expect(page.getByTestId(TEST_IDS.articlesList)).toBeVisible();

    await expect(page).toHaveScreenshot('articles-desktop.png', { fullPage: true });
  });

  test('settings dark theme desktop', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.desktop);
    await page.goto('/en/settings');
    await page.getByTestId('settings-theme-dark').click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

    await expect(page).toHaveScreenshot('settings-dark-desktop.png', { fullPage: true });
  });
});
