import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

import { TEST_IDS } from '@/shared/constants/test-ids.constants';

const BLOCKING_IMPACTS = new Set(['serious', 'critical']);

async function expectNoBlockingViolations(page: Page): Promise<void> {
  const results = await new AxeBuilder({ page }).analyze();
  const blocking = results.violations.filter((violation) =>
    BLOCKING_IMPACTS.has(violation.impact ?? ''),
  );

  expect(blocking.map((violation) => `${violation.id}: ${violation.description}`)).toEqual([]);
}

test.describe('axe scans', () => {
  test('home page has no serious or critical violations', async ({ page }) => {
    await page.goto('/');
    await expectNoBlockingViolations(page);
  });

  test('articles page (loaded state) has no serious or critical violations', async ({ page }) => {
    await page.goto('/articles');
    await expect(page.getByTestId(TEST_IDS.articlesList)).toBeVisible();
    await expectNoBlockingViolations(page);
  });

  test('login page has no serious or critical violations', async ({ page }) => {
    await page.goto('/login');
    await expectNoBlockingViolations(page);
  });

  test('login page with validation errors has no serious or critical violations', async ({
    page,
  }) => {
    await page.goto('/login');
    await page.getByTestId(TEST_IDS.loginSubmit).click();
    await expect(page.getByText('Enter your email address.')).toBeVisible();
    await expectNoBlockingViolations(page);
  });

  test('settings page has no serious or critical violations', async ({ page }) => {
    await page.goto('/settings');
    await expectNoBlockingViolations(page);
  });

  test('workbench page has no serious or critical violations', async ({ page }) => {
    await page.goto('/workbench');
    await expectNoBlockingViolations(page);
  });
});
