# Skill: Accessibility Review

Run this on every UI-touching diff. Automated checks catch roughly half of real issues, so this
skill is deliberately manual + automated. Policy: [rules/13-accessibility.md](../rules/13-accessibility.md)
and [testing/accessibility-testing-standard.md](../testing/accessibility-testing-standard.md);
delegate diff reviews to [agents/accessibility-reviewer.md](../agents/accessibility-reviewer.md).

## Automated pass

1. Run the axe suite:

   ```sh
   npm run test:a11y
   ```

   This executes the Playwright specs in `src/tests/accessibility/*.a11y.ts`, which scan each
   route with `@axe-core/playwright`. Zero violations is the bar — an axe finding is a failing
   gate, not a warning.

2. If the diff adds a route or a significant screen state (error, empty, dialog open), add a
   corresponding `.a11y.ts` spec first — see
   [skills/write-accessibility-tests.md](write-accessibility-tests.md).
3. Run `npm run lint`: `eslint-plugin-jsx-a11y` is part of the flat config and runs with
   `--max-warnings=0`, so static JSX issues (missing labels, invalid roles) already fail here.

## Manual pass

4. **Keyboard walk.** Start the app (`npm run dev`), put the mouse away, and traverse the
   affected screen with Tab / Shift+Tab / Enter / Space / Escape / arrows. Every interactive
   element MUST be reachable in a sensible order, operable, and show a visible focus indicator.
   Anything mouse-only fails the review.
5. **Focus management.** After route changes, form submission errors, and toast/dialog
   appearance, verify focus lands somewhere meaningful and is never lost to `<body>`. Forms built
   with `useAppZodForm` surface errors via i18n message keys — confirm the first invalid field
   receives focus and its error text is programmatically associated (the login form in
   `src/modules/auth` is the reference).
6. **Landmarks and structure.** Pages hang off the shared landmarks (`LANDMARK_IDS` in
   `src/shared/`) — one `main`, headings in order without skipped levels, lists as lists.
7. **Contrast.** Check text and interactive states against WCAG AA (4.5:1 body, 3:1 large
   text/UI) in **both themes** — dark is a first-class theme via `[data-theme='dark']`, tokens in
   `src/app/styles.css`. New colors MUST be tokens, not one-off hex values (which
   [docs/eslint/no-inline-classname-outside-design-system.md](../docs/eslint/no-inline-classname-outside-design-system.md)
   already makes hard to sneak in).
8. **RTL.** Flip to Arabic (locale cookie `NEXT_LOCALE=ar`) and repeat the keyboard walk:
   direction-dependent icons, focus order, and truncation all behave under `dir="rtl"`. See
   [rules/14-i18n-rtl.md](../rules/14-i18n-rtl.md).
9. **Reduced motion.** Any new animation MUST respect `prefersReducedMotion` from
   `src/packages/browser` or the equivalent CSS media query.
10. **Names for machines.** Interactive elements need accessible names sourced from i18n messages
    (raw strings are blocked by
    [docs/eslint/no-raw-i18n-text.md](../docs/eslint/no-raw-i18n-text.md)); icon-only buttons from
    `src/packages/icons` MUST carry an explicit label.

## Done when

`npm run test:a11y` and `npm run lint` are green, the keyboard walk completes with no dead ends in
both LTR and RTL, both themes meet contrast, and any new screen state has an axe spec covering it.
