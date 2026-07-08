# Testing Strategy — Decisions

Rationale behind the testing standard. The normative rules live in
[rules/15-testing-and-coverage.md](../rules/15-testing-and-coverage.md) and the
[testing/](../testing/README.md) corpus; this file records why the bars sit where they sit.

## Why 95% global / 100% pure-logic thresholds

- **Decision:** coverage thresholds in `vitest.config.mts` are 95% (lines, statements, functions,
  branches) across `src/modules/**`, `src/shared/**`, `src/packages/**`, and 100% for
  `src/**/{utils,helpers,mappers,schemas}/**` and `src/**/queries/*query-keys*.ts`.
- **Rejected alternative:** a flat 80% "industry default".
- **Why:** the architecture makes high coverage cheap where it matters. Pure layers (utils,
  helpers, mappers, schemas, query-key builders) are deterministic functions with no React and no
  I/O — every uncovered branch there is a real untested behavior, so 100% is the honest bar and
  is what keeps the mapper/wire-contract layer trustworthy. The 95% global bar leaves headroom
  for genuinely unreachable defensive branches without inviting "we'll test it later". Types,
  barrels (`index.ts`), and `test/` directories are excluded from the denominator so the number
  measures logic, not scaffolding. Full policy: [testing/coverage-policy.md](../testing/coverage-policy.md).

## Why MSW everywhere

- **Decision:** MSW v2 is the only HTTP fake, at every level — Vitest via the node server
  (`src/tests/msw/server.ts`, started in `src/tests/setup/vitest.setup.ts`) and Playwright via
  the BFF's own mock mode (`SERVER_API_MOCKING=enabled`, set in `playwright.config.ts`).
- **Rejected alternatives:** mocking `httpClient`/axios with `vi.mock`, hand-rolled fetch stubs.
- **Why:** MSW intercepts at the network boundary, so the axios wrapper, `normalizeToHttpError`,
  mappers, and `buildGatewayPath` are all exercised for real in every test — module mocks would
  quietly exempt exactly the layers most likely to break on contract drift. One handler
  vocabulary (`src/tests/msw/handlers/`) also means fixtures written for a unit test are reusable
  by integration tests. MSW is a test-only owned package: `src/tests/msw` is its wrapper.

## Why containers get integration tests, not unit tests

- **Decision:** `*.container.tsx` files are tested in `src/tests/integration` with
  `renderWithProviders` (`src/tests/helpers/render-with-providers.tsx`) and MSW; they get no
  isolated unit tests. Unit tests target hooks, services, mappers, schemas, and TSX-only
  components inside each module's `test/` directory.
- **Why:** a container's whole job is wiring — hooks in, view models out, loading/error/empty/ready
  switching (see `src/modules/articles/containers/articles-list.container.tsx`). Unit-testing a
  container means mocking every hook it exists to connect, which asserts implementation shape,
  not behavior, and breaks on every refactor. The integration test renders the container against
  MSW and asserts what a user sees — the only contract a container has. Standards:
  [testing/integration-testing-standard.md](../testing/integration-testing-standard.md),
  [testing/unit-testing-standard.md](../testing/unit-testing-standard.md).

## Why visual baselines are per-platform

- **Decision:** Playwright visual specs (`src/tests/visual/*.visual.ts`) keep screenshot
  baselines per OS/browser platform; CI (Linux) baselines are the source of truth and the diff
  tolerance is `maxDiffPixelRatio: 0.02` (`playwright.config.ts`).
- **Rejected alternative:** one shared baseline set for all machines.
- **Why:** font rasterization, subpixel antialiasing, and scrollbar metrics differ between
  Windows, macOS, and Linux — a shared baseline forces either a tolerance so loose it misses real
  regressions or permanent local failures on developer machines. Playwright's platform-suffixed
  snapshot names make per-platform storage native. When a visual test fails only locally, trust
  CI and regenerate locally instead of widening the tolerance. Standard:
  [testing/visual-testing-standard.md](../testing/visual-testing-standard.md).

## Standing constraints

- No `.only` (enforced by `forbidOnly` in CI Playwright config and lint); no skipped tests
  without a documented exception in [docs/exceptions/](../docs/exceptions/README.md).
- Component tests assert user-visible behavior only — queries by role/label/test id from
  `TEST_IDS`, never by internal state.
- The full gate order is `npm run quality` then `npm run validate`; see
  [testing/quality-gates.md](../testing/quality-gates.md).
