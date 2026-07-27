import { expect, test } from '@playwright/test';

test.describe('localized URL and RTL contracts', () => {
  test('the bare origin redirects to the default English page', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveURL('/en');
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.locator('html')).toHaveAttribute('dir', 'ltr');
  });

  test('the Arabic URL is an independently crawlable RTL page', async ({ page }) => {
    await page.goto('/ar');

    await expect(page).toHaveURL('/ar');
    await expect(page.locator('html')).toHaveAttribute('lang', 'ar');
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
    await expect(page.getByRole('link', { name: 'About' })).toHaveCount(0);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /\/ar$/u);
  });

  test('the language switcher preserves the route, query, and fragment', async ({ page }) => {
    await page.goto('/en/faq?source=e2e#question');

    await page.getByRole('combobox', { name: 'Change language' }).selectOption('ar');

    await expect(page).toHaveURL('/ar/faq?source=e2e#question');
    await expect(page.locator('html')).toHaveAttribute('lang', 'ar');
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  });

  test('unsupported locale segments return a real not-found response', async ({ page }) => {
    const response = await page.goto('/xx');

    expect(response?.status()).toBe(404);
  });
});
