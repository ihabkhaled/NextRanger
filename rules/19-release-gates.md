# Rule 19 — Release Gates

A release candidate is a commit on `main` with every gate green. Gates are executable — each maps
to an npm script in [package.json](../package.json) and runs in CI. Local, `npm run validate` is
the full pipeline in one command.

## The gate list

| #   | Gate                                    | Command                                         | Where it runs                               |
| --- | --------------------------------------- | ----------------------------------------------- | ------------------------------------------- |
| 1   | Lint (zero warnings)                    | `npm run lint` (`--max-warnings=0`)             | ci.yml, pre-commit (staged), pre-push       |
| 2   | Formatting                              | `npm run format:check`                          | ci.yml, pre-commit (staged write), pre-push |
| 3   | Localized social-asset drift            | `npm run assets:social:check`                   | ci.yml, `.husky/pre-push`                   |
| 4   | Typecheck (strict, 3 tsconfigs)         | `npm run typecheck` (TypeScript 7 + TS6 compat) | ci.yml, `.husky/pre-push`                   |
| 5   | Unit + integration with coverage 95/100 | `npm run test:coverage`                         | ci.yml, pre-push                            |
| 6   | Production build                        | `npm run build`                                 | ci.yml, pre-push (via `npm run quality`)    |
| 7   | E2E                                     | `npm run test:e2e`                              | `validate`, `.github/workflows/e2e.yml`     |
| 8   | Accessibility (axe, zero violations)    | `npm run test:a11y`                             | `validate` via `test:e2e`, e2e.yml          |
| 9   | Visual regression                       | `npm run test:visual`                           | `validate` via `test:e2e`, e2e.yml          |
| 10  | Dependency audit                        | `npm run security:audit`                        | ci.yml, security.yml, pre-push              |
| 11  | Trivy scan (vuln + secret + misconfig)  | `npm run security:scan`                         | local `validate`, security.yml              |
| 12  | Dead code                               | `npm run quality:dead-code` (knip)              | ci.yml, pre-push                            |
| 13  | Circular dependencies                   | `npm run quality:circular` (dependency-cruiser) | ci.yml, pre-push                            |
| 14  | Conventional commits                    | commitlint                                      | `.husky/commit-msg`                         |

`npm run quality` = gates 1 and 3–6 plus 12–13. `npm run gate:push` adds gate 2 and 10.
`npm run validate` adds gates 7–9 and 11; unfiltered `test:e2e` discovers E2E, accessibility, and
visual specs. The e2e workflow also runs gates 7–9.

## What blocks a release

Any of the following is an automatic no-go — there is no severity triage on gates:

- Any red gate above, including a single ESLint warning, a coverage threshold miss in
  [vitest.config.mts](../vitest.config.mts), one axe violation, or one LOW-severity Trivy finding.
- A `.only` or undocumented skipped test ([rules/15-testing-and-coverage.md](../rules/15-testing-and-coverage.md)).
- An `eslint-disable` without a matching exception document in
  [docs/exceptions/](../docs/exceptions/README.md).
- An unresolved item on the [docs/sdlc/release-checklist.md](../docs/sdlc/release-checklist.md) or
  the smoke test in [runbooks/release-smoke-test-template.md](../runbooks/release-smoke-test-template.md).

## Exception process

Gates are bypassed only through the written exception process — never by editing thresholds,
skipping hooks, or force-merging:

1. Copy [docs/exceptions/exception-template.md](../docs/exceptions/exception-template.md) into
   `docs/exceptions/` with the finding, why it cannot be fixed now, scope, owner, and expiry date.
2. Reference the exception file from the suppression site (e.g. the `eslint-disable` comment or
   the audit note). The `postcss` override documented in [package.json](../package.json) shows the
   preferred alternative: fix the transitive dependency instead of excepting it.
3. Expired exceptions fail review — they MUST be renewed with a new justification or resolved.

## Ownership

- The release decision follows [agents/frontend-release-gatekeeper.md](../agents/frontend-release-gatekeeper.md)
  and is executed via [skills/final-validation.md](../skills/final-validation.md).
- Gate definitions and rationale: [testing/quality-gates.md](../testing/quality-gates.md) and
  [docs/sdlc/qa-baseline.md](../docs/sdlc/qa-baseline.md).
- Per-feature readiness: [docs/features/_template/11-release-readiness.md](../docs/features/_template/11-release-readiness.md).
