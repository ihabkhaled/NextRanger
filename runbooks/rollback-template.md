# Rollback — <version being rolled back>

- **Rollback ID:** <RB-YYYYMMDD-NN>
- **Linked incident:** <INC id / link, if incident-driven>
- **From version:** <bad version / commit SHA>
- **To version:** <last known-good version / commit SHA — verify it passed its own smoke test>
- **Decided by:** <incident commander or release owner>, <YYYY-MM-DD HH:MM UTC>

## Decision criteria

Roll back (do not fix forward) when ANY of these holds:

- [ ] Sev-1: outage, failing `/api/health`, or active security exposure.
- [ ] Sev-2 with no root cause identified within 30 minutes.
- [ ] A [release smoke test](release-smoke-test-template.md) failure on a critical path
      (health, home, login, articles-via-gateway).
- [ ] The candidate fix cannot pass the normal gates (`npm run validate`) in less time than a
      rollback takes.

Prefer fix-forward only when the cause is confirmed, the fix is small, and it can ship through
the full gates. Never fix forward on a guess. Note: rolling back the app does not undo upstream
API or data changes — if the release depended on an upstream/backend change behind
`SERVER_API_BASE_URL`, coordinate the upstream rollback explicitly below.

## Pre-rollback checks

- [ ] Target known-good version identified and its release notes reviewed
      ([release-notes/](../release-notes/README.md)) for env-variable changes: compare required
      `NEXT_PUBLIC_*` / `SERVER_*` values against `.env.example` for BOTH versions.
- [ ] No irreversible coupled change (upstream contract, cookie/session format, storage schema
      read by `readStorageJson`) shipped between the two versions — if one did, plan its
      compensating step here: <plan or "n/a">
- [ ] Comms lead notified that a rollback is starting.

## Rollback steps

1. Announce start in the incident channel; scribe logs the time in the incident timeline.
2. Freeze deploys: no other change ships until this rollback is verified.
3. Redeploy the known-good build via the platform's re-deploy of the previous immutable build.
   Only if no such build exists: `git revert` the release merge on `main` (never force-push)
   and let CI (`.github/workflows/ci.yml`) build and deploy the revert.
4. Restore the matching environment variables for the target version, if they changed.
5. Confirm the deploy platform reports the target version live; record deploy ID: <id>

## Verification

- [ ] `GET /api/health` returns 200 on the rolled-back version.
- [ ] Full [release smoke test](release-smoke-test-template.md) executed against the rolled-back
      version — result: <PASS/FAIL>, link: <link>
- [ ] The symptom that triggered the rollback is gone (re-test the exact failing path).
- [ ] Error rate / monitoring back to baseline for 30 minutes.

## Communications

- [ ] Users/stakeholders informed that mitigation is deployed (comms lead, per the cadence in
      [incident-response-template.md](incident-response-template.md)).
- [ ] Status page (if any) updated to Monitoring, then Resolved.

## Aftermath

- [ ] Deploy freeze lifted after verification.
- [ ] The bad version's release notes updated with a "rolled back" marker and reason.
- [ ] Re-release plan: the original change returns only through the full release process
      ([docs/sdlc/release-checklist.md](../docs/sdlc/release-checklist.md)) with a test that
      would have caught the defect (see [testing/quality-gates.md](../testing/quality-gates.md)).
- [ ] Postmortem scheduled per the incident runbook; pitfall recorded in
      [memory/known-pitfalls.md](../memory/known-pitfalls.md).
