# CLAUDE.md

Compact entrypoint for Claude Code. Canonical sources — read before non-trivial work:

- [AGENTS.md](AGENTS.md) — full agent entrypoint + skills routing table
- [context/architecture-map.md](context/architecture-map.md) — where everything lives
- [rules/00-non-negotiable-rules.md](rules/00-non-negotiable-rules.md) — the law
- [memory/known-pitfalls.md](memory/known-pitfalls.md) — mistakes already made once

## Stack

Next.js 16 App Router (Turbopack, typedRoutes) · React 19 · TypeScript 5.9 strict (tsgo) ·
Tailwind v4 (CSS-first tokens) · TanStack Query v5 · Zustand v5 · Zod v4 · next-intl (en/ar, RTL) ·
Vitest 4 + RTL · Playwright · MSW v2 · npm · Node >= 22.

## Commands

- `npm run dev` / `build` / `start`
- `npm run lint` (`--max-warnings=0`) · `npm run lint:fix` · `npm run format`
- `npm run typecheck` (tsgo) · `npm run typecheck:tsc` (fallback)
- `npm run test` / `test:watch` / `test:coverage`
- `npm run test:e2e` / `test:a11y` / `test:visual`
- `npm run quality` (lint + typecheck + coverage + build)
- `npm run validate` (quality + e2e + security scans + dead code + circular deps)

## Architecture digest

- `src/app` — routes/layouts/route handlers only. `src/proxy.ts` — per-request nonce CSP.
- `src/modules/<feature>` — layers: api/ gateway/ services/ queries/ store/ containers/
  components/ hooks/ utils/ helpers/ mappers/ schemas/ types/ enums/ constants/ test/,
  public surface `index.ts`. Reference module: `src/modules/articles`.
- `src/shared` — generic building blocks (components, config, constants, errors, i18n, testing).
- `src/packages/<vendor>` — one owning wrapper per third-party package
  (axios → `httpClient`, query → `useAppQuery`, zod → `z`/`parseSchema`, i18n → `useAppTranslation`).
- BFF: clients call same-origin `/api/gateway/*` via `httpClient` + `buildGatewayPath`;
  `SERVER_API_MOCKING=enabled` (default) serves module mock fixtures — zero backend needed.

## Hard rules digest

- Never import a third-party package directly — use its `src/packages` wrapper
  (map: `eslint/package-boundaries.config.mjs`).
- Cross-module imports only via `@/modules/<feature>` public surface; no deep imports.
- `*.component.tsx` are JSX-only: no hooks, no logic, no raw `className`, no raw copy.
- Containers: `'use client'` + `// client-boundary-reason: …`, glue hooks to components, own the `.map()`.
- No `process.env` outside `src/packages/env`; no browser globals outside `src/packages/browser|storage`.
- Query keys only from builder files; `useAppQuery`/`useAppMutation`, never raw `@tanstack/react-query`.
- All copy through next-intl message keys (en + ar); never `dangerouslySetInnerHTML`.
- Never add `eslint-disable` without a documented exception in `docs/exceptions/` —
  a rule firing means the code is in the wrong layer; move it.
- TDD; coverage 95% global, 100% for utils/helpers/mappers/schemas/query-key builders; no `.only`/skips.
