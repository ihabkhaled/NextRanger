# Skill: Write Accessibility Tests

Accessibility specs are Playwright tests in `src/tests/accessibility/` with the `.a11y.ts`
suffix (`playwright.config.ts` matches `accessibility/**/*.a11y.ts`; run them alone with
`npm run test:a11y`). They combine an automated axe scan with scripted keyboard journeys —
the scan alone is not an accessibility test. Standard:
[testing/accessibility-testing-standard.md](../testing/accessibility-testing-standard.md);
doctrine: [rules/13-accessibility.md](../rules/13-accessibility.md).

## Steps

1. **Create the spec** at `src/tests/accessibility/<page>.a11y.ts`, one file per route
   (`login.a11y.ts`, `articles.a11y.ts`, `settings.a11y.ts`). The app runs against the
   mock-mode BFF gateway exactly as in [skills/write-e2e-tests.md](write-e2e-tests.md), so
   pages render with real data.
2. **Gate on the axe scan.** Use `AxeBuilder` from `@axe-core/playwright` after the page
   settles (assert a ready-state `TEST_IDS` element first so you never scan a spinner):

   ```ts
   import AxeBuilder from '@axe-core/playwright';

   const results = await new AxeBuilder({ page })
     .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
     .analyze();
   const seriousOrCritical = results.violations.filter(
     (violation) => violation.impact === 'serious' || violation.impact === 'critical',
   );

   expect(seriousOrCritical).toEqual([]);
   ```

   Zero serious/critical violations is the hard gate. Asserting the filtered array equals
   `[]` (not just `length`) prints the full violation objects on failure.

3. **Scan every meaningful state,** not just first paint: with the form's validation errors
   visible, with the error alert shown (drive it with
   `AUTH_MOCK_REJECTED_PASSWORD = 'wrong-password'`), and — for theme coverage — after
   switching to dark on `/settings` (`TEST_IDS.settingsTheme`), since contrast violations
   are theme-specific.
4. **Script the keyboard journey.** Every interactive flow MUST be completable without a
   pointer. For login:

   ```ts
   await page.keyboard.press('Tab'); // reach the skip link first
   ```

   Walk with `Tab`/`Shift+Tab`/`Enter`/`Space` through: skip-to-content link (the `app`
   namespace ships `skipToContent` copy targeting `LANDMARK_IDS`), nav, email, password,
   submit. Activate the submit with `Enter` and assert the flow completes — no
   mouse `click()` in the journey section.

5. **Assert focus explicitly** at each stop with `toBeFocused()`:

   ```ts
   await expect(page.getByTestId(TEST_IDS.loginEmail)).toBeFocused();
   ```

   Also assert focus behavior around dynamic UI: after a failed submit the error region
   (`TEST_IDS.loginError`, rendered with `role="alert"` by
   `src/shared/components/forms/form-field.component.tsx` wiring) is announced, and focus
   is never lost to `<body>` when content swaps.

6. **Cover RTL once per flow.** Switch direction via the settings screen
   (`TEST_IDS.settingsDirection`, backed by the ui-preferences module) and re-run the axe
   scan — the `dir` attribute flip can surface layout/contrast issues. Details:
   [rules/14-i18n-rtl.md](../rules/14-i18n-rtl.md).
7. **Run the gates.** `npm run test:a11y` locally; the suite runs in CI and any
   serious/critical finding blocks release
   ([testing/quality-gates.md](../testing/quality-gates.md)). Violations you cannot fix
   immediately require a documented exception in
   [docs/exceptions/](../docs/exceptions/README.md) — never a filtered-out rule.

## Definition of done

- `.a11y.ts` spec per route: axe scan (zero serious/critical) across default, error, dark,
  and RTL states, plus a full keyboard journey with `toBeFocused()` assertions.
