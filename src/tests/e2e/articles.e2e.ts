import { expect, test } from '@playwright/test';

import { TEST_IDS } from '@/shared/constants/test-ids.constants';

test.describe('articles list', () => {
  test('renders the gateway fixture articles as cards', async ({ page }) => {
    await page.goto('/en/articles');

    await expect(page.getByTestId(TEST_IDS.articlesList)).toBeVisible();

    const cards = page.locator(`[data-testid^="${TEST_IDS.articleCard}-"]`);

    await expect(cards).toHaveCount(5);
  });

  test('shows translated status badges and reading times', async ({ page }) => {
    await page.goto('/en/articles');

    await expect(page.getByTestId(TEST_IDS.articlesList)).toBeVisible();
    await expect(page.getByText('Draft', { exact: true })).toBeVisible();
    await expect(page.getByText('7 minute read')).toBeVisible();
  });

  test('orders published articles newest first with drafts at the end', async ({ page }) => {
    await page.goto('/en/articles');

    const cards = page.locator(`[data-testid^="${TEST_IDS.articleCard}-"]`);

    await expect(cards.first()).toContainText('Designing module-first frontends');
    await expect(cards.last()).toContainText('Query keys are cache addresses');
  });
});
