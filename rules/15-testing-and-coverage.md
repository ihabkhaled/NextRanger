# Rule 15 — Testing and Coverage

Testing here is TDD-shaped and gate-enforced. The full standards live under
[testing/](../testing/README.md); this rule is the normative summary every PR is held to.

## TDD flow

1. Write or extend the failing test first (unit for the layer you are changing; integration for a
   user flow).
2. Implement the minimum code to pass.
3. Refactor with the tests green; run `npm run test:coverage` before pushing (the
   `.husky/pre-push` hook runs `gate:push` regardless).

Skills: [skills/write-unit-tests.md](../skills/write-unit-tests.md),
[skills/write-integration-tests.md](../skills/write-integration-tests.md),
[skills/write-e2e-tests.md](../skills/write-e2e-tests.md).

## Test category matrix

| Category      | Location                            | Runner                         | Script                |
| ------------- | ----------------------------------- | ------------------------------ | --------------------- |
| Unit          | `src/modules/<feature>/test/`       | Vitest (jsdom)                 | `npm run test`        |
| Integration   | `src/tests/integration/`            | Vitest + `renderWithProviders` | `npm run test`        |
| E2E           | `src/tests/e2e/*.e2e.ts`            | Playwright                     | `npm run test:e2e`    |
| Accessibility | `src/tests/accessibility/*.a11y.ts` | Playwright + axe               | `npm run test:a11y`   |
| Visual        | `src/tests/visual/*.visual.ts`      | Playwright screenshots         | `npm run test:visual` |

Setup: [src/tests/setup/vitest.setup.ts](../src/tests/setup/vitest.setup.ts) (jest-dom, MSW server,
`server-only` mock). Integration rendering uses
[src/tests/helpers/render-with-providers.tsx](../src/tests/helpers/render-with-providers.tsx).

## Coverage thresholds (enforced in vitest.config.mts)

[vitest.config.mts](../vitest.config.mts) enforces:

- **95%** lines / statements / functions / branches globally over `src/modules`, `src/shared`,
  `src/packages`.
- **100%** on all four axes for `src/**/{utils,helpers,mappers,schemas}/**` and for query-key
  builder files (`src/**/queries/*query-keys*.ts`). Pure functions have no excuse for untested
  branches.

Thresholds MUST never be lowered to make a PR pass. Full policy:
[testing/coverage-policy.md](../testing/coverage-policy.md).

## MSW is mandatory for API tests

Any test that exercises code touching `httpClient` MUST go through MSW — the node server at
[src/tests/msw/server.ts](../src/tests/msw/server.ts) with handlers in `src/tests/msw/handlers/`.
Never mock `httpClient`, a gateway function, or axios directly: mocking the transport hides
mapper/schema bugs that MSW-served fixtures catch. Fixtures policy:
[testing/test-data-and-fixtures.md](../testing/test-data-and-fixtures.md).

## Anti-patterns (each one blocks review)

- **No `.only`** and no skipped tests without a documented exception in
  [docs/exceptions/](../docs/exceptions/README.md). CI runs full suites only.
- **No snapshot-only component tests.** Snapshots may complement, never replace, behavioral
  assertions. Visual regressions belong in `src/tests/visual/`
  ([testing/visual-testing-standard.md](../testing/visual-testing-standard.md)).
- **No implementation-detail tests.** Component and container tests assert what the user sees and
  does (roles, accessible names, `TEST_IDS`) — never internal state, hook call counts, or private
  function spies.
- **No testing library internals.** Package wrappers are tested through their public exports; the
  vendor underneath is not re-tested.
- **No shared mutable fixtures.** Test data comes from factories in `src/tests/factories/`.

## Gates

`npm run test:coverage` is part of `npm run quality` and runs in `.github/workflows/ci.yml`;
Playwright suites run in `.github/workflows/e2e.yml`. See
[rules/19-release-gates.md](../rules/19-release-gates.md) and
[testing/quality-gates.md](../testing/quality-gates.md).
