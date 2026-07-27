# Skill: Write Visual Tests

Visual regression specs live in `src/tests/visual/*.visual.ts` and run with Playwright via
`npm run test:visual`. They pin the rendered pixels of a page or primitive across the four axes
that matter in this repo: viewport, locale direction, theme, and content state. The standard is
defined in [testing/visual-testing-standard.md](../testing/visual-testing-standard.md); rules in
[rules/15-testing-and-coverage.md](../rules/15-testing-and-coverage.md).

## Ground rules

- File name MUST end in `.visual.ts` — `playwright.config.ts` matches `visual/**/*.visual.ts`.
- Always assert with `expect(page).toHaveScreenshot(...)`. Tolerance is configured centrally
  (`maxDiffPixelRatio: 0.02` in `playwright.config.ts`); never override it per-test.
- Screenshot only deterministic UI. The BFF gateway serves mock fixtures
  (`SERVER_API_MOCKING=enabled` is set in the Playwright `webServer` env), so data is stable —
  but mask or avoid anything time-relative (e.g. copy from `formatRelativeToNow`).
- Name snapshots explicitly: `toHaveScreenshot('articles-list-mobile-rtl-dark.png')`.

## Steps

1. Create `src/tests/visual/<subject>.visual.ts`. Import `test, expect` from `@playwright/test`
   and navigate using paths that mirror `ROUTE_PATHS`
   (`src/shared/constants/route-paths.constants.ts`): `/`, `/login`, `/articles`, `/settings`,
   `/workbench`. The `/workbench` primitive showcase is the preferred subject for design-system
   snapshots (see [architecture/adrs/0002-component-workbench-over-storybook.md](../architecture/adrs/0002-component-workbench-over-storybook.md)).
2. Cover the three standard viewports with `page.setViewportSize` (the config runs a single
   `chromium` project, so viewports are set in-test):
   - desktop `{ width: 1280, height: 800 }`
   - tablet `{ width: 768, height: 1024 }`
   - mobile `{ width: 390, height: 844 }`
3. Cover LTR and RTL. Locale is cookie-based: `LOCALE_COOKIE_NAME` in `src/packages/i18n` is
   `'NEXT_LOCALE'`, with supported values `en` and `ar`. Seed it before navigation:

   ```ts
   await context.addCookies([{ name: 'NEXT_LOCALE', value: 'ar', url: 'http://localhost:3000' }]);
   ```

   `ar` renders with `dir="rtl"` on the document; assert the flipped layout with its own snapshot.

4. Cover the dark theme through the product, not by hacking the DOM: navigate to `/settings`
   (the `UiPreferencesContainer` screen from `src/modules/ui-preferences`), activate the dark
   theme control, then navigate to the subject page and screenshot. Theme is applied as
   `[data-theme='dark']` on the root element by `useUiPreferencesEffects` and persists via
   `STORAGE_KEYS.uiPreferences` (`'snr.ui-preferences.v1'`), so it survives the navigation.
5. Wait for stability before every screenshot: `await page.waitForLoadState('networkidle')` and,
   where content streams in, an explicit `expect(locator).toBeVisible()` on the last element.
6. After inspecting the expected missing-snapshot failure, generate current-OS baselines:

   ```sh
   npm run test:e2e:baseline
   ```

   Then run `npm run test:visual` again and confirm it passes with zero diffs.

## Per-platform baselines policy

- Playwright suffixes snapshot files per platform (`-chromium-win32.png`, `-chromium-linux.png`,
  ...). CI (`.github/workflows/e2e.yml`) runs on Linux, so **Linux baselines are the source of
  truth** and are the ones committed. Local Windows/macOS baselines exist only to speed up local
  iteration; refresh them explicitly with `npm run test:e2e:baseline`.
- Never run a bare `--update-snapshots` to make a red suite green. A diff is a finding: either
  the UI change is intended (update the specific baseline and say so in the PR) or it is a
  regression (fix the code). Blanket baseline refreshes MUST be their own commit with the visual
  change described.
- CI MUST be compare-only. It never passes an `--update-snapshots` flag.

## Done when

- Each subject has desktop/tablet/mobile snapshots, an RTL variant, and a dark variant.
- `npm run test:visual` passes locally and no unrelated baseline changed in `git status`.
