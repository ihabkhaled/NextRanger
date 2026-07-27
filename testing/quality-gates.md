# Quality Gates

Every gate below maps to one npm script (see `package.json`), runs in a defined place, and has a
defined blocking status. "Blocking" means a red result stops the commit, push, or merge — no
overrides, no "merge now, fix later". Exceptions follow
[docs/exceptions/](../docs/exceptions/README.md).

## Gate table

| Gate                                                      | Script                                                                                                         | Runs in                                                                             | Blocking                                                                                  |
| --------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| Formatting                                                | `npm run format:check`                                                                                         | pre-commit (via `lint-staged`, auto-fixes staged files); `.github/workflows/ci.yml` | Yes                                                                                       |
| Lint (zero warnings)                                      | `npm run lint` (`eslint . --concurrency=4 --max-warnings=0`)                                                   | pre-commit (staged scope); `ci.yml` (full)                                          | Yes                                                                                       |
| Typecheck (strict, 3 tsconfigs)                           | `npm run typecheck` (stable TypeScript 7 over `tsconfig.app.json`, `tsconfig.test.json`, `tsconfig.node.json`) | pre-push; `ci.yml`                                                                  | Yes                                                                                       |
| Unit + integration tests with coverage thresholds         | `npm run test:coverage` ([coverage-policy.md](coverage-policy.md))                                             | pre-push (`npm run test`); `ci.yml` (with coverage)                                 | Yes                                                                                       |
| Production build                                          | `npm run build`                                                                                                | `ci.yml`; also implied by the e2e webServer                                         | Yes                                                                                       |
| Playwright browser install                                | `npm run test:e2e:install` (`playwright install chromium`)                                                     | One-time per environment; CI caches the binary                                      | Yes — required before first `test:e2e` / `validate` locally                               |
| End-to-end                                                | `npm run test:e2e`                                                                                             | `.github/workflows/e2e.yml`                                                         | Yes                                                                                       |
| Accessibility (axe serious/critical = 0 + keyboard specs) | `npm run test:a11y`                                                                                            | `e2e.yml`                                                                           | Yes                                                                                       |
| Visual regression (`maxDiffPixelRatio: 0.02`)             | `npm run test:visual`                                                                                          | `e2e.yml`                                                                           | Yes                                                                                       |
| Runtime dependency vulnerabilities                        | `npm run security:audit` (`npm audit --omit=dev --audit-level=low`)                                            | `.github/workflows/security.yml`                                                    | Yes — zero unhandled findings; development dependencies remain in the Trivy lockfile scan |
| Vuln + secret + misconfig scan                            | `npm run security:scan` (Trivy, `--exit-code 1`, severity LOW–CRITICAL)                                        | `security.yml`                                                                      | Yes                                                                                       |
| Dead code                                                 | `npm run quality:dead-code` (knip)                                                                             | `ci.yml`                                                                            | Yes                                                                                       |
| Circular dependencies                                     | `npm run quality:circular` (dependency-cruiser over `src`)                                                     | `ci.yml`                                                                            | Yes                                                                                       |
| Commit message convention                                 | commitlint (conventional)                                                                                      | commit-msg hook (`.husky/commit-msg`)                                               | Yes                                                                                       |

## Local enforcement: git hooks

- `.husky/pre-commit` → `lint-staged` (format + lint on staged files only, keeping commits fast).
- `.husky/commit-msg` → commitlint with the conventional config (`commitlint.config.cjs`).
- `.husky/pre-push` → `npm run gate:push`.

Hooks are the fast local echo of CI, not a substitute for it — CI always runs the full,
unscoped gate set. Bypassing hooks (`--no-verify`) is never acceptable; if a hook is wrong, fix
the hook.

## Composite scripts

- `npm run quality` = lint → typecheck → test:coverage → build. Run it before opening a PR.
- `npm run validate` = `quality` + e2e + security:audit + security:scan + dead-code + circular.
  This is the full release gate — the same bar CI applies across all three workflows, runnable
  on one machine. The [skills/final-validation.md](../skills/final-validation.md) skill walks
  through it. On a fresh platform, install Chromium with `npm run test:e2e:install`. Only when
  intentionally establishing or reviewing current-OS screenshots, run
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
