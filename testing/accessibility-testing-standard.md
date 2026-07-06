# Accessibility Testing Standard

Accessibility is verified by two automated spec kinds plus a manual checklist. Automated specs
live in `src/tests/accessibility/*.a11y.ts` (Playwright, matched by the `*.a11y.ts` suffix in
`playwright.config.ts`) and run with `npm run test:a11y` against the same mocked production
server as e2e ([e2e-testing-standard.md](e2e-testing-standard.md)).

## Axe gate

Every routed page in `ROUTE_PATHS` (`src/shared/constants/route-paths.constants.ts` — `/`,
`/login`, `/articles`, `/settings`, `/workbench`) MUST have an axe scan spec using
`@axe-core/playwright`:

```ts
const results = await new AxeBuilder({ page }).analyze();
const blocking = results.violations.filter(
  (violation) => violation.impact === 'serious' || violation.impact === 'critical',
);
expect(blocking).toEqual([]);
```

- **Gate rule: zero `serious` and zero `critical` violations.** These impact levels are axe's
  classification for issues that make content unusable for some users (`critical`, e.g. images
  without alternatives, form fields without accessible names) or severely degrade the
  experience (`serious`, e.g. insufficient color contrast, focus not visible). They block merge.
- `moderate` and `minor` findings do not block, but MUST be triaged: fix them or record a
  reasoned entry in [docs/exceptions/](../docs/exceptions/README.md).
- Scans MUST run in both themes (default and `[data-theme='dark']` — contrast regressions are
  theme-specific) and SHOULD run in both directions for RTL-sensitive pages (locale `ar`,
  `dir="rtl"`), matching the matrix in
  [visual-testing-standard.md](visual-testing-standard.md).
- Rule exclusions in `AxeBuilder` (e.g. `.disableRules(...)`) are treated exactly like
  `eslint-disable`: forbidden without a documented exception.

## Keyboard specs

Axe cannot prove interaction, so each interactive flow gets a keyboard-only spec:

- Tab order reaches every interactive element in visual order; nothing focusable is hidden and
  nothing visible is unreachable.
- The login form (`TEST_IDS.loginEmail` → `TEST_IDS.loginPassword` → `TEST_IDS.loginSubmit`)
  is completable with keyboard alone: `Tab` traversal, `Enter` submits.
- Skip-to-content and landmark navigation work: landmark targets use `LANDMARK_IDS` from
  `src/shared` — assert focus actually moves, not just that the link exists.
- Focus is never trapped, and after async state changes (error alert, toast via
  `src/packages/toast`) focus and announcement behavior is asserted (`role="alert"` /
  `aria-live` content is visible to the accessibility tree).

Keyboard specs use `page.keyboard.press('Tab')` plus `toBeFocused()` assertions — never
synthetic `focus()` calls that skip real traversal.

## Manual checklist (complements, never replaces automation)

Automation catches roughly a third of WCAG issues. Before release
([docs/sdlc/release-checklist.md](../docs/sdlc/release-checklist.md)), a human verifies per
changed screen:

1. Screen-reader pass: headings, landmarks, and controls are announced meaningfully.
2. 200% browser zoom: no clipped content, no horizontal scroll on text content.
3. `prefers-reduced-motion` respected (facade: `prefersReducedMotion` in
   `src/packages/browser`).
4. Visible focus indicator on every interactive element, in both themes.
5. RTL (`ar` locale): reading order, icon mirroring, and focus order remain coherent.

Decision history lives in
[memory/accessibility-decisions.md](../memory/accessibility-decisions.md); rulebook version in
[rules/13-accessibility.md](../rules/13-accessibility.md); authoring steps in
[skills/write-accessibility-tests.md](../skills/write-accessibility-tests.md).
