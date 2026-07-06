import { defineConfig, devices } from '@playwright/test';

const isCi = Boolean(process.env['CI']);
// Dedicated port so a developer's `npm run dev` on 3000 is never mistaken
// for the production server under test.
const E2E_PORT = 3100;
const baseURL = process.env['PLAYWRIGHT_BASE_URL'] ?? `http://localhost:${E2E_PORT}`;

export default defineConfig({
  testDir: './src/tests',
  testMatch: ['e2e/**/*.e2e.ts', 'accessibility/**/*.a11y.ts', 'visual/**/*.visual.ts'],
  fullyParallel: true,
  forbidOnly: isCi,
  retries: isCi ? 2 : 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  expect: {
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.02,
    },
  },
  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: `npm run build && npm run start -- --port ${E2E_PORT}`,
    url: baseURL,
    reuseExistingServer: !isCi,
    timeout: 600_000,
    env: {
      NEXT_PUBLIC_APP_ENV: 'test',
      NEXT_PUBLIC_APP_URL: baseURL,
      SERVER_API_BASE_URL: 'http://localhost:4000',
      SERVER_API_MOCKING: 'enabled',
    },
  },
});
