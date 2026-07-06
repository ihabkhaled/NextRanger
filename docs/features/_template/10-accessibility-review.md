# 10 — Accessibility Review

> Run against the finished code by [agents/accessibility-reviewer.md](../../../agents/accessibility-reviewer.md) or a human reviewer following [skills/accessibility-review.md](../../../skills/accessibility-review.md). Norms are defined in [rules/13-accessibility.md](../../../rules/13-accessibility.md); RTL/i18n interplay in [rules/14-i18n-rtl.md](../../../rules/14-i18n-rtl.md).

## Review scope

- **Screens reviewed:** <routes>
- **Reviewer:** <name / agent>
- **Date:** <YYYY-MM-DD>

## Automated pass

- [ ] `npm run test:a11y` (Playwright + @axe-core/playwright specs in src/tests/accessibility/) passes with zero violations on every new/changed route. <Attach summary; new routes need their own *.a11y.ts spec per skills/write-accessibility-tests.md.>
- [ ] `npm run lint` clean — jsx-a11y findings count as failures under --max-warnings=0. <Confirm.>

## Manual checklist (from skills/accessibility-review.md)

### Structure and semantics

- [ ] Landmarks correct and unique; page content mounts inside the shared landmark structure (LANDMARK_IDS in src/shared). <Findings.>
- [ ] Heading hierarchy is sequential; the page has exactly one h1 and a title built with `buildPageTitle`. <Findings.>
- [ ] Interactive elements are real buttons/links (Button primitive, AppLink) — no clickable divs. <Findings.>

### Keyboard and focus

- [ ] Every interaction reachable and operable by keyboard alone; tab order matches visual order in both LTR and RTL. <Findings.>
- [ ] Focus visibly indicated (design-system focus tokens) and lands where stage 03 specified after navigation/submit/dismiss. <Findings.>
- [ ] No focus traps; toasts (AppToaster) do not steal focus. <Findings.>

### Forms and errors

- [ ] Inputs labeled via the Label primitive; errors from `useAppZodForm` are programmatically associated with their fields. <Findings.>
- [ ] Error/empty/loading states are announced or discoverable — loading uses Skeleton/Spinner with appropriate semantics. <Findings.>

### Content, media, and motion

- [ ] All `AppImage` usages have meaningful alt text (alt is mandatory in the wrapper); decorative icons from src/packages/icons are hidden from assistive tech. <Findings.>
- [ ] Color contrast meets AA in light and dark themes ([data-theme='dark']). <Findings.>
- [ ] Motion respects `prefersReducedMotion` (src/packages/browser) where animation is used. <Findings.>

### Localization

- [ ] Screen verified in Arabic with dir='rtl': reading order, mirrored directional icons, no clipped or overlapping text. <Findings.>

## Findings register

| #   | Severity                          | WCAG criterion | Finding   | Resolution                            |
| --- | --------------------------------- | -------------- | --------- | ------------------------------------- |
| 1   | <critical/serious/moderate/minor> | <e.g. 2.4.7>   | <finding> | <fixed in <commit> / exception filed> |

## Gate

- [ ] Zero axe violations on changed routes
- [ ] No unresolved critical/serious manual finding
- [ ] RTL pass completed in Arabic
- [ ] Durable lessons mirrored to memory/accessibility-decisions.md

**Signed off by:** <name> — <YYYY-MM-DD>
