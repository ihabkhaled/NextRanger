# 07 — Implementation Plan

> Break stages 04–06 into ordered, reviewable slices. Each task names the skill that scaffolds it — the skills encode the repo's conventions so nothing is improvised.

## Build order

<The proven order for a data-backed feature: wire types + mocks → schema + mapper → gateway → service → query keys → queries/mutations → hooks → components → containers → route → tests alongside each slice. Adjust as needed.>

| #   | Task                        | Skill                                                                     | Output files                                  | Depends on |
| --- | --------------------------- | ------------------------------------------------------------------------- | --------------------------------------------- | ---------- |
| 1   | <Scaffold module skeleton>  | [skills/create-module.md](../../../skills/create-module.md)               | <src/modules/<slug>/…>                        | —          |
| 2   | <Wire types + mock fixture> | —                                                                         | <api/<slug>.api.types.ts, api/<slug>.mock.ts> | 1          |
| 3   | <Schema + mapper>           | —                                                                         | <schemas/, mappers/>                          | 2          |
| 4   | <Gateway + service>         | [skills/create-service.md](../../../skills/create-service.md)             | <gateway/, services/>                         | 3          |
| 5   | <Query keys + queries>      | [skills/create-query.md](../../../skills/create-query.md)                 | <queries/>                                    | 4          |
| 6   | <Mutations + invalidation>  | [skills/create-mutation.md](../../../skills/create-mutation.md)           | <queries/>                                    | 5          |
| 7   | <Store (if client state)>   | [skills/create-zustand-store.md](../../../skills/create-zustand-store.md) | <store/>                                      | 1          |
| 8   | <View-model hook>           | [skills/create-hook.md](../../../skills/create-hook.md)                   | <hooks/>                                      | 5          |
| 9   | <TSX-only component files>  | [skills/create-component.md](../../../skills/create-component.md)         | <components/, *.variants.ts>                  | —          |
| 10  | <Container>                 | [skills/create-container.md](../../../skills/create-container.md)         | <containers/>                                 | 8, 9       |
| 11  | <Route + ROUTE_PATHS entry> | [skills/add-route.md](../../../skills/add-route.md)                       | <src/app/…/page.tsx>                          | 10         |
| 12  | <All-locale message keys>   | [skills/add-i18n-message-key.md](../../../skills/add-i18n-message-key.md) | <messages/*.json>                             | —          |
| 13  | <Forms, if any>             | [skills/add-form.md](../../../skills/add-form.md)                         | <schemas/, components/>                       | 3          |
| 14  | <Tests per stage-06 matrix> | [skills/write-unit-tests.md](../../../skills/write-unit-tests.md) etc.    | <test/, src/tests/…>                          | each slice |

## PR slicing

<Group tasks into PRs. Every PR must pass `npm run validate` on its own — no PR may leave the repo in a state that fails lint (--max-warnings=0), typecheck, tests, or coverage.>

| PR  | Tasks  | Reviewable claim                                         |
| --- | ------ | -------------------------------------------------------- |
| 1   | <1–5>  | <"data layer complete, mock-served via the BFF gateway"> |
| 2   | <8–12> | <"screen renders all four states">                       |

## Estimation and staffing

- **Estimate:** <effort per PR, total>
- **Implementer(s):** <names>
- **Reviewer(s):** <names — plus which reviewer agents run on which PR>

## Feature flags / rollout

<Does this ship dark, behind a flag, or directly? This repo has no flag service by default — if gating is needed, describe the mechanism (e.g. env-driven via src/packages/env) and its removal plan.>

## Definition of done (per PR)

- [ ] `npm run validate` passes locally (on a fresh environment run `npm run test:e2e:install` then `npm run test:e2e:baseline` first)
- [ ] `npm run quality` and `npm run quality:circular` pass (dependency-cruiser reports no cycles)
- [ ] Tests from the stage-06 matrix for the touched slices are included in the same PR
- [ ] Conventional commit messages; hooks in .husky/ not bypassed
- [ ] Review checklist [rules/20-review-checklist.md](../../../rules/20-review-checklist.md) applied

## Gate

- [ ] Every task has an owner, a skill (or "—"), and named outputs
- [ ] PR slices individually pass the definition of done
- [ ] Rollout approach agreed

**Signed off by:** <name> — <YYYY-MM-DD>
