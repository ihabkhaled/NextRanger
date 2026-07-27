import { expect, test } from '@playwright/test';

import { TEST_IDS } from '@/shared/constants/test-ids.constants';

test.describe('login', () => {
  test('empty submit shows translated validation messages', async ({ page }) => {
    await page.goto('/en/login');

    await page.getByTestId(TEST_IDS.loginSubmit).click();

    await expect(page.getByText('Enter your email address.')).toBeVisible();
    await expect(page.getByText('Enter your password.')).toBeVisible();
    await expect(page).toHaveURL('/en/login');
  });

  test('rejected credentials surface the generic error and stay on the page', async ({ page }) => {
    await page.goto('/en/login');

    await page.getByTestId(TEST_IDS.loginEmail).fill('demo@example.com');
    await page.getByTestId(TEST_IDS.loginPassword).fill('wrong-password');
    await page.getByTestId(TEST_IDS.loginSubmit).click();

    await expect(page.getByTestId(TEST_IDS.loginError)).toContainText('Sign-in failed');
    await expect(page).toHaveURL('/en/login');
  });

  test('valid credentials toast success and redirect home', async ({ page }) => {
    await page.goto('/en/login');

    await page.getByTestId(TEST_IDS.loginEmail).fill('demo@example.com');
    await page.getByTestId(TEST_IDS.loginPassword).fill('a-valid-password');
    await page.getByTestId(TEST_IDS.loginSubmit).click();

    await expect(page).toHaveURL('/en');
    await expect(page.getByText('Signed in successfully.')).toBeVisible();
  });
});
