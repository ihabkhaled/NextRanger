# Documentation Baseline

Documentation is part of the change, not an afterthought. A PR is not done ([engineering-standards.md](./engineering-standards.md)) until every row of the matrix below that matches the change has been satisfied. Reviewers check this explicitly via [rules/20-review-checklist.md](../../rules/20-review-checklist.md).

## The four living corpora

- **rules/** — normative engineering law. Changes rarely; changing it is itself a Medium-risk change.
- **context/** — the map of the codebase for humans and agents: [context/architecture-map.md](../../context/architecture-map.md), [context/package-boundaries.md](../../context/package-boundaries.md), [context/codebase-navigation.md](../../context/codebase-navigation.md), [context/reference-patterns.md](../../context/reference-patterns.md), [context/glossary.md](../../context/glossary.md).
- **memory/** — accumulated decisions and pitfalls: append-mostly records under [memory/README.md](../../memory/README.md).
- **release-notes/** — user- and support-facing history per release.

## Update matrix

| Change type                                                   | rules/                                | context/                                | memory/                                                | release-notes/         | Other                                                                                    |
| ------------------------------------------------------------- | ------------------------------------- | --------------------------------------- | ------------------------------------------------------ | ---------------------- | ---------------------------------------------------------------------------------------- |
| New feature module under `src/modules/`                       | —                                     | architecture-map, codebase-navigation   | —                                                      | MUST                   | Feature phase docs in `docs/features/<slug>/`                                            |
| New package wrapper under `src/packages/`                     | —                                     | package-boundaries                      | package-decisions (why this library, why this surface) | if user-visible        | Ownership map `eslint/package-boundaries.config.mjs` in same PR                          |
| New/changed custom ESLint rule                                | 10-eslint-typescript if policy shifts | —                                       | known-pitfalls (the failure the rule prevents)         | —                      | Rule doc in `docs/eslint/<rule>.md` — mandatory                                          |
| Architectural decision (layering, tooling, replacement)       | affected rule file                    | affected map file                       | relevant decision file                                 | —                      | ADR under [architecture/adrs/README.md](../../architecture/adrs/README.md) — mandatory   |
| Security posture change (headers, CSP, env, deps policy)      | 11-security                           | —                                       | security-decisions                                     | MUST                   | [security-baseline.md](./security-baseline.md) if process changed                        |
| Testing approach change (new level, threshold, helper)        | 15-testing-and-coverage               | —                                       | testing-strategy                                       | —                      | Matching standard under [testing/README.md](../../testing/README.md)                     |
| i18n/RTL or a11y convention change                            | 13-accessibility / 14-i18n-rtl        | —                                       | i18n-rtl-decisions / accessibility-decisions           | —                      | —                                                                                        |
| Design-system primitive added/changed                         | —                                     | reference-patterns if it sets a pattern | ui-design-system-decisions                             | if visual change ships | Workbench page `/workbench` updated to showcase it                                       |
| Performance-relevant change (bundle, virtualization, caching) | 12-performance if policy shifts       | —                                       | performance-decisions                                  | —                      | —                                                                                        |
| New route                                                     | —                                     | codebase-navigation                     | —                                                      | MUST                   | `ROUTE_PATHS` in `src/shared/constants/route-paths.constants.ts` (never string literals) |
| Bug fix (production regression)                               | —                                     | —                                       | known-pitfalls if the class can recur                  | MUST                   | Regression test per [qa-baseline.md](./qa-baseline.md)                                   |
| eslint-disable / @ts-expect-error / accepted vuln             | —                                     | —                                       | —                                                      | —                      | Exception doc — see [docs/exceptions/README.md](../exceptions/README.md), mandatory      |
| Copy-only change                                              | —                                     | —                                       | —                                                      | if user-visible        | Both `en.json` and `ar.json`                                                             |

"MUST" in the release-notes column means the change appears in the next release's notes; drafting happens at release time from [release-notes/release-notes-template.md](../../release-notes/release-notes-template.md).

## Rules of the corpus

- Docs live in the same PR as the code they describe. A follow-up-docs-PR promise is a review rejection.
- Every internal doc link uses repo-root-relative paths and MUST resolve — dead links are lint-level defects of the corpus.
- memory/ files are append-mostly: superseded decisions are marked superseded with a pointer, never silently deleted.
- Agent instruction files (`AGENTS.md`, `CLAUDE.md`, `CODEX.md`, `.cursor/rules/*`) are regenerated views over rules/context/memory — when those change materially, the views MUST be refreshed in the same PR.
