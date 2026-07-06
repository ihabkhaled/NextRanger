# SDLC Baselines

Company-level software delivery policy for the strict-next-ranger frontend operating system. These documents define **how work moves** from idea to production; the engineering rules that govern **what the code looks like** live in [rules/00-non-negotiable-rules.md](../../rules/00-non-negotiable-rules.md) and its siblings.

Every document here is normative. "MUST" means a release gate; deviations require an exception filed under [docs/exceptions/README.md](../exceptions/README.md).

## Index

| Document                                                 | Purpose                                                                                                                          |
| -------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| [company-sdlc-policy.md](./company-sdlc-policy.md)       | Feature lifecycle stages, mapped to the `docs/features/_template` phase documents, with roles and entry/exit criteria per stage. |
| [engineering-standards.md](./engineering-standards.md)   | Branch naming, conventional commits (enforced by commitlint), PR size guidance, review SLAs, definition of ready and done.       |
| [qa-baseline.md](./qa-baseline.md)                       | Test evidence required per change type, regression policy, and the quality gate matrix.                                          |
| [security-baseline.md](./security-baseline.md)           | Frontend threat-model checklist, dependency intake policy, secret handling, incident escalation pointers.                        |
| [release-checklist.md](./release-checklist.md)           | Step-by-step release procedure: gates, smoke tests, release notes, rollback readiness.                                           |
| [risk-baseline.md](./risk-baseline.md)                   | Risk classification for frontend changes and required mitigations per class.                                                     |
| [uat-baseline.md](./uat-baseline.md)                     | UAT entry/exit criteria, environments, sign-off ownership, defect triage.                                                        |
| [documentation-baseline.md](./documentation-baseline.md) | Which docs each change type must update (rules / context / memory / release-notes matrix).                                       |

## Related corpora

- Feature lifecycle templates: [docs/features/README.md](../features/README.md)
- Testing standards: [testing/README.md](../../testing/README.md)
- Runbooks (incident, smoke test, rollback): [runbooks/README.md](../../runbooks/README.md)
- Architecture decisions: [architecture/adrs/README.md](../../architecture/adrs/README.md)
- Exceptions register: [docs/exceptions/README.md](../exceptions/README.md)
