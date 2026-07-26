# Skill: Create a Feature Module

Scaffold a new feature under `src/modules/<feature>/` with the same anatomy as the flagship
`src/modules/articles/` module. A module is the only unit of feature code in this repo — never
put feature logic in `src/app/` (routes only) or `src/shared/` (generic building blocks only).

## Read first

- [rules/01-next-app-router-architecture.md](../rules/01-next-app-router-architecture.md)
- [rules/00-non-negotiable-rules.md](../rules/00-non-negotiable-rules.md)
- [context/reference-patterns.md](../context/reference-patterns.md)

## Step 0 — Test plan first (TDD)

Before creating any file, write the test plan: which behaviors the module must exhibit, which
layers get unit tests in `src/modules/<feature>/test/`, which flows get integration tests in
`src/tests/integration/`, and which user journeys get e2e specs in `src/tests/e2e/`. Follow
[testing/testing-strategy.md](../testing/testing-strategy.md). Write failing tests alongside each
layer as you build it — never after the fact.

## Steps

1. Pick a kebab-case feature name and create `src/modules/<feature>/`.
2. Create only the layers the feature needs, using the naming from `articles`:

   | Layer                 | File pattern                                                                                           | Reference                                              |
   | --------------------- | ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------ |
   | `types/`              | `<feature>.types.ts`                                                                                   | `src/modules/articles/types/article.types.ts`          |
   | `enums/`              | `<name>.enum.ts` (as-const object)                                                                     | `src/modules/articles/enums/article-status.enum.ts`    |
   | `constants/`          | `<feature>.constants.ts`, `<feature>-message-keys.constants.ts`, `<feature>-style.constants.ts`        | `src/modules/articles/constants/`                      |
   | `api/`                | `<feature>.api.types.ts` (wire snake_case), `<feature>.mock.ts`                                        | `src/modules/articles/api/`                            |
   | `schemas/`            | `<feature>.schema.ts` (Zod via `@/packages/zod`)                                                       | `src/modules/articles/schemas/article.schema.ts`       |
   | `gateway/`            | `<feature>.gateway.ts` (httpClient + `buildGatewayPath` + `parseSchema`)                               | `src/modules/articles/gateway/articles.gateway.ts`     |
   | `mappers/`            | `<feature>.mapper.ts` (wire → domain camelCase)                                                        | `src/modules/articles/mappers/article.mapper.ts`       |
   | `services/`           | `<feature>.service.ts` (React-free use-cases)                                                          | `src/modules/articles/services/article.service.ts`     |
   | `queries/`            | `<feature>-query-keys.ts`, `<feature>.queries.ts`, `<feature>.mutations.ts`, `<feature>.invalidate.ts` | `src/modules/articles/queries/`                        |
   | `store/`              | `<feature>.store.ts`, `<feature>.selectors.ts` (only for true client global state)                     | `src/modules/ui-preferences/store/`                    |
   | `hooks/`              | `use-<name>.hook.ts` (view models)                                                                     | `src/modules/articles/hooks/use-articles-list.hook.ts` |
   | `components/`         | `<name>.component.tsx` (TSX-only)                                                                      | `src/modules/articles/components/`                     |
   | `containers/`         | `<name>.container.tsx` (`'use client'` + reason)                                                       | `src/modules/articles/containers/`                     |
   | `utils/` / `helpers/` | `<name>.utils.ts`, `<name>.helper.ts` (pure)                                                           | `src/modules/articles/utils/`, `helpers/`              |
   | `test/`               | unit tests colocated per module                                                                        | `src/modules/<feature>/test/`                          |

3. Build bottom-up in this order so each layer only depends on layers below it:
   types → enums/constants → api types + schemas → gateway → mapper → service → query keys →
   queries/mutations → store → hooks → components → container. The layer import policy is
   enforced by `no-restricted-layer-imports` (table in `eslint/architecture.config.mjs`).
4. Create `src/modules/<feature>/index.ts` as the public surface. Export only what other modules
   or `src/app/` genuinely need (container, query keys/options, domain types, mock builders for the
   gateway). Model it on `src/modules/articles/index.ts`. Everything not exported is private;
   deep imports are blocked by `no-cross-module-deep-imports`.
5. Add message keys to `src/packages/i18n/messages/en.json` **and** `ar.json` under a new
   namespace, register the namespace in `src/shared/i18n/i18n-namespaces.constants.ts`, and mirror
   the keys in `constants/<feature>-message-keys.constants.ts`
   ([skills/add-i18n-message-key.md](add-i18n-message-key.md)).
6. Wire the module into a route: add a page under `src/app/` per
   [skills/add-route.md](add-route.md), add the path to
   `src/shared/constants/route-paths.constants.ts`, and render the container the way
   `src/app/(dashboard)/articles/page.tsx` renders `ArticlesListContainer` from `@/modules/articles`.
7. If the module talks to the backend, add mock fixtures in `api/<feature>.mock.ts`, export the
   builders from `index.ts`, and register the paths in
   `src/app/api/gateway/[...path]/gateway-handler.ts` (`respondFromMock`) so the app keeps running
   with `SERVER_API_MOCKING=enabled` and no backend. Add matching MSW handlers in
   `src/tests/msw/handlers/` for tests.
8. Add test ids to `src/shared/constants/test-ids.constants.ts` and finish the tests from Step 0.

## Forbidden shortcuts

- Never import a vendor package directly — go through the owner in `src/packages/`
  (`no-raw-package-imports`, ownership map in `eslint/package-boundaries.config.mjs`).
- Never deep-import another module (`@/modules/articles/services/...`) — only `@/modules/articles`.
- Never inline query keys, raw copy, raw `className` strings, or `process.env` reads.
- Never start with the UI and "add the service later" — the bottom-up order is mandatory.
- Never skip the `ar.json` catalog or the mock fixtures "for now".

## Validation

```bash
npm run lint
npm run typecheck
npm run test
npm run quality        # lint + TypeScript 7 + coverage + build
npm run quality:circular # dependency-cruiser cycle check
npm run dev            # manually exercise the route with mocks enabled
```

## Definition of done

- All layers present are wired bottom-up; `index.ts` is the only cross-module entry point.
- Route renders the container; the flow works end-to-end against gateway mocks.
- en + ar messages exist; unit + integration tests pass; coverage thresholds in
  `vitest.config.mts` hold (95% global, 100% for utils/helpers/mappers/schemas/query keys).
- `npm run validate` passes with zero warnings and no new ESLint exceptions.
