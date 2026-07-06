# Support Readiness — <feature or release>

- **Feature/release:** <name, version, link to docs/features/<feature>/11-release-readiness.md>
- **Go-live target:** <YYYY-MM-DD>
- **Release owner sign-off:** <name, date>
- **Support owner sign-off:** <name, date>

Both sign-offs are required BEFORE go-live. An unchecked item without a written waiver from the
release owner blocks launch (waivers are logged in the Notes section, with reason and expiry).

## Documentation

- [ ] Release notes drafted from
      [release-notes/release-notes-template.md](../release-notes/release-notes-template.md),
      including upgrade notes and the gate evidence table.
- [ ] Known-issues register ([known-issues-template.md](known-issues-template.md)) reviewed and
      updated for this release; synchronized with the release notes' known-issues section.
- [ ] User-facing behavior of the feature documented where support can find it (link: <link>).
- [ ] Feature lifecycle docs complete through release readiness
      ([docs/features/_template/11-release-readiness.md](../docs/features/_template/11-release-readiness.md)).
- [ ] Runbooks reviewed: smoke test covers the new critical paths, rollback caveats recorded
      ([runbooks/README.md](../runbooks/README.md)).

## Monitoring and diagnostics

- [ ] `GET /api/health` verified on the target environment and included in external monitoring.
- [ ] Error-rate and availability alerting configured for the affected routes; alert destination
      is the on-call channel, not an inbox.
- [ ] Observability expectations from [rules/16-observability-analytics.md](../rules/16-observability-analytics.md)
      met for the new code paths (logging through `appLogger`, no raw console).
- [ ] Support can distinguish "backend/upstream down" from "frontend broken": gateway error
      responses (e.g. `bad_gateway` from the BFF) documented for Tier 1.

## People

- [ ] On-call/owner rota for the first two weeks (hypercare window) filled in below and
      acknowledged by everyone named.
- [ ] Tier 2 owner per affected module identified (articles / auth / ui-preferences / <module>).
- [ ] Tier 1 briefed: 30-minute walkthrough of the feature, its known issues, and its
      workarounds completed on <date>.

| Window (dates) | Primary | Backup |
| -------------- | ------- | ------ |
| <week 1>       | <name>  | <name> |
| <week 2>       | <name>  | <name> |

## Escalation

- [ ] Escalation path written and posted where Tier 1 works: Tier 1 → Tier 2 module owner →
      incident commander per [runbooks/incident-response-template.md](../runbooks/incident-response-template.md).
- [ ] Severity definitions shared with Tier 1 (same table as the incident runbook).
- [ ] Rollback decision authority for the hypercare window named: <name>.

## Final verification

- [ ] Post-deploy smoke test scheduled with a named executor
      ([runbooks/release-smoke-test-template.md](../runbooks/release-smoke-test-template.md)).
- [ ] Hypercare exit criteria agreed (per [docs/features/_template/12-hypercare.md](../docs/features/_template/12-hypercare.md)):
      <e.g. "no Sev-3+ for 14 days and all launch known-issues have fix plans">.

## Notes and waivers

| Item   | Waiver reason | Approved by     | Expires          |
| ------ | ------------- | --------------- | ---------------- |
| <item> | <reason>      | <release owner> | <date / release> |
