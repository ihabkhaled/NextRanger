# Codebase Navigation

Task → location lookup for strict-next-ranger. If the table does not answer your question,
the matching skill in [skills/README.md](../skills/README.md) walks the full procedure.

## Where do I put X?

| I need to add…                           | Location                                                                                                                                                 | Reference example                                                                                                             |
| ---------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| A new page / route                       | `src/app/(<group>)/<route>/page.tsx`, path constant in [src/shared/constants/route-paths.constants.ts](../src/shared/constants/route-paths.constants.ts) | [skills/add-route.md](../skills/add-route.md)                                                                                 |
| A whole feature                          | `src/modules/<feature>/` with a public `index.ts`                                                                                                        | `src/modules/articles/`                                                                                                       |
| A presentational piece of UI             | `src/modules/<f>/components/<name>.component.tsx` (TSX-only)                                                                                             | [src/modules/articles/components/article-card.component.tsx](../src/modules/articles/components/article-card.component.tsx)   |
| The glue between hooks and components    | `src/modules/<f>/containers/<name>.container.tsx` (`'use client'` + reason comment)                                                                      | [src/modules/articles/containers/articles-list.container.tsx](../src/modules/articles/containers/articles-list.container.tsx) |
| Orchestration / view-model building      | `src/modules/<f>/hooks/use-<name>.hook.ts`                                                                                                               | [src/modules/articles/hooks/use-articles-list.hook.ts](../src/modules/articles/hooks/use-articles-list.hook.ts)               |
| An HTTP call                             | `src/modules/<f>/gateway/<f>.gateway.ts` (via `httpClient` + `buildGatewayPath`)                                                                         | [src/modules/articles/gateway/articles.gateway.ts](../src/modules/articles/gateway/articles.gateway.ts)                       |
| A React-free use case                    | `src/modules/<f>/services/<f>.service.ts`                                                                                                                | [src/modules/articles/services/article.service.ts](../src/modules/articles/services/article.service.ts)                       |
| A query / mutation                       | `src/modules/<f>/queries/*.queries.ts` / `*.mutations.ts`; keys ONLY in the builder file                                                                 | [src/modules/articles/queries/article-query-keys.ts](../src/modules/articles/queries/article-query-keys.ts)                   |
| Client global state                      | `src/modules/<f>/store/<f>.store.ts` via `createAppStore`                                                                                                | [src/modules/ui-preferences/store/ui-preferences.store.ts](../src/modules/ui-preferences/store/ui-preferences.store.ts)       |
| Validation                               | `src/modules/<f>/schemas/<f>.schema.ts` (error messages = i18n keys)                                                                                     | [src/modules/auth/schemas/auth.schema.ts](../src/modules/auth/schemas/auth.schema.ts)                                         |
| Wire → domain conversion                 | `src/modules/<f>/mappers/<f>.mapper.ts`                                                                                                                  | [src/modules/articles/mappers/article.mapper.ts](../src/modules/articles/mappers/article.mapper.ts)                           |
| Wire types + mock fixtures               | `src/modules/<f>/api/` (`*.api.types.ts`, `*.mock.ts`)                                                                                                   | `src/modules/articles/api/articles.mock.ts`                                                                                   |
| User-visible copy                        | Message key constants in `constants/`, catalog entries in `src/packages/i18n/messages/{en,ar}.json`                                                      | [skills/add-i18n-message-key.md](../skills/add-i18n-message-key.md)                                                           |
| Tailwind class bundles                   | `*.variants.ts` or `constants/<f>-style.constants.ts` — never inline outside the design system                                                           | `src/modules/articles/constants/article-style.constants.ts`                                                                   |
| A generic reusable component             | `src/shared/components/{data-display,feedback,forms,layout,primitives}/`                                                                                 | `src/shared/components/feedback/error-state.component.tsx`                                                                    |
| A generic pure function                  | `src/shared/utils/` or `src/shared/helpers/`                                                                                                             | `src/shared/utils/assert-never.util.ts`                                                                                       |
| A new third-party package                | `src/packages/<vendor>/` owner wrapper + boundary entry                                                                                                  | [skills/create-package-wrapper.md](../skills/create-package-wrapper.md)                                                       |
| An environment variable                  | [.env.example](../.env.example) + `src/packages/env` (client) or `src/packages/env/server`                                                               | [rules/17-configuration-environment.md](../rules/17-configuration-environment.md)                                             |
| Module unit tests                        | `src/modules/<f>/test/`                                                                                                                                  | [testing/unit-testing-standard.md](../testing/unit-testing-standard.md)                                                       |
| Cross-module / e2e / a11y / visual tests | `src/tests/{integration,e2e,accessibility,visual}/`                                                                                                      | [testing/README.md](../testing/README.md)                                                                                     |
| An eslint-disable                        | Never inline without a documented exception in [docs/exceptions/](../docs/exceptions/README.md)                                                          | [docs/exceptions/exception-template.md](../docs/exceptions/exception-template.md)                                             |

## File suffix conventions

| Suffix                                                                | Layer                 | Contract                                                                                                         |
| --------------------------------------------------------------------- | --------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `.component.tsx`                                                      | components            | TSX only: no hooks, no logic, no inline declarations, no raw copy, no raw `className` outside the design system. |
| `.container.tsx`                                                      | containers            | `'use client'` + `// client-boundary-reason: …`; connects hooks to components; owns the `.map()`.                |
| `.hook.ts`                                                            | hooks                 | `use*` orchestration; returns a fully-computed view model.                                                       |
| `.service.ts`                                                         | services              | React-free use-case functions.                                                                                   |
| `.gateway.ts`                                                         | gateway               | HTTP contract only: `httpClient`, `buildGatewayPath`, schema parse.                                              |
| `.queries.ts` / `.mutations.ts` / `-query-keys.ts` / `.invalidate.ts` | queries               | Cache bindings; keys only from the builder file.                                                                 |
| `.store.ts` / `.selectors.ts`                                         | store                 | `createAppStore` state + pure selectors.                                                                         |
| `.schema.ts`                                                          | schemas               | Zod via `@/packages/zod`; messages are i18n keys.                                                                |
| `.mapper.ts`                                                          | mappers               | Wire snake_case → domain camelCase.                                                                              |
| `.api.types.ts` / `.mock.ts`                                          | api                   | Wire types and gateway mock fixtures.                                                                            |
| `.variants.ts`                                                        | design system         | cva class bundles consumed by components.                                                                        |
| `.util.ts` / `.helper.ts`                                             | utils/helpers         | Pure functions; 100% coverage required.                                                                          |
| `.types.ts` / `.enum.ts` / `.constants.ts`                            | types/enums/constants | Types, as-const enum-like objects, frozen constants.                                                             |
| `.test.ts(x)` / `.e2e.ts` / `.a11y.ts` / `.visual.ts`                 | tests                 | Vitest / Playwright e2e / axe / visual suites.                                                                   |

## Path aliases

Declared in [tsconfig.json](../tsconfig.json); Vitest resolves them through Vite's native
`resolve.tsconfigPaths` support.

| Alias         | Resolves to        | Typical use                                                                                        |
| ------------- | ------------------ | -------------------------------------------------------------------------------------------------- |
| `@/*`         | `./src/*`          | General absolute imports (`@/packages/zod`, `@/shared/constants/...`).                             |
| `@app/*`      | `./src/app/*`      | Rarely needed — only app-internal wiring.                                                          |
| `@modules/*`  | `./src/modules/*`  | Cross-module imports of a public surface (`@/modules/<feature>` form is equivalent and preferred). |
| `@shared/*`   | `./src/shared/*`   | Shared building blocks.                                                                            |
| `@packages/*` | `./src/packages/*` | Owner wrapper facades.                                                                             |
| `@tests/*`    | `./src/tests/*`    | Test helpers, MSW handlers, factories.                                                             |

Deep imports into another module's internals (anything past `@/modules/<feature>`) are blocked by
`frontend-architecture/no-cross-module-deep-imports` — see
[docs/eslint/no-cross-module-deep-imports.md](../docs/eslint/no-cross-module-deep-imports.md).
