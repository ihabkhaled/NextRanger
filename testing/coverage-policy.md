# Coverage Policy

Coverage is measured by Vitest's v8 provider and enforced as build-breaking thresholds in
`vitest.config.mts`. `npm run test:coverage` fails — locally and in CI — when any threshold is
missed. Reports: `text`, `html`, `lcov`.

## Exact thresholds (from `vitest.config.mts`)

```ts
thresholds: {
  lines: 95,
  statements: 95,
  functions: 95,
  branches: 95,
  'src/**/{utils,helpers,mappers,schemas}/**/*.ts': {
    lines: 100,
    statements: 100,
    functions: 100,
    branches: 100,
  },
  'src/**/queries/*query-keys*.ts': {
    lines: 100,
    statements: 100,
    functions: 100,
    branches: 100,
  },
},
```

- **Global: 95%** lines/statements/functions/branches across everything measured.
- **Pure logic: 100%** for every file under a `utils/`, `helpers/`, `mappers/`, or `schemas/`
  directory anywhere in `src`, and for query-key builder files
  (e.g. `src/modules/articles/queries/article-query-keys.ts`). These files are deterministic
  functions with no environment excuses — an untested branch there is an untested business rule.

## What is measured, what is excluded, and why

Coverage `include` is `src/modules/**`, `src/shared/**`, `src/packages/**` — the code we own.
Excluded:

| Exclusion                                     | Why                                                                                                                                                            |
| --------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `**/*.test.ts`, `**/*.test.tsx`, `**/test/**` | Test code is not product code; counting it inflates numbers.                                                                                                   |
| `**/types/**`, `**/*.types.ts`                | Type-only files emit no runtime statements; "covering" them is noise.                                                                                          |
| `**/index.ts`                                 | Barrel files (module public surfaces like `src/modules/articles/index.ts`) are re-exports with no logic. Excluding them keeps the public-surface pattern free. |

`src/app` (routes/layouts) and `src/tests` are outside `include`: route files are thin
composition proven by Playwright suites, and test infrastructure is exercised by every run.

## No fake coverage

Thresholds measure execution, not verification. The following are violations regardless of the
resulting percentage:

- **Assertion-free execution.** A test that renders or calls code without asserting its
  observable outcome adds coverage and zero protection. Every `it` block MUST contain at least
  one meaningful assertion.
- **Snapshotting logic.** `toMatchSnapshot` on computed objects to "cover" branches hides the
  contract. Assert explicit values (see the mapper examples in
  [unit-testing-standard.md](unit-testing-standard.md)).
- **Mocking to reach branches.** Mocking a module's own internals to force an otherwise
  unreachable branch means the branch is dead code — delete it (knip and review will find it
  anyway) or redesign so it is reachable.
- **Exclusion creep.** Adding files to `coverage.exclude`, or `/* v8 ignore */` comments,
  requires a documented exception in [docs/exceptions/](../docs/exceptions/README.md), exactly
  like an `eslint-disable`.
- **Threshold edits.** Lowering any number in `vitest.config.mts` is an architecture decision,
  not a PR-level fix. It requires an ADR
  ([architecture/adrs/README.md](../architecture/adrs/README.md)).

## Working with the policy

- Write pure logic test-first ([testing-strategy.md](testing-strategy.md)) and 100% falls out
  naturally; chasing coverage after the fact is the smell this policy exists to prevent.
- Check the HTML report (`coverage/index.html` after `npm run test:coverage`) to find missed
  branches — uncovered lines in a mapper or util are always a missing input class in the
  test table.
- Enforcement points: pre-push runs the test suite, and CI runs `test:coverage` as a blocking
  job — see [quality-gates.md](quality-gates.md).
