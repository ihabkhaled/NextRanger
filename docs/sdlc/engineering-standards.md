# Engineering Standards

Process standards for day-to-day delivery. Code-level rules live in [rules/00-non-negotiable-rules.md](../../rules/00-non-negotiable-rules.md).

## Branch naming

Branches MUST follow `<type>/<scope>-<short-slug>`, where `<type>` is one of the commit types below:

- `feat/articles-pagination`
- `fix/auth-login-error-mapping`
- `chore/deps-weekly-upgrade`
- `docs/adr-0002-workbench`

Feature branches are the default. Direct work on `main` is allowed only when the repository owner
explicitly authorizes it; every pushed checkpoint must still be green and independently revertible.

## Commits — conventional, machine-enforced

`commitlint.config.cjs` extends `@commitlint/config-conventional`, and the `.husky/commit-msg` hook runs `commitlint --edit` on every commit. Non-conforming messages are rejected locally — this is not a review-time convention.

- Format: `type(scope): imperative summary` — e.g. `feat(articles): add list pagination query`.
- Scope SHOULD be the module (`articles`, `auth`, `health`, `ui-preferences`), the package wrapper (`packages/query`), or the concern (`eslint`, `ci`, `docs`).
- One logical change per commit. Never mix a refactor with a behavior change.

## Git hooks (never bypassed)

- `.husky/pre-commit` → `corepack npm exec lint-staged` (Prettier + ESLint on staged files).
- `.husky/commit-msg` → `corepack npm exec commitlint`.
- `.husky/pre-push` → `corepack npm run gate:push`.

`--no-verify` is prohibited. A hook that blocks you is a defect to fix, not a gate to skip.

## Pull requests

- **Size**: target ≤ 400 changed lines of source (generated lockfiles excluded). Above ~800 lines the PR MUST be split unless it is a mechanical rename/move — reviewers may decline oversized PRs.
- **Scope**: one module or one concern per PR. A PR touching `src/modules/auth` and `src/packages/axios` at once needs an explicit justification in its description.
- **Description**: what changed, why, risk class per [risk-baseline.md](./risk-baseline.md), and the test evidence required by [qa-baseline.md](./qa-baseline.md).
- **CI**: the workflows in `.github/workflows/ci.yml`, `security.yml`, and `e2e.yml` MUST be green before merge. No admin-merge over red checks.
- **Review**: at least one approval; two for **High**-risk changes. Self-merge without review is prohibited.

## Review SLAs

- First review response: within 1 business day of the PR being marked ready.
- Re-review after author updates: within 4 business hours.
- **High**-risk PRs (auth, security headers, `src/proxy.ts`, env handling): reviewer MUST run the relevant reviewer checklist from [agents/README.md](../../agents/README.md), same-day.
- A PR idle for 3 business days is escalated to the frontend architect.

## Definition of Ready (before implementation starts)

- Acceptance criteria written and testable.
- Target module and layers named; new i18n keys listed for `en` and `ar`.
- Risk class assigned; phase docs 00–06 complete for non-fast-track work ([company-sdlc-policy.md](./company-sdlc-policy.md)).

## Definition of Done (before merge)

- `npm run lint` (zero warnings — `--max-warnings=0`), `npm run typecheck`, `npm run test:coverage` all pass locally and in CI.
- New/changed behavior covered by tests at the levels required by [qa-baseline.md](./qa-baseline.md).
- No new `eslint-disable`, `@ts-expect-error`, or `as unknown as` without an exception doc ([docs/exceptions/README.md](../exceptions/README.md)).
- Documentation updated per [documentation-baseline.md](./documentation-baseline.md).
- Message catalogs `src/packages/i18n/messages/en.json` and `ar.json` updated together — never one without the other.
