# Quality Gates

Every gate below maps to one npm script (see `package.json`), runs in a defined place, and has a
defined blocking status. "Blocking" means a red result stops the commit, push, or merge — no
overrides, no "merge now, fix later". Exceptions follow
[docs/exceptions/](../docs/exceptions/README.md).

## Gate table

| Gate                                                      | Script                                                                    | Runs in                                                    | Blocking                                                                                  |
| --------------------------------------------------------- | ------------------------------------------------------------------------- | ---------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| Formatting                                                | `npm run format:check`                                                    | pre-commit (staged write); pre-push; `ci.yml` (full check) | Yes                                                                                       |
| Localized social-asset drift                              | `npm run assets:social:check`                                             | pre-push; `ci.yml`                                         | Yes                                                                                       |
| Lint (zero warnings)                                      | `npm run lint` (`eslint . --concurrency=off --max-warnings=0`)            | pre-commit (staged scope); pre-push; `ci.yml` (full)       | Yes                                                                                       |
| Typecheck (strict, 3 tsconfigs)                           | `npm run typecheck` (TypeScript 7 native plus TypeScript 6 compatibility) | pre-push; `ci.yml`                                         | Yes                                                                                       |
| Unit + integration tests with coverage thresholds         | `npm run test:coverage` ([coverage-policy.md](coverage-policy.md))        | pre-push via `gate:push`; `ci.yml`                         | Yes                                                                                       |
| Production build                                          | `npm run build`                                                           | pre-push; `ci.yml`; Playwright web server                  | Yes                                                                                       |
| Playwright browser install                                | `npm run test:e2e:install` (`playwright install chromium`)                | One-time per environment; CI caches the binary             | Yes — required before first `test:e2e` / `validate` locally                               |
| End-to-end                                                | `npm run test:e2e`                                                        | local `validate`; `.github/workflows/e2e.yml`              | Yes                                                                                       |
| Accessibility (axe serious/critical = 0 + keyboard specs) | `npm run test:a11y`                                                       | local `validate` via `test:e2e`; `e2e.yml`                 | Yes                                                                                       |
| Visual regression (`maxDiffPixelRatio: 0.02`)             | `npm run test:visual`                                                     | local `validate` via `test:e2e`; `e2e.yml`                 | Yes                                                                                       |
| Runtime dependency vulnerabilities                        | `npm run security:audit` (`npm audit --omit=dev --audit-level=low`)       | pre-push; `ci.yml`; `security.yml`                         | Yes — zero unhandled findings; development dependencies remain in the Trivy lockfile scan |
| Vuln + secret + misconfig scan                            | `npm run security:scan` (Trivy, `--exit-code 1`, severity LOW–CRITICAL)   | local `validate`; `security.yml`                           | Yes                                                                                       |
| Dead code                                                 | `npm run quality:dead-code` (knip)                                        | pre-push; `ci.yml`                                         | Yes                                                                                       |
| Circular dependencies                                     | `npm run quality:circular` (dependency-cruiser over `src`)                | pre-push; `ci.yml`                                         | Yes                                                                                       |
| Commit message convention                                 | commitlint (conventional)                                                 | commit-msg hook (`.husky/commit-msg`)                      | Yes                                                                                       |

## Local enforcement: git hooks

- `.husky/pre-commit` → `lint-staged` (format + lint on staged files only, keeping commits fast).
- `.husky/commit-msg` → commitlint with the conventional config (`commitlint.config.cjs`).
- `.husky/pre-push` → `corepack npm run gate:push`.

Hooks are the fast local echo of CI, not a substitute for it — CI always runs the full,
unscoped gate set. Bypassing hooks (`--no-verify`) is never acceptable; if a hook is wrong, fix
the hook.

## Composite scripts

- `npm run quality` = social-asset drift → lint → TypeScript 7+6 typecheck → coverage → build →
  dead code → circular dependencies.
- `npm run gate:push` = format check → `quality` → runtime audit.
- `npm run validate` = `gate:push` → the full Playwright discovery set → Trivy. This is the full
  release gate — the same bar CI applies across all three workflows, runnable on one machine. The
  [skills/final-validation.md](../skills/final-validation.md) skill walks through it. On a fresh
  platform, install Chromium with `npm run test:e2e:install`. Only when intentionally establishing
  or reviewing current-OS screenshots, run
  `npm run test:e2e:baseline`; it refreshes all current-OS baselines. CI is compare-only and
  fails on missing or changed Linux baselines. All Playwright npm scripts resolve the committed
  local CLI and cannot download a surprise version.

## Merge and release

- A PR merges only when all three workflows (`ci.yml`, `security.yml`, `e2e.yml`) are green and
  review passes the checklist in [rules/20-review-checklist.md](../rules/20-review-checklist.md).
- Release additionally follows [rules/19-release-gates.md](../rules/19-release-gates.md) and
  [docs/sdlc/release-checklist.md](../docs/sdlc/release-checklist.md), including the manual
  accessibility pass from
  [accessibility-testing-standard.md](accessibility-testing-standard.md).
- Flaky-test policy: a test that fails intermittently is treated as failing. Quarantining it
  (skip) requires a documented exception with an owner and a fix-by date.
