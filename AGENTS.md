# AGENTS.md — Universal Agent Entrypoint

This repo is **strict-next-ranger**: a strict Next.js frontend operating system — a
production-grade starter that teams clone for enterprise frontend work. Every architectural
decision is enforced by a custom ESLint plugin (`eslint/architecture-plugin.mjs`), typed
strictly, and gated by tests. Your job as an agent is never to fight the guardrails: when a
rule blocks you, the code is in the wrong layer — move it, do not disable the rule.

## Read first, in this order

1. [.ai/BOOTSTRAP.md](.ai/BOOTSTRAP.md) — minimal-context loading protocol.
2. [context/ai-task-card.md](context/ai-task-card.md) — the low-token task router.
3. [context/architecture-map.md](context/architecture-map.md) — where everything lives.
4. [rules/00-non-negotiable-rules.md](rules/00-non-negotiable-rules.md) — the law.
5. The rule + skill matching your task (routing table below).
6. [memory/known-pitfalls.md](memory/known-pitfalls.md) — mistakes already made once.

## Non-negotiables digest

- Third-party packages are imported **only** through their owning wrapper in
  `src/packages/<vendor>` (ownership map: `eslint/package-boundaries.config.mjs`).
- Cross-module imports go **only** through the module public surface
  `@/modules/<feature>` (its `index.ts`). Deep imports across modules are banned.
- `*.component.tsx` files are TSX-only: no hooks, no logic, no inline declarations,
  no raw copy, no raw `className` outside the design system.
- Containers (`*.container.tsx`) carry `'use client'` plus a
  `// client-boundary-reason: …` comment, connect hooks to components, and own the `.map()`.
- No `process.env` outside `src/packages/env`; server env only via `@/packages/env/server`
  (guarded by `server-only`). No browser globals outside `src/packages/browser` / `src/packages/storage`.
- Query keys come only from builder files (e.g. `src/modules/articles/queries/article-query-keys.ts`).
  Use `useAppQuery` / `useAppMutation` from `@/packages/query`, never raw `@tanstack/react-query`.
- Every user-visible string is a next-intl message key present in every catalog named by
  `SUPPORTED_LOCALES`.
  The only exception is `FALLBACK_ERROR_COPY` in the global error boundary.
- Page routes live in `src/app/[locale]` and APIs in `src/app/api`; navigate via locale-free `ROUTE_PATHS` plus
  `buildLocalizedPath` / `buildLocalizedLocation`
  (`src/shared/constants/route-paths.constants.ts`); API calls go through `httpClient` +
  `buildGatewayPath` to the same-origin BFF gateway.
- Lint runs with `--max-warnings=0`. Any `eslint-disable` requires a documented exception
  in [docs/exceptions/](docs/exceptions/README.md).
- TDD. Coverage: 95% global, 100% for utils/helpers/mappers/schemas/query-key builders.
  No `.only`, no skipped tests without a documented exception.
- Never `dangerouslySetInnerHTML`. CSP nonces come from `src/proxy.ts`; errors surface as
  message keys via `mapErrorToMessageKey`, never raw server messages.

## Skills routing table

| Task                      | Skill                                                                                                                                         | Primary rule                                         |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| New feature module        | [skills/create-module.md](skills/create-module.md)                                                                                            | [rules/01](rules/01-next-app-router-architecture.md) |
| Component / container     | [skills/create-component.md](skills/create-component.md) / [skills/create-container.md](skills/create-container.md)                           | [rules/02](rules/02-components-and-containers.md)    |
| Hook                      | [skills/create-hook.md](skills/create-hook.md)                                                                                                | [rules/03](rules/03-hooks.md)                        |
| Service / gateway         | [skills/create-service.md](skills/create-service.md)                                                                                          | [rules/04](rules/04-services-api-gateway.md)         |
| Query / mutation          | [skills/create-query.md](skills/create-query.md) / [skills/create-mutation.md](skills/create-mutation.md)                                     | [rules/05](rules/05-tanstack-query.md)               |
| Zustand store             | [skills/create-zustand-store.md](skills/create-zustand-store.md)                                                                              | [rules/06](rules/06-zustand.md)                      |
| Wrap a new package        | [skills/create-package-wrapper.md](skills/create-package-wrapper.md)                                                                          | [rules/09](rules/09-library-wrapping.md)             |
| Add a route               | [skills/add-route.md](skills/add-route.md)                                                                                                    | [rules/01](rules/01-next-app-router-architecture.md) |
| i18n message key          | [skills/add-i18n-message-key.md](skills/add-i18n-message-key.md)                                                                              | [rules/14](rules/14-i18n-rtl.md)                     |
| Form                      | [skills/add-form.md](skills/add-form.md)                                                                                                      | [rules/02](rules/02-components-and-containers.md)    |
| Long list                 | [skills/add-virtualized-list.md](skills/add-virtualized-list.md)                                                                              | [rules/12](rules/12-performance.md)                  |
| Unit / integration tests  | [skills/write-unit-tests.md](skills/write-unit-tests.md) / [skills/write-integration-tests.md](skills/write-integration-tests.md)             | [rules/15](rules/15-testing-and-coverage.md)         |
| E2E / visual tests        | [skills/write-e2e-tests.md](skills/write-e2e-tests.md) / [skills/write-visual-tests.md](skills/write-visual-tests.md)                         | [rules/15](rules/15-testing-and-coverage.md)         |
| A11y tests / review       | [skills/write-accessibility-tests.md](skills/write-accessibility-tests.md) / [skills/accessibility-review.md](skills/accessibility-review.md) | [rules/13](rules/13-accessibility.md)                |
| Security review           | [skills/security-review.md](skills/security-review.md)                                                                                        | [rules/11](rules/11-security.md)                     |
| Performance review        | [skills/performance-review.md](skills/performance-review.md)                                                                                  | [rules/12](rules/12-performance.md)                  |
| Refactor a feature        | [skills/refactor-feature.md](skills/refactor-feature.md)                                                                                      | [rules/20](rules/20-review-checklist.md)             |
| Lint / typecheck failures | [skills/fix-eslint-typecheck.md](skills/fix-eslint-typecheck.md)                                                                              | [rules/10](rules/10-eslint-typescript.md)            |
| Pre-merge validation      | [skills/final-validation.md](skills/final-validation.md)                                                                                      | [rules/19](rules/19-release-gates.md)                |
| Toolchain upgrade         | [skills/upgrade-toolchain.md](skills/upgrade-toolchain.md)                                                                                    | [rules/10](rules/10-eslint-typescript.md)            |

Full index: [skills/README.md](skills/README.md). Reviewer personas: [agents/README.md](agents/README.md).

## Validation commands

Run before declaring any task done:

```bash
npm run lint        # ESLint 9 flat config, --max-warnings=0
npm run typecheck   # stable TypeScript 7 over app/test/node; prints compiler versions
npm run typecheck:compat # TypeScript 6 API compatibility check for ESLint/tooling
npm run test        # Vitest (npm run test:coverage for the coverage gate)
npm run build       # next build --turbopack
```

Aggregates: `npm run quality` (localized asset drift + lint + typecheck + coverage + build +
dead code + circular dependencies), `npm run gate:push` (format + quality + production audit),
and `npm run validate` (push gate + e2e + Trivy).
Run the two one-time, local Playwright steps once per environment before the first
`npm run validate`: `npm run test:e2e:install` (downloads the Chromium binary) and
`npm run test:e2e:baseline` (refreshes every current-OS visual snapshot; run only for an
intentional UI change and review each image).
The pre-push hook (`.husky/pre-push`) runs `npm run gate:push`; do not push red.
Commit each coherent behavior, design, test, or documentation concern separately with a
conventional message after its focused gate passes, then push the authorized branch promptly.
Never bypass hooks, mix unrelated concerns, or defer all publication to one final mega-commit.
