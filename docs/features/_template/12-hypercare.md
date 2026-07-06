# 12 — Hypercare

> The watch window immediately after release. The hypercare owner monitors, triages, and records everything here; incidents follow runbooks/incident-response-template.md.

## Window

- **Feature:** <slug>
- **Released:** <YYYY-MM-DD, version/deploy id>
- **Hypercare owner:** <name>
- **Window:** <start → end; typical is 3–5 business days, longer for P0/P1 features>

## Monitoring plan

<What is being watched and where, per rules/16-observability-analytics.md. List each signal with its healthy baseline.>

| Signal                                                | Source                | Healthy baseline | Alert threshold     |
| ----------------------------------------------------- | --------------------- | ---------------- | ------------------- |
| <error rate on the feature's routes>                  | <log/monitoring tool> | <baseline>       | <threshold>         |
| <success metric from 01-business-analysis.md>         | <analytics>           | <baseline>       | <expected movement> |
| <BFF gateway errors for the feature's upstream paths> | <server logs>         | <baseline>       | <threshold>         |

## Daily log

<One entry per day of the window. "Nothing observed" is a valid, required entry.>

| Date         | Observations   | Actions taken |
| ------------ | -------------- | ------------- |
| <YYYY-MM-DD> | <observations> | <actions>     |

## Incidents

<Each incident gets its own record from runbooks/incident-response-template.md; link them here. A rollback executes runbooks/rollback-template.md as instantiated in stage 11.>

| Incident | Severity | Record | Outcome                          |
| -------- | -------- | ------ | -------------------------------- |
| <title>  | <sev>    | <link> | <resolved/rolled back/mitigated> |

## User feedback and support tickets

| Date   | Channel                   | Summary   | Disposition                                                               |
| ------ | ------------------------- | --------- | ------------------------------------------------------------------------- |
| <date> | <support/social/internal> | <summary> | <fixed / logged in support/known-issues-template.md instance / won't fix> |

## Follow-up work identified

<Defects and improvements found during hypercare that were not fixed in-window. Each becomes a tracked ticket — hypercare does not silently absorb scope.>

| Item   | Type                        | Ticket |
| ------ | --------------------------- | ------ |
| <item> | <bug/improvement/tech-debt> | <link> |

## Exit

- **Exit date:** <YYYY-MM-DD>
- **Exit criteria met:** <no open sev-1/sev-2, signals at baseline, follow-ups ticketed>

## Gate

- [ ] Daily log complete for the full window
- [ ] All incidents resolved or explicitly handed to ongoing support
- [ ] Follow-ups ticketed and prioritized
- [ ] Owner formally hands the feature to steady-state ownership

**Signed off by:** <name> — <YYYY-MM-DD>
