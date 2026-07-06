# Testing Standards

Normative testing documentation for strict-next-ranger. These documents define how every test in
this repository is written, where it lives, and which gates it must pass. The rulebook summary
lives in [rules/15-testing-and-coverage.md](../rules/15-testing-and-coverage.md); step-by-step
authoring workflows live in the [skills/](../skills/README.md) catalog.

## Index

| Document                                                               | Covers                                                                                                 |
| ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| [testing-strategy.md](testing-strategy.md)                             | The test pyramid for this repo, what each layer owns, and the TDD workflow.                            |
| [unit-testing-standard.md](unit-testing-standard.md)                   | Vitest unit tests: naming, module `test/` directories, table-driven style, pure-logic branch coverage. |
| [integration-testing-standard.md](integration-testing-standard.md)     | Cross-layer tests with `renderWithProviders`, the MSW server lifecycle, and user-event discipline.     |
| [e2e-testing-standard.md](e2e-testing-standard.md)                     | Playwright end-to-end tests against the production build with the mocked BFF gateway.                  |
| [accessibility-testing-standard.md](accessibility-testing-standard.md) | Automated axe gates, keyboard specs, and the manual checklist that complements them.                   |
| [visual-testing-standard.md](visual-testing-standard.md)               | Screenshot policy: viewports, LTR/RTL, dark mode, diff tolerance, baseline management.                 |
| [coverage-policy.md](coverage-policy.md)                               | Exact thresholds from `vitest.config.mts`, exclusions, and the no-fake-coverage doctrine.              |
| [test-data-and-fixtures.md](test-data-and-fixtures.md)                 | Factories, module mock fixtures, MSW handlers as API truth, no inline magic data.                      |
| [quality-gates.md](quality-gates.md)                                   | Gate → npm script → CI job → blocking status, including git hooks.                                     |

## Ground rules that apply to every document above

- Tests are part of the definition of done. A feature without tests at every applicable layer
  does not merge.
- `.only` never ships; skipped tests require a documented exception in
  [docs/exceptions/](../docs/exceptions/README.md).
- Test ids come from `TEST_IDS` in `src/shared/constants/test-ids.constants.ts` — raw testid
  strings are a violation in both components and specs.
- The rationale behind these choices is recorded in
  [memory/testing-strategy.md](../memory/testing-strategy.md).
