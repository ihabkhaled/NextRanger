# 13 — Retrospective

> Close the lifecycle by extracting durable lessons. This document is the input to the memory corpus — a retrospective that updates no memory file and proposes no rule change should say so explicitly and justify it.

## Session

- **Feature:** <slug>
- **Date:** <YYYY-MM-DD>
- **Participants:** <names>
- **Facilitator:** <name>

## Outcome vs intent

| Question                                                                         | Answer                       |
| -------------------------------------------------------------------------------- | ---------------------------- |
| Did the success metrics from 01-business-analysis.md move as targeted?           | <numbers vs targets>         |
| Was scope delivered as bounded in 02-product-requirements.md?                    | <yes / what changed and why> |
| Estimate vs actual (07-implementation-plan.md)?                                  | <planned vs actual, per PR>  |
| How many findings did stages 08–10 raise, and how many were preventable earlier? | <counts + reflection>        |
| Any hypercare incidents (12-hypercare.md)? Root causes?                          | <summary>                    |

## What went well

- <practice, tool, or decision worth repeating — be specific about which rule/skill/wrapper helped>

## What went poorly

- <friction, rework, surprise — name the stage where it should have been caught>

## Lessons → memory corpus

<Every durable lesson is written into the matching memory file in the same PR that closes this retrospective. Record the diff targets here.>

| Lesson                     | Destination file                                                                      | Written? |
| -------------------------- | ------------------------------------------------------------------------------------- | -------- |
| <pitfall discovered>       | [memory/known-pitfalls.md](../../../memory/known-pitfalls.md)                         | <y/n>    |
| <testing insight>          | [memory/testing-strategy.md](../../../memory/testing-strategy.md)                     | <y/n>    |
| <package/wrapper decision> | [memory/package-decisions.md](../../../memory/package-decisions.md)                   | <y/n>    |
| <security decision>        | [memory/security-decisions.md](../../../memory/security-decisions.md)                 | <y/n>    |
| <performance decision>     | [memory/performance-decisions.md](../../../memory/performance-decisions.md)           | <y/n>    |
| <i18n/RTL decision>        | [memory/i18n-rtl-decisions.md](../../../memory/i18n-rtl-decisions.md)                 | <y/n>    |
| <accessibility decision>   | [memory/accessibility-decisions.md](../../../memory/accessibility-decisions.md)       | <y/n>    |
| <design-system decision>   | [memory/ui-design-system-decisions.md](../../../memory/ui-design-system-decisions.md) | <y/n>    |

## Process and tooling changes proposed

<Changes to rules/, skills/, the ESLint plugin (eslint/architecture-plugin/), or the template files under docs/features/_template/ themselves. Each proposal names a concrete file and an owner.>

| Proposal   | Target file | Owner  | Status                     |
| ---------- | ----------- | ------ | -------------------------- |
| <proposal> | <path>      | <name> | <proposed/merged/rejected> |

## Gate

- [ ] Outcome vs intent table completed with real numbers
- [ ] Every lesson either written to a memory file or explicitly deemed non-durable
- [ ] Process proposals filed or consciously declined
- [ ] Feature directory frozen — no further edits after sign-off

**Signed off by:** <name> — <YYYY-MM-DD>
