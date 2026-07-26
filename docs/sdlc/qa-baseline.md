# QA Baseline

Defines the minimum test evidence per change type and the gate matrix. The full testing doctrine lives in [testing/testing-strategy.md](../../testing/testing-strategy.md); this document is the policy view a reviewer enforces on every PR.

## Standing gates (every change, no exceptions)

Every PR MUST pass, locally and in CI:

- `npm run lint` — ESLint with `--max-warnings=0`, error-only severity, and 14 `frontend-architecture` rules.
- `npm run typecheck` — stable TypeScript 7 over `tsconfig.app.json`, `tsconfig.test.json`, `tsconfig.node.json`.
- `npm run test:coverage` — Vitest with thresholds from `vitest.config.mts`: 95% global lines/statements/functions/branches, 100% for utils, helpers, mappers, schemas, and query-key builders.
- `npm run build` — the four together are `npm run quality`.

`.only` in any test file and skipped tests without a documented exception are merge blockers (see [testing/quality-gates.md](../../testing/quality-gates.md)).

## Test evidence per change type

| Change type                                                  | Required evidence                                                                                                                                                                                                      |
| ------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| New util / helper / mapper / schema / query-key builder      | Unit tests to 100% coverage in `src/modules/<f>/test/` or alongside shared code ([testing/unit-testing-standard.md](../../testing/unit-testing-standard.md)).                                                          |
| New or changed hook / container                              | Unit tests with MSW handlers (`src/tests/msw/handlers/`) covering loading, error, empty, and ready states.                                                                                                             |
| New or changed component (`*.component.tsx`)                 | RTL tests asserting user-visible behavior only — no implementation details ([rules/15-testing-and-coverage.md](../../rules/15-testing-and-coverage.md)).                                                               |
| Cross-module flow (e.g. login → redirect)                    | Integration test in `src/tests/integration` using `renderWithProviders` from `src/tests/helpers/render-with-providers.tsx` ([testing/integration-testing-standard.md](../../testing/integration-testing-standard.md)). |
| New route or user journey                                    | Playwright e2e spec in `src/tests/e2e/*.e2e.ts` (`npm run test:e2e`).                                                                                                                                                  |
| Any new screen or interactive widget                         | Axe scan in `src/tests/accessibility/*.a11y.ts` (`npm run test:a11y`) per [testing/accessibility-testing-standard.md](../../testing/accessibility-testing-standard.md).                                                |
| Design-system primitive or variant change                    | Visual spec in `src/tests/visual/*.visual.ts` (`npm run test:visual`) — baselines reviewed, not blindly regenerated.                                                                                                   |
| Copy / i18n key change                                       | Both `en.json` and `ar.json` updated; affected a11y and e2e specs re-run (assertions use `TEST_IDS`, not copy strings).                                                                                                |
| Package wrapper change (`src/packages/*`)                    | Wrapper unit tests plus a re-run of every module suite that consumes it.                                                                                                                                               |
| Config-only change (`next.config.ts`, `eslint/*`, tsconfigs) | Full `npm run quality`; for security headers additionally `npm run test:e2e` (headers asserted end to end).                                                                                                            |

## Regression policy

- Every production bug MUST land with a failing-first regression test at the lowest level that reproduces it. A fix without a test is an incomplete fix.
- Regression tests are never deleted when the code they cover is refactored — they move with it.
- Recurring bug classes MUST be recorded in [memory/known-pitfalls.md](../../memory/known-pitfalls.md) and, where mechanically checkable, proposed as a new rule in `eslint/architecture-plugin/rules/`.

## Gate matrix by risk class

Risk classes are defined in [risk-baseline.md](./risk-baseline.md).

| Gate                                              | Low                   | Medium        | High |
| ------------------------------------------------- | --------------------- | ------------- | ---- |
| `npm run quality`                                 | MUST                  | MUST          | MUST |
| `npm run test:e2e`                                | CI-scheduled          | MUST          | MUST |
| `npm run test:a11y`                               | if UI touched         | MUST          | MUST |
| `npm run test:visual`                             | if primitives touched | if UI touched | MUST |
| `npm run security:audit` + `security:scan`        | CI-scheduled          | MUST          | MUST |
| `npm run quality:dead-code` + `quality:circular`  | CI-scheduled          | MUST          | MUST |
| Manual UAT ([uat-baseline.md](./uat-baseline.md)) | —                     | optional      | MUST |

The complete pre-release gate is `npm run validate`; it MUST be green before any release regardless of class ([release-checklist.md](./release-checklist.md)).
