import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

import { TEST_IDS } from '@/shared/constants/test-ids.constants';

const BLOCKING_IMPACTS = new Set(['serious', 'critical']);
const PUBLIC_MARKETING_ROUTES = [
  { name: 'About', path: '/en/about' },
  { name: 'Features', path: '/en/features' },
  { name: 'FAQ', path: '/en/faq' },
  { name: 'Contact', path: '/en/contact' },
] as const;

async function expectNoBlockingViolations(page: Page): Promise<void> {
  const results = await new AxeBuilder({ page }).analyze();
  const blocking = results.violations.filter((violation) =>
    BLOCKING_IMPACTS.has(violation.impact ?? ''),
  );

  expect(
    blocking.flatMap((violation) =>
      violation.nodes.map(
        (node) =>
          `${violation.id} ${node.target.join(' ')}: ${node.failureSummary ?? violation.description}`,
      ),
    ),
  ).toEqual([]);
}

test.describe('axe scans', () => {
  test('home page has no serious or critical violations', async ({ page }) => {
    await page.goto('/en');
    await expectNoBlockingViolations(page);
  });

  for (const route of PUBLIC_MARKETING_ROUTES) {
    test(`${route.name} page has no serious or critical violations`, async ({ page }) => {
      await page.goto(route.path);
      await expectNoBlockingViolations(page);
    });
  }

  test('articles page (loaded state) has no serious or critical violations', async ({ page }) => {
    await page.goto('/en/articles');
    await expect(page.getByTestId(TEST_IDS.articlesList)).toBeVisible();
    await expectNoBlockingViolations(page);
  });

  test('login page has no serious or critical violations', async ({ page }) => {
    await page.goto('/en/login');
    await expectNoBlockingViolations(page);
  });

  test('login page with validation errors has no serious or critical violations', async ({
    page,
  }) => {
    await page.goto('/en/login');
    await page.getByTestId(TEST_IDS.loginSubmit).click();
    await expect(page.getByText('Enter your email address.')).toBeVisible();
    await expectNoBlockingViolations(page);
  });

  test('settings page has no serious or critical violations', async ({ page }) => {
    await page.goto('/en/settings');
    await expectNoBlockingViolations(page);
  });

  test('workbench page has no serious or critical violations', async ({ page }) => {
    await page.goto('/en/workbench');
    await expectNoBlockingViolations(page);
  });
});
