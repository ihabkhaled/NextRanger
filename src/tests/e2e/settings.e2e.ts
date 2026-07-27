import { expect, test } from '@playwright/test';

test.describe('settings / ui preferences', () => {
  test('selecting the dark theme flips the document attribute', async ({ page }) => {
    await page.goto('/en/settings');

    await page.getByTestId('settings-theme-dark').click();

    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await expect(page.getByTestId('settings-theme-dark')).toHaveAttribute('aria-pressed', 'true');
  });

  test('switching to Arabic updates the route and document direction', async ({ page }) => {
    await page.goto('/en/settings');

    await page.getByRole('combobox', { name: 'Change language' }).selectOption('ar');

    await expect(page).toHaveURL('/ar/settings');
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  });

  test('preferences persist across a reload via validated storage', async ({ page }) => {
    await page.goto('/en/settings');

    await page.getByTestId('settings-theme-dark').click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

    await page.reload();

    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await expect(page.getByTestId('settings-theme-dark')).toHaveAttribute('aria-pressed', 'true');
  });
});
