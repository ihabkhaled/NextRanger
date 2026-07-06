# Testing Strategy

This repository runs a five-layer pyramid. Every layer has a distinct owner, a distinct runner,
and a distinct failure meaning. A defect must be caught at the _lowest_ layer capable of
expressing it — an e2e test that re-proves a mapper edge case is misplaced effort.

## The pyramid

| Layer         | Runner                              | Location                                                                      | Owns                                                                                                                                              |
| ------------- | ----------------------------------- | ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| Unit          | Vitest (jsdom)                      | `src/modules/<feature>/test/`, plus tests for `src/shared` and `src/packages` | Pure logic: utils, helpers, mappers, schemas, query-key builders, services, store logic, hooks in isolation.                                      |
| Integration   | Vitest (jsdom) + MSW                | `src/tests/integration/`                                                      | Container-to-network slices: a container rendered through `renderWithProviders`, talking to MSW handlers, asserted through user-visible behavior. |
| End-to-end    | Playwright                          | `src/tests/e2e/*.e2e.ts`                                                      | Real routes on a production build with the mocked BFF gateway: navigation, forms, session flows.                                                  |
| Accessibility | Playwright + `@axe-core/playwright` | `src/tests/accessibility/*.a11y.ts`                                           | Automated axe scans and keyboard-path specs per route.                                                                                            |
| Visual        | Playwright screenshots              | `src/tests/visual/*.visual.ts`                                                | Rendering regressions across viewports, locales/direction, and themes.                                                                            |

Volume follows the pyramid shape: many unit tests, a focused set of integration tests per
feature flow, and a small number of e2e/a11y/visual specs per route.

## What each layer must NOT do

- Unit tests MUST NOT mount providers or hit MSW; if a test needs the query client and network,
  it is an integration test and belongs in `src/tests/integration/`.
- Integration tests MUST NOT assert implementation details (hook call counts, internal state
  shapes). They assert what a user sees and does — see
  [integration-testing-standard.md](integration-testing-standard.md).
- E2e tests MUST NOT re-enumerate data edge cases already covered below. One happy path plus the
  critical negative path (e.g. the auth sentinel `AUTH_MOCK_REJECTED_PASSWORD` in
  `src/modules/auth`) per flow.
- No layer ever mocks a module's own internals to force a branch. Unreachable branches are a
  design problem, not a mocking opportunity — see [coverage-policy.md](coverage-policy.md).

## TDD workflow

New logic in `utils/`, `helpers/`, `mappers/`, `schemas/`, or `queries/*query-keys*` files MUST
be written test-first. The workflow:

1. Name the behavior. Write the `describe`/`it` sentences before any implementation exists,
   e.g. `sortArticlesByNewest keeps unpublished articles last in stable order`.
2. Write the failing test in the module `test/` directory using real-shaped data from
   `src/tests/factories` (see [test-data-and-fixtures.md](test-data-and-fixtures.md)).
3. Run `npm run test:watch` and confirm the test fails for the _right reason_ (assertion
   mismatch, not import error).
4. Implement the smallest code that passes. No speculative parameters, no extra branches.
5. Refactor with the watcher green. Extract helpers only when a second caller exists.
6. Run `npm run test:coverage` and confirm the file meets its threshold — 100% branches for the
   pure-logic globs listed in [coverage-policy.md](coverage-policy.md).
7. Add the integration or e2e spec only if the change altered a user-visible flow, not for
   internal refactors.

For UI layers (components, containers), tests are written alongside the implementation rather
than strictly first, but they MUST exist before the pull request is opened and MUST assert
user-visible behavior only.

## Where to go next

- Authoring steps per layer: [skills/write-unit-tests.md](../skills/write-unit-tests.md),
  [skills/write-integration-tests.md](../skills/write-integration-tests.md),
  [skills/write-e2e-tests.md](../skills/write-e2e-tests.md),
  [skills/write-accessibility-tests.md](../skills/write-accessibility-tests.md),
  [skills/write-visual-tests.md](../skills/write-visual-tests.md).
- Enforcement: [quality-gates.md](quality-gates.md) and
  [docs/sdlc/qa-baseline.md](../docs/sdlc/qa-baseline.md).
