# GEMINI.md

Entrypoint for Gemini agents working in **strict-next-ranger**, a strict Next.js 16 frontend operating system. Canonical sources: [AGENTS.md](AGENTS.md), [context/architecture-map.md](context/architecture-map.md), [rules/00-non-negotiable-rules.md](rules/00-non-negotiable-rules.md).

## Repo purpose

A production-grade starter that teams clone for enterprise frontend work. A real, runnable Next.js 16 App Router application is paired with a governance layer — rules, skills, agents, context, memory — and a custom ESLint architecture plugin that turns the architecture into machine-enforced constraints.

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
- `src/modules/<feature>` — strict layers: `api/`, `gateway/`, `services/`, `queries/`, `store/`, `containers/`, `components/`, `hooks/`, `utils/`, `helpers/`, `mappers/`, `schemas/`, `types/`, `enums/`, `constants/`, `test/`. Public surface is `index.ts`; cross-module imports go ONLY through `@/modules/<feature>`.
- `src/shared` — generic building blocks (components, config, constants, errors, i18n, security, testing, types, utils). Must never import modules or app internals.
- `src/packages/<vendor>` — one owning wrapper per third-party package. Raw vendor imports are banned.
- `src/proxy.ts` — per-request nonce CSP.
- BFF: clients call same-origin `/api/gateway/*` via `httpClient` + `buildGatewayPath`; mock mode serves fixtures.

## TSX-only component rule

`*.component.tsx` files are TSX-only presentation files. They contain only imports/type imports, the exported component function, and the TSX it returns. No local declarations, no hooks, no logic, no raw copy, no raw `className`, no inline arrays/objects, no transformation logic. All values arrive as props or from approved constants/types/helpers/utils imports.

## No inline declarations rule

Hooks, services, gateways, utils, helpers, mappers, and containers must not declare inline types, interfaces, enums, constants, or local helper functions. Move each shape/value to its owning layer: types to `types/`, enums to `enums/`, constants to `constants/`, pure logic to `utils/`/`helpers/`, mapping to `mappers/`, schemas to `schemas/`, HTTP to `gateway/`, use-cases to `services/`, view models to `hooks/`.

## Package boundary rules

Third-party packages are imported only through their owning wrapper in `src/packages/<vendor>` (map: `eslint/package-boundaries.config.mjs`). Never raw `axios`, `zod`, `dayjs`, `@tanstack/react-query`, `zustand`, `next-intl`, `sonner`, `lucide-react`, `clsx`, `next/link`, `next/image`, `next/navigation`, etc.

## Layer boundary rules

Cross-module imports only via the public surface `@/modules/<feature>` (its `index.ts`). No deep imports. Inside a module: containers → hooks → queries/store → services → gateway → mappers/schemas/types/constants. Services, gateways, and mappers are React-free.

## Secure coding rules

- No raw `process.env` — use `@/packages/env` wrappers.
- No browser globals outside `@/packages/browser` / `@/packages/storage`.
- No `dangerouslySetInnerHTML`.
- No tokens/secrets in client code, storage, or logs. Cookie-session, token-free.
- External links via `ExternalLink` + `isSafeExternalUrl`.
- Errors surface as message keys via `mapErrorToMessageKey`; never raw server/vendor errors.
- CSP nonce from `src/proxy.ts`; static headers in `next.config.ts`.

## Performance rules

- Server Components by default; `'use client'` only with a `// client-boundary-reason: …`.
- Small client boundaries; pages and layouts stay server components.
- No expensive transformations in render; derived data built in hooks and memoized.
- No duplicate derived state.
- Stable query keys from builders.
- Backend-driven pagination; virtualize long lists with `VirtualizedList`.
- Memoization only when measured; no clever micro-optimizations.

## Readability rules

- Small, focused functions/components/hooks/services/utils.
- Shallow nesting; clear names; single responsibility.
- No clever one-liners when a named helper is clearer.
- Split mixed responsibilities.
- No over-engineering.

## Testing expectations

- TDD: failing test first, then code.
- Coverage: 95% global; 100% utils/helpers/mappers/schemas/query-key builders.
- No `.only` or skipped tests without a documented exception.
- Unit tests in `src/modules/<feature>/test/`; integration in `src/tests/integration`; Playwright in `src/tests/e2e`/`accessibility`/`visual`.

## Quality gates

Before handoff:

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

Use `npm run quality` and `npm run validate` for full gates. Never push red.

## What the agent must never do

- Add `eslint-disable` without a documented exception in `docs/exceptions/`.
- Import raw vendors or deep-import across modules.
- Put logic, hooks, services, gateways, or queries in a `*.component.tsx` file.
- Import React into services, gateways, utils, helpers, or mappers.
- Declare inline types, interfaces, enums, constants, or helper functions in implementation layers.
- Use raw `process.env`, browser globals, inline query keys, raw i18n text, or raw `className` outside approved layers.
- Change behavior without a test first.
- Skip or silence a failing gate.

## How to safely refactor

1. Audit with `npm run lint` and identify rule violations.
2. Write a characterization test before moving code.
3. Move one layer at a time: pure logic down, orchestration up.
4. Re-run lint and module tests after each move.
5. Check `npm run quality:circular` and `npm run quality:dead-code`.

## How to add a feature correctly

1. Read the relevant skill (e.g., [skills/create-module.md](skills/create-module.md)).
2. Plan tests first: unit, integration, e2e/a11y as appropriate.
3. Scaffold module layers, `index.ts`, locale-prefixed route + `ROUTE_PATHS`, message keys in every supported catalog, and gateway mocks if needed.
4. Implement bottom-up: types/enums/constants → schemas → gateway → mappers → services → queries → hooks → containers → components.
5. Run the full gates: `npm run quality` or `npm run validate` for route/user-flow changes.
