import { expect, test } from '@playwright/test';

import { TEST_IDS } from '@/shared/constants/test-ids.constants';

test.describe('home page', () => {
  test('renders the hero, principles, and header navigation', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { level: 1 })).toContainText('Strict Next Ranger');
    await expect(page.getByText('Non-negotiables')).toBeVisible();
    await expect(page.getByTestId(TEST_IDS.appHeader)).toBeVisible();
  });

  test('navigates to articles through the CTA', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('link', { name: 'Browse articles' }).click();

    await expect(page).toHaveURL('/articles');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Articles');
  });

  test('unknown routes render the translated not-found page', async ({ page }) => {
    await page.goto('/definitely-not-a-route');

    await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible();

    await page.getByRole('link', { name: 'Back to home' }).click();

    await expect(page).toHaveURL('/');
  });
});
