# Accessibility Decisions

Rationale for the accessibility posture. Normative rules:
[rules/13-accessibility.md](../rules/13-accessibility.md); testing standard:
[testing/accessibility-testing-standard.md](../testing/accessibility-testing-standard.md).

## jsx-a11y strict preset, not recommended

- **Decision:** `eslint-plugin-jsx-a11y` runs with its **strict** preset on all JSX files
  (`eslint/accessibility.config.mjs`), under `--max-warnings=0` like everything else.
- **Rejected alternative:** the `recommended` preset, which downgrades several rules to warnings.
- **Why:** in a zero-warning repo, a warning is either an error or noise — strict makes the
  choice honest. Static linting is the cheapest accessibility gate (it fires in the editor and in
  lint-staged before code ever runs) and the strict delta mostly covers real defects like
  interactive elements without keyboard handlers. Any genuinely wrong rule firing gets a
  documented exception in [docs/exceptions/](../docs/exceptions/README.md), never a preset
  downgrade.

## axe fail bar: serious + critical

- **Decision:** Playwright accessibility specs (`src/tests/accessibility/*.a11y.ts`, run via
  `npm run test:a11y`) scan pages with `@axe-core/playwright` and fail the build on any violation
  of impact `serious` or `critical`. `moderate` and `minor` findings are reported for triage but
  do not block.
- **Why:** serious/critical maps to "a user with a disability cannot complete the task" — that is
  release-blocking by the same logic as a functional bug. Making minor findings blocking on day
  one incentivizes blanket rule disabling; instead the bar can only ratchet upward: once a page
  scans clean at a level, regressions at that level MUST NOT be reintroduced. Zero known
  violations at any level is the standing target, tracked through the
  [docs/features/_template/10-accessibility-review.md](../docs/features/_template/10-accessibility-review.md)
  gate.

## Skip link + landmark ids

- **Decision:** the root layout (`src/app/layout.tsx`) renders `SkipLink`
  (`src/shared/components/primitives/skip-link.component.tsx`) as the first focusable element,
  targeting `LANDMARK_IDS.mainContent` from
  `src/shared/accessibility/landmark-ids.constants.ts`; its label is the translated
  `skipToContent` message (en and ar catalogs).
- **Why:** keyboard and screen-reader users otherwise tab through the entire header on every
  page. Centralizing landmark ids in `LANDMARK_IDS` keeps the skip target and the `main` landmark
  from drifting apart — the constant is the contract, and the a11y specs assert it works.

## `aria-pressed` toggle pattern

- **Decision:** stateful toggle controls are native `button` elements carrying `aria-pressed`,
  as in the theme/direction switches of
  `src/modules/ui-preferences/containers/ui-preferences.container.tsx`.
- **Rejected alternatives:** `role="switch"` retrofits, styled checkboxes, or state conveyed by
  color alone.
- **Why:** a native button is focusable, keyboard-activatable, and correctly announced with zero
  custom code; `aria-pressed` adds the on/off semantics. State MUST be encoded in the attribute —
  never only in a CSS class — so assistive tech and our tests read the same truth (specs assert
  on `aria-pressed`, not on styling).

## Focus-visible tokens

- **Decision:** focus indication is standardized as `focus-visible:outline-2
focus-visible:outline-offset-2 focus-visible:outline-ring` inside the design-system class
  bundles (`src/packages/ui-primitives/button.variants.ts`,
  `src/packages/ui-primitives/input.tsx`), where `outline-ring` resolves to the `--color-ring`
  token from `src/app/styles.css` in both themes.
- **Rejected alternatives:** `outline: none` resets, or `:focus`-based rings that flash on mouse
  clicks.
- **Why:** `:focus-visible` gives keyboard users an always-visible, theme-aware indicator without
  annoying pointer users. Because raw classNames are banned outside the design system
  (`no-inline-classname-outside-design-system`), the ring cannot be forgotten or restyled
  per-feature — every focusable primitive inherits it. The token contrast is validated against
  both the light and dark `--role-ring` values (see
  [ui-design-system-decisions.md](./ui-design-system-decisions.md)).

Review charter: [agents/accessibility-reviewer.md](../agents/accessibility-reviewer.md); hands-on
audit steps: [skills/accessibility-review.md](../skills/accessibility-review.md).
