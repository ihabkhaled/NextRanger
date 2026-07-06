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
npm run typecheck           # 3. tsgo over tsconfig.app/test/node
npm run test:coverage       # 4. Vitest + thresholds: 95% global, 100% pure-logic layers
npm run build               # 5. next build --turbopack (typedRoutes, env validation)
npm run test:e2e            # 6. Playwright e2e (builds + starts the app itself)
npm run security:audit      # 7. npm audit --audit-level=low
npm run security:scan       # 8. trivy vuln + secret + misconfig, all severities
npm run quality:dead-code   # 9. knip
npm run quality:circular    # 10. madge src --circular
```

Shortcut: `npm run validate` chains steps 2–10 (via `quality` + the rest). Run `npm install`
yourself first, and add `npm run test:a11y` / `npm run test:visual` whenever the change touched
any UI.

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
| 6 | E2E                 | npm run test:e2e        | pass (<n> specs) |
| 7 | Audit               | npm run security:audit  | pass             |
| 8 | Trivy               | npm run security:scan   | pass             |
| 9 | Dead code           | npm run quality:dead-code | pass           |
|10 | Circular deps       | npm run quality:circular  | pass           |

Forbidden-pattern greps: clean / <findings + exception links>
Extra suites run: <test:a11y / test:visual / none — why>
Exceptions touched: <docs/exceptions/... or none>
```

A gate marked anything other than `pass` means the work is not done — there is no "known failure"
state outside a merged exception document.
