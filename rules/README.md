# Rules

Normative engineering rules for strict-next-ranger. Every rule file uses MUST/never/always
language and names the mechanism that enforces it (ESLint rule, TypeScript config, CI gate,
or review checklist). When a rule and the code disagree, the code is wrong.

Start with [00-non-negotiable-rules.md](00-non-negotiable-rules.md); everything else expands on it.

| Rule                                                                     | Covers                                                                                             |
| ------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------- |
| [00-non-negotiable-rules.md](00-non-negotiable-rules.md)                 | The 20 non-negotiables — the contract every change is reviewed against.                            |
| [01-next-app-router-architecture.md](01-next-app-router-architecture.md) | App Router composition: route groups, page/layout/route conventions, server-first, `src/proxy.ts`. |
| [02-components-and-containers.md](02-components-and-containers.md)       | TSX-only components, containers as the wiring layer, the view-model contract.                      |
| [03-hooks.md](03-hooks.md)                                               | Hooks as orchestrators that produce fully-translated view models.                                  |
| [04-services-api-gateway.md](04-services-api-gateway.md)                 | React-free services, Zod-parsed gateways, the BFF gateway route, mock mode.                        |
| [05-tanstack-query.md](05-tanstack-query.md)                             | Query-key builders, reusable options, exact invalidation, server state stays in the cache.         |
| [06-zustand.md](06-zustand.md)                                           | What client state is allowed in stores, store purity, selectors, effects hooks.                    |
| [07-types-enums-constants.md](07-types-enums-constants.md)               | `as const` enums, types-only files, the shared constants catalogs.                                 |
| [08-utils-helpers-mappers.md](08-utils-helpers-mappers.md)               | Utils vs helpers vs mappers vs schemas, and their 100% coverage bar.                               |
| [09-library-wrapping.md](09-library-wrapping.md)                         | One owning wrapper per vendor package under `src/packages/`.                                       |
| [10-eslint-typescript.md](10-eslint-typescript.md)                       | Flat-config layout, 14 custom architecture rules, strict TypeScript 7, zero warning severity.      |
| [11-security.md](11-security.md)                                         | CSP nonces, static headers, error sanitization, dependency scanning policy.                        |
| [12-performance.md](12-performance.md)                                   | Rendering discipline, memo boundaries, virtualization, bundle hygiene.                             |
| [13-accessibility.md](13-accessibility.md)                               | Landmarks, keyboard support, axe-clean requirement, `LANDMARK_IDS`.                                |
| [14-i18n-rtl.md](14-i18n-rtl.md)                                         | next-intl wrapper, 14 URL locales, catalog parity, RTL via `dir`.                                  |
| [15-testing-and-coverage.md](15-testing-and-coverage.md)                 | Test pyramid, MSW, coverage thresholds, no `.only`/skips.                                          |
| [16-observability-analytics.md](16-observability-analytics.md)           | Logging through `appLogger`, event discipline, no raw `console`.                                   |
| [17-configuration-environment.md](17-configuration-environment.md)       | `publicEnv`/`getServerEnv`, Zod-validated env, `.env.example` contract.                            |
| [18-error-handling.md](18-error-handling.md)                             | `AppError`, `toAppError`, message-key mapping, error boundaries.                                   |
| [19-release-gates.md](19-release-gates.md)                               | The `npm run validate` gate stack and what blocks a merge/release.                                 |
| [20-review-checklist.md](20-review-checklist.md)                         | The reviewer's pass — every rule above condensed into checkboxes.                                  |
| [21-version-control-checkpoints.md](21-version-control-checkpoints.md)   | Small coherent commits, focused proof, hooks, and prompt green publication.                        |

Related corpora: [docs/eslint/README.md](../docs/eslint/README.md) (per-rule reference),
[skills/README.md](../skills/README.md) (how-to recipes), [testing/README.md](../testing/README.md)
(testing standards), [docs/exceptions/README.md](../docs/exceptions/README.md) (the only legal
way around any rule here).
