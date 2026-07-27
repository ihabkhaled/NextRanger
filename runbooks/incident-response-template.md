# Incident Response — <incident title>

- **Incident ID:** <INC-YYYYMMDD-NN>
- **Declared:** <YYYY-MM-DD HH:MM UTC> by <name>
- **Status:** <Investigating | Identified | Mitigating | Monitoring | Resolved>
- **Severity:** <Sev-1 | Sev-2 | Sev-3 | Sev-4> (see table below)
- **Affected release:** <version / commit SHA from release-notes/>

## Severity levels

| Level | Definition                                                                                        | Response                                                  |
| ----- | ------------------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| Sev-1 | Full outage or security breach: app unreachable, `/api/health` failing, active data exposure      | All-hands, immediate; rollback is the default action      |
| Sev-2 | Critical path broken for many users: login, articles list, or gateway (`/api/gateway/*`) erroring | Incident team within 15 min; rollback strongly considered |
| Sev-3 | Degraded but usable: one module broken, locale/theme defects, elevated error rate                 | Same business day                                         |
| Sev-4 | Cosmetic or edge-case; workaround exists                                                          | Normal backlog, tracked in support known issues           |

## Roles (assign at declaration — one name each)

- **Incident commander:** <name> — owns decisions, keeps this document current
- **Operations lead:** <name> — hands on the deploy platform, executes mitigation/rollback
- **Comms lead:** <name> — stakeholder and user updates on the cadence below
- **Scribe:** <name> — maintains the timeline log (commander may double as scribe for Sev-3/4)

## Initial assessment

- User-visible symptom: <what users see, with URL/route, e.g. `/articles` shows the error state>
- Blast radius: <all users | named locale(s) | one module | one locale-prefixed route>
- `/api/health` status: <200 body / failing — check first; it proves boot, routing, serialization>
- Gateway mode: <SERVER_API_MOCKING value; if proxying, is SERVER_API_BASE_URL upstream healthy?>
- Suspected trigger: <deploy | upstream API | infra | dependency/CDN | unknown>
- Started at / detected at: <times; note the detection gap>

## Timeline log

Record every observation, decision, and action. Times in UTC. Append, never rewrite.

| Time (UTC) | Who    | Entry (observation / decision / action) |
| ---------- | ------ | --------------------------------------- |
| <HH:MM>    | <name> | Incident declared: <trigger>            |
| <HH:MM>    | <name> | <entry>                                 |

## Mitigation

- [ ] Rollback evaluated against the decision criteria in
      [rollback-template.md](rollback-template.md) — decision: <roll back / fix forward> because <reason>
- [ ] If rolling back: rollback runbook opened and linked here: <link>
- [ ] If fixing forward: fix ships through the normal gates (`npm run validate`) — Sev-1 scope
      reductions MUST be logged in the timeline with commander approval
- [ ] Mitigation verified with the relevant [release smoke test](release-smoke-test-template.md) items

## Communications

- **Cadence:** Sev-1: every 30 min. Sev-2: every 60 min. Sev-3/4: at status changes.
- **Channels:** <incident channel>, <status page>, <stakeholder list>
- Each update states: current status, user impact, next update time. No speculation about cause
  in external comms until confirmed.

| Time (UTC) | Channel   | Summary       |
| ---------- | --------- | ------------- |
| <HH:MM>    | <channel> | <update sent> |

## Resolution

- Resolved at: <YYYY-MM-DD HH:MM UTC>; total user impact duration: <duration>
- Final cause (one sentence): <cause>
- Follow-up issues filed: <links>

## Postmortem

Sev-1 and Sev-2 REQUIRE a blameless postmortem within 5 working days, using the retrospective
format in [docs/features/_template/13-retrospective.md](../docs/features/_template/13-retrospective.md).
Add durable lessons to [memory/known-pitfalls.md](../memory/known-pitfalls.md); user-visible
residual issues go into a filled [support/known-issues-template.md](../support/known-issues-template.md).
Postmortem document: <link>
