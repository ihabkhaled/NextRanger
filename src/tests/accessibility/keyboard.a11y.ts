import { expect, test } from '@playwright/test';

import { TEST_IDS } from '@/shared/constants/test-ids.constants';

test.describe('keyboard operability', () => {
  test('the skip link is the first tab stop and jumps to main content', async ({ page }) => {
    await page.goto('/en');

    await page.keyboard.press('Tab');

    const skipLink = page.getByRole('link', { name: 'Skip to main content' });

    await expect(skipLink).toBeFocused();

    await page.keyboard.press('Enter');

    await expect(page).toHaveURL(/#main-content$/);
  });

  test('the login form is fully operable with the keyboard', async ({ page }) => {
    await page.goto('/en/login');

    await page.getByTestId(TEST_IDS.loginEmail).focus();
    await page.keyboard.type('demo@example.com');
    await page.keyboard.press('Tab');
    await page.keyboard.type('a-valid-password');
    await page.keyboard.press('Enter');

    await expect(page).toHaveURL('/en');
  });

  test('settings toggles expose pressed state and react to Enter', async ({ page }) => {
    await page.goto('/en/settings');

    const darkButton = page.getByTestId('settings-theme-dark');

    await darkButton.focus();
    await page.keyboard.press('Enter');

    await expect(darkButton).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  });
});
