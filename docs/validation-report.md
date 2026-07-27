# Final Validation Report — Strict Next Ranger

Date: 2026-07-08 · Validator: architectural tightening pass (release-gatekeeper protocol from
[skills/final-validation.md](../skills/final-validation.md))

## Gate results

| Gate                | Command                     | Result                                                                                                                        |
| ------------------- | --------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Install             | `npm install`               | ✅ clean, **0 vulnerabilities**                                                                                               |
| Playwright browsers | `npm run test:e2e:install`  | ✅ Chromium binary installed (one-time per environment)                                                                       |
| Format              | `npm run format:check`      | ✅                                                                                                                            |
| Lint                | `npm run lint`              | ✅ `--max-warnings=0`, 14 custom rules active                                                                                 |
| Typecheck           | `npm run typecheck`         | ✅ tsgo over app/test/node configs, strict family enabled                                                                     |
| Unit + integration  | `npm run test:coverage`     | ✅ **189/189 tests**; coverage 99.42% stmts / 98.42% branch / 100% funcs / 99.4% lines (thresholds 95 global, 100 pure logic) |
| Build               | `npm run build`             | ✅ Next 16 + Turbopack, 8 routes + proxy                                                                                      |
| E2E + a11y + visual | `npm run test:e2e`          | ✅ **33/33 Playwright tests** (18 e2e, 9 a11y, 6 visual)                                                                      |
| npm audit           | `npm run security:audit`    | ✅ 0 vulnerabilities (`--audit-level=low`)                                                                                    |
| Trivy               | `npm run security:scan`     | ✅ 0 vuln / 0 secret / 0 misconfig                                                                                            |
| Dead code           | `npm run quality:dead-code` | ✅ knip clean                                                                                                                 |
| Circular deps       | `npm run quality:circular`  | ✅ madge: none                                                                                                                |
| Aggregate           | `npm run quality`           | ✅ lint + typecheck + coverage + build                                                                                        |
| Full gate           | `npm run validate`          | ✅ quality + e2e + security scans + dead code + circular                                                                      |

## Forbidden-pattern audit (all zero hits in src/ + eslint/)

`eslint-disable` · `@ts-ignore` / `@ts-expect-error` / `@ts-nocheck` · `: any` / `as any` ·
TS `enum` declarations · raw vendor imports outside owner wrappers · React hooks inside
`*.component.tsx` · `process.env` outside env/config/tests · raw browser APIs in
modules/shared.

## Bugs the gates caught during validation (fixed, not suppressed)

1. **RTL regression:** `UiPreferencesEffects` overwrote the server-rendered `dir="rtl"` with
   the store default on mount. Fixed by gating DOM sync on hydration and adopting the
   locale-derived document direction on first visit (caught by `i18n-rtl.e2e.ts`).
2. **WCAG AA contrast:** the light-theme success/warning role tokens failed 4.5:1 on tint
   backgrounds. Tokens darkened in `src/app/styles.css` (caught by the axe gate).
3. **Unhandled login rejection:** `mutateAsync` escaping through the form submit handler;
   switched to callback-based `mutate` (caught by Vitest unhandled-error detection).

## Documented deviations from the generation spec

| Deviation                                                                | Reason                                                                                                       | Record                       |
| ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------ | ---------------------------- |
| ESLint pinned to 9.x (not 10)                                            | jsx-a11y and half the plugin ecosystem do not support ESLint 10 yet                                          | memory/known-pitfalls.md     |
| TypeScript pinned to 5.9 (not 6)                                         | madge/typescript-eslint peer ranges cap at <6.1 / ^5.4                                                       | memory/known-pitfalls.md     |
| `eslint-plugin-vitest` → `@vitest/eslint-plugin`                         | official successor package                                                                                   | memory/package-decisions.md  |
| unicorn pinned to ^65                                                    | v66+ requires ESLint ≥10.4                                                                                   | memory/known-pitfalls.md     |
| knip pinned to ^5                                                        | knip 6 requires the oxc native module, blocked by Windows Application Control on the build machine           | memory/known-pitfalls.md     |
| Storybook replaced by `/workbench` route                                 | zero-dependency showcase compiled by the same toolchain                                                      | architecture/adrs/0002       |
| `axe-core` direct dep removed                                            | provided transitively by `@axe-core/playwright`; direct copy was unused (knip)                               | this report                  |
| nested `postcss` vulnerability                                           | fixed via npm `overrides` (upgrade, not suppression)                                                         | memory/security-decisions.md |
| `sonarjs/no-hardcoded-passwords`, `security/detect-object-injection` off | false-positive-only for this codebase; secret scanning owned by Trivy, injection risk owned by TS strictness | docs/exceptions/README.md    |

## Known limitations / setup notes

- Visual baselines are per-platform. CI is compare-only: missing or changed Linux snapshots fail
  the gate. `npm run test:e2e:baseline` explicitly refreshes all current-OS snapshots and is used
  only after an intentional diff has been inspected. The committed Linux baselines remain the
  source of truth — see testing/visual-testing-standard.md.
- The e2e web server runs on dedicated port 3100; the gateway serves fixtures
  (`SERVER_API_MOCKING=enabled`) so no backend is required.
- `npm run validate` chains every gate and is the single handoff command. It requires the two
  one-time local Playwright steps first: `npm run test:e2e:install` (Chromium binary) and
  `npm run test:e2e:baseline` only when an intentional visual change requires reviewed,
  current-OS baselines.
