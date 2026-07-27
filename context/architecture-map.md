# Architecture Map

The canonical map of strict-next-ranger. Every directory below exists in the repo today.
The layer policy at the bottom is enforced mechanically by the
`frontend-architecture/no-restricted-layer-imports` rule configured in
[eslint/architecture.config.mjs](../eslint/architecture.config.mjs) — this page is its
human-readable twin.

## Annotated source tree

```
src/
├── proxy.ts                     # Next 16 proxy: per-request nonce CSP (script-src 'self' 'nonce-…' 'strict-dynamic')
├── app/                         # Routes, layouts, route handlers ONLY — no business logic
│   ├── (redirect)/              # Root redirect to the default locale
│   ├── [locale]/                # Every page URL is locale-prefixed
│   │   ├── (auth)/login/        # Login route
│   │   ├── (dashboard)/         # Articles and settings
│   │   ├── (public)/            # Home, about, contact, FAQ, features
│   │   ├── (workbench)/         # Living primitive showcase
│   │   └── offline/             # PWA offline fallback
│   ├── api/gateway/[...path]/   # BFF gateway route → gateway-handler.ts (mock fixtures or upstream proxy)
│   ├── api/health/              # Health route → buildHealthReport service
│   ├── providers.tsx, error.tsx, global-error.tsx, not-found.tsx
│   ├── manifest.ts, robots.ts, sitemap.ts
│   └── styles.css               # Tailwind v4 CSS-first tokens; dark theme via [data-theme='dark']
├── modules/                     # Feature modules — cross-module imports ONLY via @/modules/<feature> (index.ts)
│   ├── articles/                # Flagship reference module: full layer anatomy
│   │   ├── api/                 # Wire types (snake_case) + mock fixtures served by the BFF gateway
│   │   ├── gateway/             # HTTP contract layer: httpClient + buildGatewayPath + schema parse
│   │   ├── services/            # React-free use-case functions (gateway → mapper → domain)
│   │   ├── queries/             # Query-key builder, useAppQuery/useAppMutation bindings, invalidation
│   │   ├── mappers/             # Wire snake_case → domain camelCase
│   │   ├── schemas/             # Zod schemas (wire validation, form validation)
│   │   ├── hooks/               # Orchestration: query + i18n + helpers → view models
│   │   ├── containers/          # 'use client' glue: hooks → components, does the .map()
│   │   ├── components/          # TSX-only *.component.tsx — no hooks, no logic, no raw copy
│   │   ├── helpers/ utils/      # Pure display/logic functions (100% coverage required)
│   │   ├── types/ enums/ constants/  # Domain types, enum-like objects, message keys, style bundles
│   │   ├── test/                # Module unit tests (colocated per module)
│   │   └── index.ts             # Public surface — the only legal cross-module entry point
│   ├── auth/                    # Login form, useAuthStore session snapshot (cookie-session, token-free)
│   ├── health/                  # buildHealthReport service behind /api/health
│   ├── marketing/               # Localized public pages, contact, SEO schema
│   ├── pwa/                     # Service-worker registration
│   ├── site-navigation/         # Navbar, sidebar, footer, breadcrumbs
│   └── ui-preferences/          # Theme/direction/sidebar store + hydration/persistence/DOM-sync effects
├── shared/                      # Generic building blocks — MUST never import from modules or app
│   ├── accessibility/           # Landmark ids, skip-link helpers
│   ├── api/                     # API_ROUTES, buildGatewayPath (api-routes.constants.ts)
│   ├── components/              # data-display/ feedback/ forms/ layout/ primitives/ types/
│   ├── config/                  # appConfig (app-config.ts)
│   ├── constants/               # ROUTE_PATHS, STORAGE_KEYS, TEST_IDS, FALLBACK_ERROR_COPY
│   ├── enums/                   # AppTheme, AppDirection (as-const objects)
│   ├── errors/                  # AppError + toAppError, ERROR_MESSAGE_KEYS, mapErrorToMessageKey
│   ├── fonts/                   # app-fonts.ts — the only next/font owner (interFont)
│   ├── helpers/                 # buildPageTitle and friends
│   ├── i18n/                    # I18N_NAMESPACES
│   ├── mappers/                 # mapSchemaIssuesToFieldErrors
│   ├── security/                # isSafeExternalUrl
│   ├── testing/                 # buildIndexedTestId
│   ├── types/ utils/            # Shared types; isDefined, assertNever
├── packages/                    # One owning wrapper per third-party vendor (facades) — bottom of the stack
│   ├── axios/ query/ zustand/ zod/ date/ forms/ i18n/ toast/ icons/
│   ├── ui-primitives/ virtuoso/ link/ image/ navigation/ env/ browser/ storage/ logger/
│   └── (see context/package-boundaries.md for the full vendor → exports table)
└── tests/                       # Cross-module test infrastructure
    ├── setup/                   # vitest.setup.ts (jest-dom, MSW server, server-only mock)
    ├── msw/                     # MSW node server + handlers (the only MSW owner)
    ├── helpers/                 # render-with-providers.tsx
    ├── unit/ integration/       # Cross-module Vitest suites
    ├── e2e/ accessibility/ visual/  # Playwright *.e2e.ts, *.a11y.ts, *.visual.ts
    └── factories/               # Test data factories
```

## One-way dependency diagram

Arrows mean "may import from". There are no arrows in the other direction — ever.

```
src/app (routes/layouts/handlers)
   │
   ▼
src/modules/<feature>  (cross-module: only via the other module's index.ts)
   │  containers ──► components            containers ──► hooks
   │  hooks ──► queries ──► services ──► gateway ──► api types
   │  hooks ──► store        mappers/schemas/utils/helpers ──► types/enums/constants only
   ▼
src/shared (generic building blocks — knows nothing about modules or app)
   │
   ▼
src/packages/<vendor> (owner wrappers — know nothing about shared, modules, or app)
   │
   ▼
node_modules (raw vendors — importable ONLY inside their owner wrapper)
```

## Layer import policy table

Verbatim policy from [eslint/architecture.config.mjs](../eslint/architecture.config.mjs)
(layer ids come from `eslint/architecture-plugin/shared/policy-utils.mjs`). "Forbidden imports"
means the ESLint rule errors — and lint runs with `--max-warnings=0`.

| From layer                                                           | Forbidden imports                                                                          | Rationale (rule message)                                                         |
| -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------- |
| `module-components`                                                  | module-hooks, module-queries, module-services, module-gateway, module-store, app           | Components receive computed props; behavior lives in containers/hooks.           |
| `module-hooks`                                                       | module-components, module-containers, app                                                  | Hooks orchestrate data and state; they never reach into the view layer.          |
| `module-queries`                                                     | module-components, module-containers, app                                                  | Query files bind services to the cache; they never import view code.             |
| `module-services`                                                    | module-components, module-containers, module-hooks, module-store, module-queries, app      | Services are pure API/use-case functions; React does not exist here.             |
| `module-gateway`                                                     | module-components, module-containers, module-hooks, module-store, module-queries, app      | Gateways speak HTTP contracts only.                                              |
| `module-store`                                                       | module-components, module-containers, module-services, module-queries, module-gateway, app | Stores hold client global state only; server data belongs to the query cache.    |
| `module-containers`                                                  | module-services, module-gateway, app                                                       | Containers consume hooks/queries, never services directly.                       |
| `module-utils`, `module-helpers`, `module-mappers`, `module-schemas` | every module layer except types/enums/constants, plus app                                  | Pure logic layers depend only on types/constants/enums and other pure logic.     |
| `shared`                                                             | every module layer, app                                                                    | Shared code is generic; it must never know about feature modules or routes.      |
| `packages`                                                           | every module layer, shared, app                                                            | Package wrappers own one vendor and expose a facade; they sit below every layer. |

Related reading: [rules/01-next-app-router-architecture.md](../rules/01-next-app-router-architecture.md)
(the normative rule), [context/package-boundaries.md](./package-boundaries.md) (vendor ownership),
[docs/eslint/no-restricted-layer-imports.md](../docs/eslint/no-restricted-layer-imports.md)
(rule documentation), [architecture/adrs/0001-strict-next-architecture.md](../architecture/adrs/0001-strict-next-architecture.md)
(the founding decision).
