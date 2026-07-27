# 01 — Business Analysis

> Explain why this feature should exist, who it serves, and how success will be measured. No implementation detail belongs here.

## Problem statement

<Describe the user or business problem in plain language. What is broken, missing, or too slow today? Cite evidence: support tickets, analytics, stakeholder quotes.>

## Stakeholders

| Role              | Name              | Interest                   |
| ----------------- | ----------------- | -------------------------- |
| Sponsor           | <name>            | <why they care>            |
| Primary users     | <persona/segment> | <what they gain>           |
| Engineering owner | <name>            | <accountable for delivery> |
| <other>           | <name>            | <interest>                 |

## Current state

<How is this need handled today — workaround, manual process, competitor feature, nothing? If an existing module partially covers it, name it (e.g. src/modules/articles) and state the gap.>

## Desired outcomes

<Bullet the concrete outcomes. Each MUST be observable — a user can do X, metric Y moves, risk Z is retired.>

- <outcome 1>
- <outcome 2>

## Success metrics

| Metric                      | Baseline  | Target   | How measured                                                                                                     |
| --------------------------- | --------- | -------- | ---------------------------------------------------------------------------------------------------------------- |
| <e.g. task completion rate> | <current> | <target> | <analytics event / survey / support volume — see rules/16-observability-analytics.md for how events are emitted> |

## Constraints and assumptions

- **Constraints:** <deadlines, budget, compliance, affected locales — every user-facing key must
  land in all catalogs listed by SUPPORTED_LOCALES>
- **Assumptions:** <what we are taking on faith; each assumption is a risk to log below>

## Risks

<List business-level risks (adoption, scope creep, dependency on another team) with likelihood and impact. Technical risks belong in 04-technical-refinement.md; the aggregate view follows docs/sdlc/risk-baseline.md.>

| Risk   | Likelihood | Impact  | Mitigation   |
| ------ | ---------- | ------- | ------------ |
| <risk> | <L/M/H>    | <L/M/H> | <mitigation> |

## Gate

- [ ] Problem statement is evidence-backed
- [ ] At least one measurable success metric with baseline and target
- [ ] Sponsor named and has confirmed the outcomes

**Signed off by:** <name> — <YYYY-MM-DD>
