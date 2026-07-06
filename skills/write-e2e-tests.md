# Skill: Write E2E Tests

E2e specs drive the real built app in Chromium via Playwright. They live in
`src/tests/e2e/` with the `.e2e.ts` suffix — `playwright.config.ts` matches
`e2e/**/*.e2e.ts` and Vitest excludes the directory, so the suffix is load-bearing.
Standard: [testing/e2e-testing-standard.md](../testing/e2e-testing-standard.md).

## How the app runs

The `webServer` block in `playwright.config.ts` runs `npm run build && npm run start` with
`SERVER_API_MOCKING: 'enabled'`, so the BFF gateway
(`/api/gateway/[...path]` → `gateway-handler.ts`) serves the module mock fixtures
(`src/modules/articles/api/articles.mock.ts`, `src/modules/auth/api/auth.mock.ts`) and no
backend is needed. Specs MUST NOT stub the network with `page.route` — the mock gateway is
the contract. `forbidOnly` is on in CI and retries are `2` there; locally the server is
reused between runs.

## Steps

1. **Create the spec** at `src/tests/e2e/<flow>.e2e.ts`, one file per user flow (e.g.
   `login.e2e.ts`, `articles.e2e.ts`).
2. **Navigate by route constant semantics.** Go to the path documented in
   `src/shared/constants/route-paths.constants.ts` (`/login`, `/articles`, `/settings`) and
   assert the tab title matches the `buildPageTitle` format ("Section · App name").
3. **Select with `getByTestId` backed by `TEST_IDS`.** Every selector is a constant from
   `src/shared/constants/test-ids.constants.ts` — import it, never inline the string:

   ```ts
   import { TEST_IDS } from '@/shared/constants/test-ids.constants';

   await page.getByTestId(TEST_IDS.loginEmail).fill('ranger@example.com');
   await page.getByTestId(TEST_IDS.loginSubmit).click();
   ```

   Repeated rows use ids derived with `buildIndexedTestId`
   (`src/shared/testing/test-id.helper.ts`). Role/label queries are fine for assertions on
   copy; CSS/XPath selectors are forbidden.

4. **Write the happy path AND the negative path.** Every flow needs both. The login
   reference: any valid credentials succeed against the mock gateway; the sentinel
   `AUTH_MOCK_REJECTED_PASSWORD = 'wrong-password'`
   (`src/modules/auth/api/auth.mock.ts`) forces the failure branch — assert
   `TEST_IDS.loginError` becomes visible and the user stays on `/login`. New features MUST
   ship an equivalent sentinel in their mock fixtures so e2e can exercise errors
   deterministically.
5. **Use web-first assertions** (`await expect(locator).toBeVisible()`,
   `toHaveURL`, `toHaveTitle`) and never `waitForTimeout`. Playwright's auto-waiting plus
   the mock gateway makes every wait condition expressible as an assertion.
6. **Keep specs independent.** No shared login state between tests; each test starts from
   `page.goto`. Session is cookie-based, so a fresh context is a signed-out user.
7. **Run** `npm run test:e2e` (or `npm run test:e2e:ui` to debug). The full gate is part of
   `npm run validate` and the `e2e` workflow in `.github/workflows/e2e.yml`. No `.only`
   (CI `forbidOnly` fails the run) and no skipped tests without a documented exception in
   [docs/exceptions/](../docs/exceptions/README.md).

## Definition of done

- `.e2e.ts` spec in `src/tests/e2e/` with happy + negative paths.
- All selectors from `TEST_IDS`; no network stubbing; no timeouts; `npm run test:e2e` green
  against the mock-mode gateway.
