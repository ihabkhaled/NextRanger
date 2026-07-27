# KIMI.md

Entrypoint for Kimi agents working in **strict-next-ranger**, a strict Next.js 16 frontend operating system. Canonical sources: [AGENTS.md](AGENTS.md), [context/architecture-map.md](context/architecture-map.md), [rules/00-non-negotiable-rules.md](rules/00-non-negotiable-rules.md).

## Repo purpose

A production-grade starter that teams clone for enterprise frontend work. A real, runnable Next.js 16 App Router application is paired with a governance layer — rules, skills, agents, context, memory — and a custom ESLint architecture plugin that turns the architecture into machine-enforced constraints, not reviewer hope.

## Stack

Next.js 16 App Router (Turbopack, typedRoutes) · React 19 · TypeScript 7 strict · Tailwind v4 (CSS-first tokens) · TanStack Query v5 · Zustand v5 · Zod v4 · next-intl (14 URL locales, RTL) · Vitest 4 + RTL · Playwright · MSW v2 · npm 12.0.1 · Node 24.18.0.

## Commands

- `npm run dev` / `build` / `start`
- `npm run lint` (`--max-warnings=0`) · `npm run lint:fix` · `npm run format`
- `npm run typecheck` (TypeScript 7) · `npm run typecheck:compat` (TypeScript 6 API)
- `npm run test` / `test:watch` / `test:coverage`
- `npm run test:e2e` / `test:a11y` / `test:visual`
- `npm run test:e2e:install` (one-time Playwright Chromium download)
- `npm run test:e2e:baseline` (refreshes all current-OS baselines; review every image)
- `npm run gate:push` (format + full quality + production dependency audit)
- `npm run validate` (push gate + e2e + Trivy)

## Architecture layers

- `src/app` — routes, layouts, route handlers only. No business logic in pages.
- `src/modules/<feature>` — feature modules with strict layers: `api/`, `gateway/`, `services/`, `queries/`, `store/`, `containers/`, `components/`, `hooks/`, `utils/`, `helpers/`, `mappers/`, `schemas/`, `types/`, `enums/`, `constants/`, `test/`. Public surface is `index.ts` — cross-module imports go ONLY through `@/modules/<feature>`.
- `src/shared` — generic building blocks (components, config, constants, errors, i18n, security, testing, types, utils). Must never import modules or app internals.
- `src/packages/<vendor>` — one owning wrapper per third-party package (axios → `httpClient`, query → `useAppQuery`, zod → `z`/`parseSchema`, i18n → `useAppTranslation`, etc.).
- `src/proxy.ts` — per-request nonce CSP.
- BFF: clients call same-origin `/api/gateway/*` via `httpClient` + `buildGatewayPath`. `SERVER_API_MOCKING=enabled` (default) serves module fixtures.

## TSX-only component rule

`*.component.tsx` files are TSX-only presentation files. They contain only:

- imports and type imports
- the exported component function
- TSX returned by that component

They must NOT contain local `const`, `let`, `var`, `type`, `interface`, `enum`, function declarations, arrow helpers, config objects, inline arrays, inline objects, magic strings, magic numbers, business rules, service calls, query logic, API logic, browser API logic, or transformation logic. Every value arrives as a prop or is imported from a `constants/`, `types/`, `enums/`, `helpers/`, or `utils/` file.

## No inline declarations rule

Hooks, services, gateways, utils, helpers, mappers, and containers must not declare inline types, interfaces, enums, constants, or local helper functions. Move them to:

- props/interfaces/types → `types/*.types.ts`
- enum-like values → `enums/*.enum.ts`
- constants/config/style bundles → `constants/*.constants.ts`
- pure computation → `utils/*.util.ts` or `helpers/*.helper.ts`
- wire/domain mapping → `mappers/*.mapper.ts`
- API schemas → `schemas/*.schema.ts`
- data fetching → `gateway/*.gateway.ts`
- business orchestration → `services/*.service.ts`
- render-ready view model orchestration → `hooks/*.hook.ts`

## Package boundary rules

Never import a third-party package directly. Use its owning wrapper in `src/packages/<vendor>` (ownership map: `eslint/package-boundaries.config.mjs`). Examples: `@/packages/axios`, `@/packages/query`, `@/packages/zod`, `@/packages/i18n`, `@/packages/ui-primitives`, `@/packages/browser`, `@/packages/storage`, `@/packages/env`.

## Layer boundary rules

Cross-module imports only via the public surface `@/modules/<feature>` (its `index.ts`). No deep imports across modules. Inside a module, the dependency direction is: containers → hooks → queries/store → services → gateway → mappers/schemas/types/constants. Services, gateways, and mappers are React-free and must not import React.

## Secure coding rules

- No raw `process.env` — use `publicEnv` from `@/packages/env` or `getServerEnv` from `@/packages/env/server` (server-only guarded).
- No browser globals (`window`, `document`, `localStorage`, etc.) outside `@/packages/browser` and `@/packages/storage`.
- No `dangerouslySetInnerHTML`.
- No raw secrets or tokens in client code, storage, or logs. Auth is cookie-session, token-free.
- External links only via `ExternalLink` from `@/packages/link` and `isSafeExternalUrl` from `src/shared/security`.
- Errors surface as sanitized message keys via `mapErrorToMessageKey`; never render raw vendor/server errors.
- CSP nonce comes from `src/proxy.ts`; static security headers live in `next.config.ts`.

## Performance rules

- Server Components by default. Client Components only with a documented `// client-boundary-reason: …` after every `'use client'`.
- Small client boundaries: a container is the client boundary; the page and layout above it stay server components.
- No expensive transformations inside render — derived data is built in hooks and memoized with `useMemo` / `useCallback`.
- No duplicate derived state.
- Stable query keys from `*query-keys.ts` builders.
- Backend-driven pagination; virtualize lists over ~100 rows with `VirtualizedList` from `@/packages/virtuoso`.
- Add memoization only when measured; avoid clever unreadable micro-optimizations.

## Readability rules

- Small functions, small components, small hooks, small services, small utils/helpers.
- Shallow nesting; clear names; explicit responsibilities.
- No clever one-liners when a readable helper is better.
- No mixed responsibilities; split files and functions when they become hard to scan.
- No over-engineering.

## Testing expectations

- TDD: write or update the failing test first, then the code.
- Coverage: 95% global; 100% for utils, helpers, mappers, schemas, and query-key builders.
- No `.only`, no skipped tests without a documented exception.
- Module unit tests live in `src/modules/<feature>/test/`; integration tests in `src/tests/integration`; Playwright suites in `src/tests/e2e`, `src/tests/accessibility`, `src/tests/visual`.

## Quality gates

Run before declaring any task done:

```bash
npm run lint      # ESLint 9 flat config, --max-warnings=0
npm run typecheck # TypeScript 7 over app/test/node plus TypeScript 6 compatibility
npm run test      # Vitest
npm run build     # next build --turbopack
```

Aggregates: `npm run gate:push` and `npm run validate`. The pre-push hook runs `gate:push`; never push red.

## What the agent must never do

- Add `eslint-disable` without a documented exception in `docs/exceptions/`.
- Import third-party packages directly — use the `src/packages` wrapper.
- Deep-import across modules — use the `index.ts` public surface.
- Put hooks, services, gateways, queries, or business logic in a `*.component.tsx` file.
- Put React imports in services, gateways, utils, helpers, or mappers.
- Declare inline types, interfaces, enums, constants, or helper functions in hooks, services, gateways, utils, helpers, or mappers.
- Use raw `process.env`, browser globals, query keys, i18n text, or `className` strings outside approved layers.
- Change behavior without a test first.
- Skip or silence a failing gate.

## How to safely refactor

1. Audit the current structure with `npm run lint` and identify the rules that fire.
2. Write a characterization test against current behavior before moving code.
3. Move one layer at a time: pure logic down to `utils/`/`helpers/`/`mappers/`, HTTP calls to `gateway/`, use-case orchestration to `services/`, hook/container wiring up the stack.
4. Re-run `npm run lint` and the relevant module tests after each move.
5. Verify no new circular imports (`npm run quality:circular`) or dead code (`npm run quality:dead-code`).

## How to add a feature correctly

1. Read [skills/create-module.md](skills/create-module.md) or the relevant skill for the task.
2. Plan tests first: unit tests for pure logic, integration tests for the container, e2e/a11y for the flow.
3. Scaffold the module layers, add `index.ts` public exports, add route + `ROUTE_PATHS` entry, add message keys to **both** `en.json` and `ar.json`, add gateway mocks if needed.
4. Implement: types → enums/constants → schemas → gateway → mappers → services → queries → hooks → containers → components.
5. Run the full gates: `npm run quality` (or `npm run validate` if the change touches routes/user flows).
