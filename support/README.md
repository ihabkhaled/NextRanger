# Support

How a strict-next-ranger-based app is supported after it ships. Support is a first-class part of
the delivery lifecycle: a feature is not "done" at deploy — it is done when support can handle
it without the authors in the room (see the hypercare stage in
[docs/features/_template/12-hypercare.md](../docs/features/_template/12-hypercare.md)).

## Documents

| Document                                                       | Purpose                                                                                                                         |
| -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| [known-issues-template.md](known-issues-template.md)           | The living register of user-visible defects and limitations, with workarounds. Copy per app/release stream and keep it current. |
| [support-readiness-template.md](support-readiness-template.md) | Launch checklist proving a feature or release can actually be supported. Filled before go-live.                                 |

## Support model

- **Tier 1 (support/on-call triage):** Receives reports. Uses the known-issues register first —
  if the report matches a known issue, apply the documented workaround and link the ticket.
  Checks `GET /api/health` and current release notes before escalating.
- **Tier 2 (feature owner):** The owning module's maintainers (e.g. `src/modules/articles`
  issues go to the articles owners). Diagnoses with the module's tests and mock fixtures —
  `SERVER_API_MOCKING=enabled` reproduces most flows with zero backend.
- **Tier 3 (incident):** Anything user-impacting at scale becomes an incident and follows
  [runbooks/incident-response-template.md](../runbooks/incident-response-template.md).

## Rules

- Every release MUST have its known-issues register reviewed and synchronized with the
  release notes ([release-notes/release-notes-template.md](../release-notes/release-notes-template.md)).
  The two lists must never contradict each other.
- Every launch MUST have a completed support-readiness checklist signed by the release owner
  and the support owner before go-live.
- A known issue open for two consecutive releases without a fix plan escalates to the
  release gatekeeper review (see [agents/frontend-release-gatekeeper.md](../agents/frontend-release-gatekeeper.md)).
- Support-discovered patterns that engineers keep re-hitting belong in
  [memory/known-pitfalls.md](../memory/known-pitfalls.md), not in tribal memory.

## What support needs from engineering

- Release notes with honest upgrade notes and known issues, per
  [release-notes/README.md](../release-notes/README.md).
- Error messages that are user-safe and traceable: the app renders translated message keys
  (mapped via `src/shared/errors/http-error-to-message-key.mapper.ts`), never raw errors —
  support reports should quote the visible copy, engineering maps it back to the key.
- Stable smoke coverage: the paths in
  [runbooks/release-smoke-test-template.md](../runbooks/release-smoke-test-template.md) are the
  same paths Tier 1 uses to confirm "is it just this user, or everyone?".
