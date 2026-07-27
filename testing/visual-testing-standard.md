# Visual Testing Standard

Visual tests catch rendering regressions that functional assertions cannot express: layout
shifts, token drift, RTL mirroring bugs, dark-theme contrast breaks. Specs live in
`src/tests/visual/*.visual.ts` (suffix-matched by `playwright.config.ts`) and run with
`npm run test:visual` against the mocked production server.

## What gets a screenshot

- Every routed page in `ROUTE_PATHS` gets a full-page baseline in its **ready** state
  (fixtures loaded — the gateway serves deterministic module mocks such as
  `src/modules/articles/api/articles.mock.ts`, so screenshots are stable by construction).
- The localized workbench route (`src/app/[locale]/(workbench)/workbench/page.tsx`) is the design-system
  gate: it showcases every `src/packages/ui-primitives` primitive, so one screenshot set there
  covers `Button`, `Input`, `Card`, `Alert`, `Skeleton`, and friends without per-primitive
  specs. This is the visual arm of ADR
  [architecture/adrs/0002-component-workbench-over-storybook.md](../architecture/adrs/0002-component-workbench-over-storybook.md).
- Distinct UI states that users actually reach (e.g. the articles error state, the login
  validation errors) MAY get targeted element screenshots when a functional assertion cannot
  capture the regression risk.

## The capture matrix

Each screenshot spec MUST cover:

1. **Three viewports**, set via `page.setViewportSize` inside the spec (the config's single
   `chromium` project stays viewport-agnostic):
   - mobile `375×812`
   - tablet `768×1024`
   - desktop `1440×900`
2. **Both directions**: LTR (`en`) and RTL (`ar`). Direction is driven the way the app drives
   it — set the `NEXT_LOCALE` cookie (`LOCALE_COOKIE_NAME` from `src/packages/i18n`) before
   navigation so `dir="rtl"` and the Arabic catalog render for real. RTL screenshots are where
   mirroring bugs live; skipping them is not permitted.
3. **Both themes**: default and dark (`[data-theme='dark']` per `src/app/styles.css` tokens),
   toggled through the same mechanism as `useUiPreferencesStore` (root attribute), not by
   injecting ad-hoc CSS.

Name snapshots so the matrix is legible: `articles-desktop-ar-dark.png` etc. Playwright appends
the platform suffix automatically.

## Diff tolerance

`playwright.config.ts` sets the global gate:

```ts
expect: {
  toHaveScreenshot: {
    maxDiffPixelRatio: 0.02,
  },
},
```

At most 2% of pixels may differ. Do NOT raise this per-spec to silence a flaky screenshot — fix
the nondeterminism (animations, relative timestamps) instead. `formatRelativeToNow` output and
animations MUST be neutralized (fixed fixture dates already handle the former; disable
animations via reduced-motion emulation for the latter).

## Baseline management

- Baselines are committed to the repo next to the spec (Playwright's `*-snapshots/`
  directories). They are **per-platform**: Playwright suffixes snapshot names with browser and
  OS (e.g. `-chromium-linux.png`, `-chromium-win32.png`), and font rendering differs across OSes.
- **CI (Linux) baselines are the source of truth** because CI is the blocking gate. Generate or
  refresh them on the CI platform (or a matching Linux container), not from a Windows/macOS
  machine — cross-platform "updates" produce baselines CI can never match.

## First run on a new OS (fresh environment)

Because baselines are per-OS, a machine that has never run the visual suite has no baseline for
its platform. Install Chromium, then create the current-OS baselines explicitly:

```sh
npm run test:e2e:install   # playwright install chromium
npm run test:e2e:baseline  # playwright test src/tests/visual --update-snapshots=all
```

This command is intentionally destructive for current-OS snapshots: it refreshes all of them.
Review every resulting image and diff before committing. CI never updates snapshots; it only
compares the rendered application with the committed **Linux** source of truth.

## Update flow

1. Make the intentional UI change.
2. Run `npm run test:visual` and inspect the HTML report diffs — confirm every diff is the
   change you intended and nothing else.
3. Regenerate: `npm run test:e2e:baseline` on the CI platform or matching Linux container.
4. Commit the updated baselines **in the same PR as the UI change**, and call out the visual
   diff in the PR description so reviewers judge the screenshots, not just the code.

A baseline update commit with no corresponding source change is a red flag and MUST be rejected
in review. Authoring steps: [skills/write-visual-tests.md](../skills/write-visual-tests.md).
