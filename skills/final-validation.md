# Skill: Final Validation

The last step before declaring any piece of work done — feature, refactor, or dependency bump.
It mirrors what CI (`.github/workflows/ci.yml`, `security.yml`, `e2e.yml`) and the pre-push hook
enforce, so nothing here should ever fail "only in CI". Gate policy:
[rules/19-release-gates.md](../rules/19-release-gates.md) and
[testing/quality-gates.md](../testing/quality-gates.md).

## Gate sequence

Run in this order and stop at the first failure (fix via
[skills/fix-eslint-typecheck.md](fix-eslint-typecheck.md) or the relevant testing skill, then
restart from the failed step):

```sh
npm install                 # 1. lockfile-consistent install (npm ci in CI)
npm run lint                # 2. ESLint flat config, --max-warnings=0
npm run typecheck           # 3. stable TypeScript 7 over tsconfig.app/test/node
npm run test:coverage       # 4. Vitest + thresholds: 95% global, 100% pure-logic layers
npm run build               # 5. next build --turbopack (typedRoutes, env validation)
npm run test:e2e:install    # 6. one-time Playwright Chromium download (npx playwright install chromium)
npm run test:e2e:baseline   # 7. only after reviewing an intentional visual change
npm run test:e2e            # 8. Playwright e2e (builds + starts the app itself)
npm run security:audit      # 9. npm audit --audit-level=low
npm run security:scan       # 10. trivy vuln + secret + misconfig, all severities
npm run quality:dead-code   # 11. knip
npm run quality:circular    # 12. dependency-cruiser over src
```

Shortcut: `npm run validate` chains the gate steps (via `quality` + e2e + security + dead-code +
circular). It does NOT run the two one-time Playwright steps, so on a fresh environment run them
yourself first, in order: `npm install`, then `npm run test:e2e:install` (npx-backed Chromium
download). Run `npm run test:e2e:baseline` only to approve an intentional visual change; it
refreshes every current-OS snapshot and therefore requires image-by-image review. Add
`npm run test:a11y` / `npm run test:visual` whenever the change touched any UI.

## Forbidden-pattern greps

Belt-and-suspenders on top of ESLint — run from the repo root; every hit outside the noted owners
is a failure:

```sh
grep -rn "dangerouslySetInnerHTML" src/                      # zero hits, no exceptions
grep -rn "eslint-disable" src/ eslint/                       # each hit must cite docs/exceptions/
grep -rnE "\.only\(|\.skip\(" src/                           # no focused/skipped tests
grep -rn "process.env" src/ | grep -v "packages/env\|shared/config\|tests/setup\|tests/e2e\|proxy.ts"
grep -rnE "from '(axios|zustand|dayjs|sonner|zod)'" src/ | grep -v "src/packages/"
grep -rn "console\." src/ | grep -v "packages/logger"        # logging only via appLogger
grep -rn "localStorage\|sessionStorage" src/ | grep -v "packages/storage\|packages/browser"
```

## Link and docs audit

If the change touched documentation: verify every repo-relative link resolves to a real file, and
that any renamed source file is re-pointed in `rules/`, `skills/`, `docs/eslint/`, and
`context/codebase-navigation.md`. New env vars must appear in `.env.example`; new scripts in
`package.json` must be reflected in [rules/19-release-gates.md](../rules/19-release-gates.md).

## Report format

Close out with this block in the PR description or task hand-off:

```
## Final validation — <branch> @ <short sha>, <date>

| # | Gate                | Command                 | Result           |
|---|---------------------|-------------------------|------------------|
| 1 | Install             | npm install             | pass             |
| 2 | Lint                | npm run lint            | pass (0 warn)    |
| 3 | Typecheck           | npm run typecheck       | pass (3 projects)|
| 4 | Unit + coverage     | npm run test:coverage   | pass (<x>% lines)|
| 5 | Build               | npm run build           | pass             |
| 6 | Playwright install  | npm run test:e2e:install | pass (one-time) |
| 7 | Visual baselines    | npm run test:e2e:baseline | pass (one-time) |
| 8 | E2E                 | npm run test:e2e        | pass (<n> specs) |
| 9 | Audit               | npm run security:audit  | pass             |
| 10 | Trivy               | npm run security:scan   | pass             |
| 11 | Dead code           | npm run quality:dead-code | pass           |
| 12 | Circular deps       | npm run quality:circular  | pass           |

Forbidden-pattern greps: clean / <findings + exception links>
Extra suites run: <test:a11y / test:visual / none — why>
Exceptions touched: <docs/exceptions/... or none>
```

A gate marked anything other than `pass` means the work is not done — there is no "known failure"
state outside a merged exception document.
