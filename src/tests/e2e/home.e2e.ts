import { expect, test } from '@playwright/test';

import { TEST_IDS } from '@/shared/constants/test-ids.constants';

test.describe('home page', () => {
  test('renders the marketing hero, trust signal, and header navigation', async ({ page }) => {
    await page.goto('/en');

    await expect(page.getByRole('heading', { level: 1 })).toContainText(
      'The strict foundation your next product deserves',
    );
    await expect(
      page.getByText('Designed for product, engineering, and platform teams').first(),
    ).toBeVisible();
    await expect(page.getByRole('heading', { level: 2, name: 'Strict Next Ranger' })).toBeVisible();
    await expect(page.getByText('/en/contact')).toBeVisible();
    await expect(page.getByTestId(TEST_IDS.appHeader)).toBeVisible();
  });

  test('navigates to localized features through the primary CTA', async ({ page }) => {
    await page.goto('/en');

    await page.getByRole('link', { name: 'Explore features' }).click();

    await expect(page).toHaveURL('/en/features');
    await expect(page.getByRole('heading', { level: 1 })).toContainText(
      'Production discipline without production drag',
    );
  });

  test('unknown routes render the translated not-found page', async ({ page }) => {
    await page.goto('/en/definitely-not-a-route');

    await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible();

    await page.getByRole('link', { name: 'Back to home' }).click();

    await expect(page).toHaveURL('/en');
  });
});
