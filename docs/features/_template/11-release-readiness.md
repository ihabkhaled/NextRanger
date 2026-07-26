# 11 — Release Readiness

> The final pre-ship gate, executed by [agents/frontend-release-gatekeeper.md](../../../agents/frontend-release-gatekeeper.md) or the release owner. It applies [docs/sdlc/release-checklist.md](../../sdlc/release-checklist.md) and the gate definitions in [rules/19-release-gates.md](../../../rules/19-release-gates.md) and [testing/quality-gates.md](../../../testing/quality-gates.md) to this feature. Run [skills/final-validation.md](../../../skills/final-validation.md) to execute the command sequence.

## Release identification

- **Feature:** <slug>
- **Release vehicle:** <version / deploy date>
- **Release owner:** <name>

## Gate execution (per docs/sdlc/release-checklist.md)

### Automated gates — every command MUST exit clean

- [ ] `npm run validate` — lint (error-only, --max-warnings=0), format check, TypeScript 7, unit/integration tests. <Result.>
- [ ] `npm run test:coverage` — thresholds hold: 95% global, 100% on utils/helpers/mappers/schemas/query-key builders (vitest.config.mts). <Result.>
- [ ] `npm run test:e2e` — Playwright suites in src/tests/e2e/ including this feature's specs. <Result.>
- [ ] `npm run test:a11y` — zero violations. <Result.>
- [ ] `npm run test:visual` — snapshots reviewed; intentional diffs re-baselined with justification. <Result.>
- [ ] `npm run security:audit` and `npm run security:scan` — zero unhandled vulnerabilities (overrides documented in package.json, as with the existing postcss override). <Result.>
- [ ] `npm run quality:dead-code` and `npm run quality:circular` — knip and dependency-cruiser clean. <Result.>
- [ ] `npm run build` — production build succeeds; typedRoutes compile. <Result.>
- [ ] CI green on the release commit (.github/workflows/ci.yml, security.yml, e2e.yml). <Link to runs.>

### Document gates

- [ ] Stages 00–10 of this feature directory are complete and signed off. <Confirm.>
- [ ] Open exceptions affecting this feature listed in docs/exceptions/ with expiry dates. <List.>
- [ ] Release notes entry drafted per release-notes/release-notes-template.md. <Link.>

### Operational gates

- [ ] Smoke-test plan instantiated from runbooks/release-smoke-test-template.md (mock mode off: SERVER_API_MOCKING disabled against a real upstream, if applicable). <Link.>
- [ ] Rollback plan instantiated from runbooks/rollback-template.md. <Link.>
- [ ] Support readiness updated per support/support-readiness-template.md; known issues logged per support/known-issues-template.md. <Links.>
- [ ] Hypercare owner and window agreed (feeds 12-hypercare.md). <Name + window.>

## Residual risks accepted

| Risk   | Owner  | Expiry / revisit |
| ------ | ------ | ---------------- |
| <risk> | <name> | <date>           |

## Verdict

- **Decision:** <GO | NO-GO>
- **Rationale:** <one or two sentences; a NO-GO lists the blocking gates>

## Gate

- [ ] All automated gates green on the release commit
- [ ] All document and operational gates satisfied or exception-covered
- [ ] GO/NO-GO recorded

**Signed off by:** <name> — <YYYY-MM-DD>
