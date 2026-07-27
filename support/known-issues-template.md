# Known Issues — <app / release stream>

- **Maintained by:** <support owner name/role>
- **Last reviewed:** <YYYY-MM-DD> (MUST be reviewed at every release; see
  [release-notes/README.md](../release-notes/README.md))
- **Applies to release(s):** <version range>

This is the single register of user-visible defects and limitations that are known and accepted
for now. Tier 1 support checks this document before escalating any report. Entries are appended
and updated, never silently deleted — resolved issues move to the Resolved section with the
fixing release.

## Entry rules

- One entry per issue, ID `KI-NN`, sequential, never reused.
- Severity uses the incident scale (Sev-3/Sev-4 only — anything Sev-1/2 is an active incident,
  not a known issue; see [runbooks/incident-response-template.md](../runbooks/incident-response-template.md)).
- Every entry MUST have either a workaround or an explicit "none"; "none" plus Sev-3 requires a
  fix target release.
- Each entry links its tracking ticket and, where relevant, the module that owns it
  (e.g. `src/modules/articles`).

## Open issues

### KI-<NN>: <one-line summary>

- **Severity:** <Sev-3 | Sev-4>
- **First seen in:** <release version> — **Reported via:** <support ticket / smoke test / e2e>
- **Affected area:** <locale-prefixed route, module, locale(s), theme>
- **Symptom:** <exactly what the user sees, quoting visible copy so Tier 1 can match reports>
- **Conditions:** <when it happens: locale, viewport, data shape, gateway mode>
- **Workaround:** <steps Tier 1 can give a user, or "none">
- **Root cause (if known):** <one sentence, or "under investigation">
- **Fix plan:** <target release / ticket link — mandatory for Sev-3>
- **Owner:** <module owner / name>

<duplicate the block above per open issue>

## Resolved issues

| ID      | Summary    | Fixed in          | Verified by                         |
| ------- | ---------- | ----------------- | ----------------------------------- |
| <KI-NN> | <one line> | <release version> | <smoke test / regression test link> |

## Review log

| Date         | Reviewer | Outcome                                                         |
| ------------ | -------- | --------------------------------------------------------------- |
| <YYYY-MM-DD> | <name>   | <e.g. "2 open, 1 resolved in 1.4.0, synced with release notes"> |
