# Rule 13 — Accessibility

Target: WCAG 2.2 AA. Accessibility is verified by an automated axe gate plus the review checklist —
not by good intentions.

## Landmarks and skip navigation

- Every page MUST expose proper landmarks: one `<main>`, identified by `LANDMARK_IDS.mainContent`
  from [src/shared/accessibility/landmark-ids.constants.ts](../src/shared/accessibility/landmark-ids.constants.ts).
  Landmark ids are constants, never string literals, so the skip link and layouts can never drift.
- The root layout MUST render `SkipLink`
  ([src/shared/components/primitives/skip-link.component.tsx](../src/shared/components/primitives/skip-link.component.tsx))
  as the first focusable element. It is visually hidden until focused and jumps to the main
  landmark. Note it uses `focus:start-4` — logical positioning, so it works in RTL too.

## Heading order

Each page has exactly one `h1`, and heading levels MUST descend without gaps (`h1 → h2 → h3`).
Never pick a heading level for its font size — sizes come from the design system variants, not
from the semantic level.

## Form fields: the FormField wiring pattern

All form fields MUST use `FormField`
([src/shared/components/forms/form-field.component.tsx](../src/shared/components/forms/form-field.component.tsx)):

- The label is bound via `htmlFor={props.fieldId}`.
- The error region renders with `id={`${props.fieldId}-error`}` and `role="alert"`.
- The control inside MUST set `aria-invalid={Boolean(error)}` and
  `aria-describedby={`${fieldId}-error`}` — see the reference wiring in
  [src/modules/auth/components/login-form.component.tsx](../src/modules/auth/components/login-form.component.tsx).
- Error copy is a translated message resolved from an i18n key, never raw text
  ([rules/14-i18n-rtl.md](../rules/14-i18n-rtl.md)).

## Keyboard operability

- Every interactive element MUST be reachable and operable by keyboard alone. Interactive elements
  are real `<button>`/`<a>` elements (via `Button` and `AppLink`), never `div onClick`.
- Focus MUST never be trapped, and custom `tabIndex` values greater than 0 are banned.
- Focus-visible styling comes from the primitives in
  [src/packages/ui-primitives](../src/packages/ui-primitives) — components MUST NOT remove or
  restyle focus rings locally (raw `className` outside the design system is banned by
  [no-inline-classname-outside-design-system](../docs/eslint/no-inline-classname-outside-design-system.md)).

## Toggle state is communicated, not just painted

Settings toggles (theme, direction) in
[src/modules/ui-preferences/containers/ui-preferences.container.tsx](../src/modules/ui-preferences/containers/ui-preferences.container.tsx)
set `aria-pressed={option.isSelected}` on each option button. Any control whose "on" state is only
a visual highlight MUST also expose that state through `aria-pressed`, `aria-checked`, or
`aria-selected` as appropriate.

## The axe gate

- Playwright accessibility specs live in `src/tests/accessibility/*.a11y.ts` and run
  `@axe-core/playwright` against every route; `npm run test:a11y` executes them and runs in
  `.github/workflows/e2e.yml`.
- Any axe violation of any impact level fails the gate. There are no "minor" violations —
  suppressing a specific finding requires an exception per
  [docs/exceptions/exception-template.md](../docs/exceptions/exception-template.md).
- Standard and examples: [testing/accessibility-testing-standard.md](../testing/accessibility-testing-standard.md),
  [skills/write-accessibility-tests.md](../skills/write-accessibility-tests.md).

## Review

Accessibility review follows [skills/accessibility-review.md](../skills/accessibility-review.md)
under the [agents/accessibility-reviewer.md](../agents/accessibility-reviewer.md) charter.
Decisions are recorded in [memory/accessibility-decisions.md](../memory/accessibility-decisions.md).
