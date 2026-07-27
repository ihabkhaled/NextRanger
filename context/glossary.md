# Glossary

Repo-specific vocabulary. Reviews, rules, and skills use these terms with exactly these meanings.

**Module** — A feature directory under `src/modules/<feature>` (articles, auth, health,
ui-preferences) containing the full layer anatomy (api, gateway, services, queries, store,
containers, components, hooks, utils, helpers, mappers, schemas, types, enums, constants, test)
plus a public surface. Modules are the unit of ownership and of cross-team isolation.

**Layer** — A named sub-directory of a module (or the top-level `app` / `shared` / `packages`
tiers) with a one-way import policy. The policy table lives in
[eslint/architecture.config.mjs](../eslint/architecture.config.mjs) and is mapped in
[context/architecture-map.md](./architecture-map.md).

**Public surface** — A module's `index.ts`. The only file another module or `src/app` may import
from that module (`@/modules/<feature>`). Anything not re-exported there is module-private;
reaching past it violates `no-cross-module-deep-imports`.

**Owner wrapper** — The single directory that may import a given third-party vendor, e.g.
`src/packages/query` for `@tanstack/react-query`, or `src/tests/msw` for `msw`. Registered in
[eslint/package-boundaries.config.mjs](../eslint/package-boundaries.config.mjs).

**Facade** — The app-named API an owner wrapper exports (`useAppQuery`, `showToast`,
`readStorageJson`). The facade is what the rest of the codebase programs against; the vendor API
is an implementation detail that can be swapped inside the wrapper.

**View model** — The fully-computed, fully-translated object a hook returns for a container to
render, e.g. `ArticlesListViewModel` from
[src/modules/articles/hooks/use-articles-list.hook.ts](../src/modules/articles/hooks/use-articles-list.hook.ts).
Components receive view models as props and add nothing.

**Wire type** — The snake_case shape of an API payload as it crosses HTTP, declared in
`src/modules/<f>/api/*.api.types.ts` and validated by a Zod schema in the gateway. Mappers convert
wire types to domain types; nothing above the service layer ever sees snake_case.

**BFF gateway** — The `/api/gateway/[...path]` route handler
(`src/app/api/gateway/[...path]/`, delegating to `gateway-handler.ts`). With
`SERVER_API_MOCKING=enabled` (default) it serves module mock fixtures; otherwise it proxies to
`SERVER_API_BASE_URL`. Client code only ever calls same-origin paths built with
`buildGatewayPath` from [src/shared/api/api-routes.constants.ts](../src/shared/api/api-routes.constants.ts).

**Client boundary** — A file starting with `'use client'`. In this repo every client boundary MUST
carry a `// client-boundary-reason: …` comment (enforced by `require-client-component-reason`),
and boundaries are pushed down to containers, never hoisted to layouts.

**Message key** — A dot-path identifier for user-visible copy (e.g. `AUTH_MESSAGE_KEYS.success`)
resolved against the catalogs in `src/packages/i18n/messages/{en,ar}.json`. Raw literal copy in
JSX or schemas violates `no-raw-i18n-text`; the sole exception is `FALLBACK_ERROR_COPY` used by
`src/app/global-error.tsx`.

**Query key builder** — The one file per module allowed to construct TanStack Query cache keys,
e.g. [src/modules/articles/queries/article-query-keys.ts](../src/modules/articles/queries/article-query-keys.ts).
Inline key arrays anywhere else violate `no-inline-query-keys`.

**Enum-like object** — An `as const` object plus derived union type (e.g. `AppTheme`,
`AppDirection` in `src/shared/enums/`) used instead of TypeScript `enum`, keeping erasable syntax
and exact string values.

**Gate** — An automated pass/fail check a change MUST clear: lint (`--max-warnings=0`), typecheck,
coverage thresholds, build, e2e/a11y/visual suites, `security:audit`, `security:scan`, knip,
dependency-cruiser. `npm run validate` runs them all; the policy is
[rules/19-release-gates.md](../rules/19-release-gates.md).

**Exception** — A documented, reviewed, time-boxed deviation from a rule (e.g. an
`eslint-disable`). Every exception needs a file in [docs/exceptions/](../docs/exceptions/README.md)
following [docs/exceptions/exception-template.md](../docs/exceptions/exception-template.md);
undocumented disables fail review.

**Container** — A `*.container.tsx` client component that connects hooks to TSX-only components
and performs the `.map()` over child elements. See
[rules/02-components-and-containers.md](../rules/02-components-and-containers.md).

**Workbench** — The `/<locale>/workbench` route (`src/app/[locale]/(workbench)/workbench/page.tsx`), the living
showcase of design-system primitives adopted instead of Storybook —
[architecture/adrs/0002-component-workbench-over-storybook.md](../architecture/adrs/0002-component-workbench-over-storybook.md).
