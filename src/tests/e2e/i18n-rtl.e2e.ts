import { expect, test } from '@playwright/test';

import { LOCALE_COOKIE_NAME } from '@/packages/i18n/locale.constants';

test.describe('i18n / RTL', () => {
  test('defaults to English LTR', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.locator('html')).toHaveAttribute('dir', 'ltr');
  });

  test('the Arabic locale cookie switches language and direction', async ({
    context,
    page,
    baseURL,
  }) => {
    await context.addCookies([
      {
        name: LOCALE_COOKIE_NAME,
        value: 'ar',
        url: baseURL ?? 'http://localhost:3000',
      },
    ]);

    await page.goto('/');

    await expect(page.locator('html')).toHaveAttribute('lang', 'ar');
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
    await expect(page.getByRole('link', { name: 'المقالات', exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { level: 1 })).toContainText('سترِكت نكست رينجر');
  });

  test('an unsupported locale cookie falls back to the default locale', async ({
    context,
    page,
    baseURL,
  }) => {
    await context.addCookies([
      {
        name: LOCALE_COOKIE_NAME,
        value: 'xx',
        url: baseURL ?? 'http://localhost:3000',
      },
    ]);

    await page.goto('/');

    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  });
});
