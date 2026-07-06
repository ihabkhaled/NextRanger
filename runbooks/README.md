# Runbooks

Operational playbooks for running strict-next-ranger-based apps in production. Each file here is
a _template_: when an event happens, copy the template into your incident/release tracker (or a
dated copy in this directory), fill the `<angle-bracket>` prompts, and work the checklist.
Runbooks are executed documents — an unfilled runbook after an event is a process failure.

## Index

| Runbook                                                          | Use it when                                                                                                                                    |
| ---------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| [incident-response-template.md](incident-response-template.md)   | Production is broken or degraded right now: user-facing errors, gateway failures, security events. Open it the moment an incident is declared. |
| [release-smoke-test-template.md](release-smoke-test-template.md) | Immediately after every production deploy. Manual verification of the critical paths on the live environment, on top of the automated gates.   |
| [rollback-template.md](rollback-template.md)                     | A deployed release must be reverted. Use together with the incident runbook when the rollback is incident-driven.                              |

## Which runbook, when

1. **Deploy just finished?** Run the [smoke test](release-smoke-test-template.md). Always. A
   failed smoke item feeds directly into the rollback decision criteria.
2. **Something is wrong in production?** Open the [incident response](incident-response-template.md)
   runbook first — it assigns roles and starts the timeline log. Rollback is one possible
   _action inside_ an incident, not a substitute for running it.
3. **Rolling back?** Open the [rollback](rollback-template.md) runbook and link it from the
   incident timeline.

## Ground rules

- Runbooks MUST be executable by an engineer who did not write the release. If a step assumes
  tribal knowledge, fix the runbook.
- Every incident that reaches Sev-2 or higher MUST produce a filled incident document and a
  retrospective (see [docs/features/_template/13-retrospective.md](../docs/features/_template/13-retrospective.md)
  for the retro format).
- Recurring problems discovered while working a runbook MUST be recorded in
  [memory/known-pitfalls.md](../memory/known-pitfalls.md) and, where user-visible, in a filled
  copy of [support/known-issues-template.md](../support/known-issues-template.md).
- Release process context lives in [docs/sdlc/release-checklist.md](../docs/sdlc/release-checklist.md)
  and [rules/19-release-gates.md](../rules/19-release-gates.md); runbooks assume those gates
  already passed.
