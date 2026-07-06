# 06 — Test Strategy

> Decide what gets tested at which level before writing code. The layer-to-test-level mapping is defined in [testing/testing-strategy.md](../../../testing/testing-strategy.md); coverage floors come from [testing/coverage-policy.md](../../../testing/coverage-policy.md) and are enforced in vitest.config.mts (95% global; 100% for utils/helpers/mappers/schemas and query-key builders).

## Test matrix

<One row per planned source file from stage 04. Unit tests live in `src/modules/<slug>/test/`; integration tests in `src/tests/integration/`; Playwright specs in `src/tests/e2e/*.e2e.ts`, `src/tests/accessibility/*.a11y.ts`, `src/tests/visual/*.visual.ts`.>

| Source file                       | Unit | Integration | E2E | A11y | Visual               | Notes                              |
| --------------------------------- | ---- | ----------- | --- | ---- | -------------------- | ---------------------------------- |
| <mappers/<slug>.mapper.ts>        | 100% | —           | —   | —    | —                    | wire→domain table-driven           |
| <schemas/<slug>.schema.ts>        | 100% | —           | —   | —    | —                    | valid + each failure mode          |
| <queries/<slug>-query-keys.ts>    | 100% | —           | —   | —    | —                    | key shape snapshot-free assertions |
| <hooks/use-<slug>.hook.ts>        | yes  | —           | —   | —    | —                    | MSW-backed via renderWithProviders |
| <containers/<slug>.container.tsx> | —    | yes         | —   | —    | —                    | loading/error/empty/ready          |
| <route flow>                      | —    | —           | yes | yes  | <if visual-critical> | happy path + one failure path      |

## Acceptance-criteria traceability

<Every acceptance criterion from 02-product-requirements.md maps to at least one test. Untested criteria block the gate.>

| Criterion (story.criterion) | Test level    | Planned test file                                   |
| --------------------------- | ------------- | --------------------------------------------------- |
| <1.1>                       | <integration> | <src/tests/integration/<slug>.integration.test.tsx> |

## Test data and mocking

- **MSW handlers:** <new handlers under src/tests/msw/handlers/ mirroring the gateway endpoints; register with the node server in src/tests/msw/server.ts>
- **Factories/fixtures:** <factories under src/tests/factories/ and module mock data reused from `api/<slug>.mock.ts` — see testing/test-data-and-fixtures.md>
- **Negative-path sentinels:** <deterministic failure triggers, in the spirit of AUTH_MOCK_REJECTED_PASSWORD in the auth module>

## Level-specific notes

- **Unit (Vitest, jsdom):** follow [skills/write-unit-tests.md](../../../skills/write-unit-tests.md) and [testing/unit-testing-standard.md](../../../testing/unit-testing-standard.md). Component tests assert user-visible behavior only — no implementation details.
- **Integration:** render through `renderWithProviders` (src/tests/helpers/render-with-providers.tsx) per [skills/write-integration-tests.md](../../../skills/write-integration-tests.md).
- **E2E / A11y / Visual (Playwright):** follow [skills/write-e2e-tests.md](../../../skills/write-e2e-tests.md), [skills/write-accessibility-tests.md](../../../skills/write-accessibility-tests.md) (axe scans via @axe-core/playwright), [skills/write-visual-tests.md](../../../skills/write-visual-tests.md). Select elements by TEST_IDS or roles, never CSS classes.

## Explicit non-goals

<What is deliberately not tested at a given level and why — e.g. "no visual test: screen composes only existing primitives already covered by the workbench visual suite".>

## Gate

- [ ] Every acceptance criterion traced to a test
- [ ] 100%-coverage layers (utils/helpers/mappers/schemas/query-keys) have exhaustive unit plans
- [ ] MSW handler and fixture plan written
- [ ] No `.only`, no skipped tests planned without a documented exception

**Signed off by:** <name> — <YYYY-MM-DD>
