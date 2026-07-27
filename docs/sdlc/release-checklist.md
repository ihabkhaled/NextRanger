# Release Checklist

Executed by the release gatekeeper for every production release. Companion policy: [rules/19-release-gates.md](../../rules/19-release-gates.md). All steps MUST complete in order; a failure at any step aborts the release.

## 1. Preconditions

- [ ] All feature work merged to `main`; no half-landed feature without a documented flag or safe default.
- [ ] Work arrived as small coherent conventional commits, each pushed after its focused gate; no
      hook bypass, known-red checkpoint, unrelated mega-commit, or unpublished final pile-up
      ([rule 21](../../rules/21-version-control-checkpoints.md)).
- [ ] Phase doc [11-release-readiness.md](../features/_template/11-release-readiness.md) completed for every feature in the release.
- [ ] Exceptions register reviewed: no exception in [docs/exceptions/README.md](../exceptions/README.md) has passed its expiry date.
- [ ] UAT exit criteria met for **High**-risk changes ([uat-baseline.md](./uat-baseline.md)).

## 2. Full gate run

Run the complete gate on the release commit:

```sh
corepack npm run validate
```

`validate` executes `gate:push` (format → localized assets → lint → TypeScript 7+6 → coverage →
build → dead code → cycles → runtime audit), then the full Playwright discovery set, then Trivy.

- [ ] The `validate` result includes passing E2E, accessibility, and visual suites.
- [ ] Visual output has no unexplained diffs; every intentional baseline change names its reviewer.
- [ ] CI workflows `.github/workflows/ci.yml`, `security.yml`, `e2e.yml` green on the release commit.

No step may be re-run-until-green: a flaky failure is investigated and fixed or filed before proceeding.

## 3. Build sanity

- [ ] `npm run build` output inspected: no unexpected bundle-size jump (compare first-load JS per route against the previous release; investigate anything > 10%).
- [ ] `npm run start` locally with `SERVER_API_MOCKING=enabled`: app boots and `/en`, `/en/login`,
      `/en/articles`, and `/en/settings` render (the locale-prefixed `ROUTE_PATHS` surface).
- [ ] `/api/health` returns the report from `buildHealthReport` (`src/modules/health`).

## 4. Smoke tests

- [ ] Execute the smoke suite per [runbooks/release-smoke-test-template.md](../../runbooks/release-smoke-test-template.md) against the release candidate environment, in both `en` (LTR) and `ar` (RTL), light and dark theme.
- [ ] Verify security headers on a live response: CSP nonce present, nosniff, DENY, HSTS (`src/proxy.ts` + `next.config.ts`).

## 5. Release notes and comms

- [ ] Release notes written from [release-notes/release-notes-template.md](../../release-notes/release-notes-template.md) and stored under `release-notes/`.
- [ ] Support briefed per [support/support-readiness-template.md](../../support/support-readiness-template.md); known issues updated in [support/known-issues-template.md](../../support/known-issues-template.md).

## 6. Rollback readiness (before deploying, not after)

- [ ] Previous known-good version identified and deployable.
- [ ] Rollback procedure rehearsed mentally against [runbooks/rollback-template.md](../../runbooks/rollback-template.md); any migration-like concern (cookie format, `STORAGE_KEYS` schema changes read via `readStorageJson`) confirmed backward-compatible.
- [ ] Owner on call for the hypercare window named in the release notes.

## 7. Deploy and verify

- [ ] Deploy; re-run the smoke suite against production.
- [ ] Watch error surfaces during the hypercare window defined in [docs/features/_template/12-hypercare.md](../features/_template/12-hypercare.md).
- [ ] Tag the release commit; close the release in the feature phase docs.

Any Sev-1/Sev-2 during hypercare: execute the rollback runbook first, diagnose second.
