# UAT Baseline

User acceptance testing validates that a feature does the right thing for real users; automated gates already prove it does the thing right. UAT is mandatory for **High**-risk changes ([risk-baseline.md](./risk-baseline.md)), recommended for **Medium**, and skipped for **Low**. The per-feature record lives in [docs/features/_template/11-release-readiness.md](../features/_template/11-release-readiness.md).

## Environments

- **UAT environment**: a deployed build of the release candidate commit. Two accepted configurations:
  - **Mocked backend** — `SERVER_API_MOCKING=enabled` (the default): the BFF gateway (`/api/gateway/[...path]`) serves module mock fixtures such as `src/modules/articles/api/articles.mock.ts`. Suitable for UX/flow acceptance with zero backend.
  - **Integrated backend** — `SERVER_API_MOCKING` unset/disabled with `SERVER_API_BASE_URL` pointing at the staging API. Required for High-risk auth and data-contract acceptance.
- The configuration used MUST be recorded in the UAT log. Auth negative paths in mocked mode use the sentinel `AUTH_MOCK_REJECTED_PASSWORD` (`'wrong-password'`) from `src/modules/auth`.
- UAT covers every supported locale plus focused RTL walks in Arabic and Persian, in both light
  and dark themes. Locale and direction bugs are acceptance failures, not polish items.

## Entry criteria

- All automated gates green on the candidate commit (`npm run validate`, plus a11y/visual per the [qa-baseline.md](./qa-baseline.md) matrix).
- Acceptance criteria from [02-product-requirements.md](../features/_template/02-product-requirements.md) frozen — UAT tests against the signed-off criteria, not against evolving wishes.
- Test scenarios written as user journeys with expected outcomes per UI state (loading / error / empty / ready).
- UAT environment deployed and smoke-checked (`/api/health` responding).

## Exit criteria

- Every acceptance criterion demonstrated and checked off by the product owner.
- Zero open Sev-1/Sev-2 defects; Sev-3/Sev-4 either fixed or explicitly accepted and logged in [support/known-issues-template.md](../../support/known-issues-template.md).
- RTL and dark-theme passes completed with no layout or copy defects.
- Sign-off recorded (see below).

## Sign-off

- **Product owner** signs off on functional acceptance. This is the only signature that closes UAT.
- **Feature engineer** counter-signs that every defect fixed during UAT landed with a regression test ([qa-baseline.md](./qa-baseline.md)).
- **Release gatekeeper** verifies both signatures before starting [release-checklist.md](./release-checklist.md).

Sign-off is recorded by name and date in the feature's `11-release-readiness.md`. Verbal or chat-only sign-off does not count.

## Defect triage during UAT

| Severity | Definition                                             | Action                                                                                |
| -------- | ------------------------------------------------------ | ------------------------------------------------------------------------------------- |
| Sev-1    | Acceptance-blocking: data loss, auth broken, app crash | Stop UAT; fix with failing-first test; redeploy candidate; restart affected scenarios |
| Sev-2    | Core journey degraded, no workaround                   | Fix before exit; re-run the affected journey                                          |
| Sev-3    | Cosmetic or edge-case with workaround                  | Fix or accept; if accepted, log in known issues with owner                            |
| Sev-4    | Nit (spacing, wording preference)                      | Backlog; never blocks exit                                                            |

Every UAT defect gets a root-cause note: if the defect should have been caught by an automated layer, the gap is closed in the same fix PR (new unit/integration/e2e/a11y spec) and, if systemic, recorded in [memory/known-pitfalls.md](../../memory/known-pitfalls.md).
