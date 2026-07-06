# 00 — Intake

> Capture the raw request exactly as it arrived, then decide whether it enters the lifecycle. Keep this document short; analysis belongs in later stages.

## Identification

- **Feature slug:** `<kebab-case-slug — becomes docs/features/<slug>/ and, usually, the module name under src/modules/>`
- **Title:** <one-line human-readable feature name>
- **Requester:** <name, role, team>
- **Date received:** <YYYY-MM-DD>
- **Intake owner:** <who is shepherding this document>

## The request, verbatim

<Paste or transcribe the original request — ticket text, Slack message, meeting note. Do not paraphrase here; paraphrasing happens in 01-business-analysis.md.>

## Initial classification

- **Type:** <new feature | enhancement to existing module | refactor | compliance/security work>
- **Suspected surface:** <which existing modules under src/modules/ (articles, auth, health, ui-preferences) or shared areas (src/shared/, src/packages/) look affected — best guess only>
- **New route needed?** <yes/no — if yes, note that ROUTE_PATHS in src/shared/constants/route-paths.constants.ts will gain an entry (stage 04 decides the path)>
- **New third-party package suspected?** <yes/no — if yes, flag early: every vendor needs an owning wrapper under src/packages/ per rules/09-library-wrapping.md>

## Urgency and sizing (gut check)

- **Priority:** <P0 incident-adjacent | P1 committed | P2 planned | P3 opportunistic>
- **T-shirt size:** <S | M | L | XL — refined in 07-implementation-plan.md>
- **Hard deadline:** <date + why, or "none">

## Go / no-go

- **Decision:** <proceed to 01-business-analysis | reject | park>
- **Rationale:** <one or two sentences>

## Gate

- [ ] Request captured verbatim
- [ ] Slug chosen and directory `docs/features/<slug>/` created from `_template/`
- [ ] Decision recorded with rationale

**Signed off by:** <name> — <YYYY-MM-DD>
