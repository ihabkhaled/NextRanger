# cursor.md

Entrypoint for Cursor in **strict-next-ranger**. Scoped rule files live in
[.cursor/rules/](.cursor/rules/00-canonical-policy.mdc) — Cursor loads them automatically;
this file is the human-readable digest. Canonical sources:

- [AGENTS.md](AGENTS.md) — full agent entrypoint + skills routing table
- [.ai/context-manifest.json](.ai/context-manifest.json) — task-scoped context only
- [context/architecture-map.md](context/architecture-map.md) — where everything lives
- [rules/00-non-negotiable-rules.md](rules/00-non-negotiable-rules.md) — the law
- [memory/known-pitfalls.md](memory/known-pitfalls.md) — mistakes already made once

## Stack

Next.js 16 App Router (Turbopack, typedRoutes) · React 19 · TypeScript 7 strict ·
Tailwind v4 · TanStack Query v5 · Zustand v5 · Zod v4 · next-intl (14 URL locales, RTL) ·
Vitest 4 + RTL · Playwright · MSW v2 · npm 12.0.1 · Node 24.18.0.

## Commands

- `npm run dev` / `build` / `start`
- `npm run lint` (`--max-warnings=0`) · `npm run lint:fix` · `npm run format`
- `npm run typecheck` (TypeScript 7) · `npm run typecheck:compat` (TypeScript 6 tooling API)
- `npm run test` / `test:coverage` / `test:e2e` / `test:a11y` / `test:visual`
- `npm run test:e2e:install` (one-time Playwright Chromium download)
- `npm run test:e2e:baseline` (refreshes all current-OS baselines; review every image)
- `npm run gate:push` · `npm run validate`

## Architecture digest

- `src/app` — routes/layouts/route handlers only. `src/proxy.ts` — per-request nonce CSP.
- `src/modules/<feature>` — api/ gateway/ services/ queries/ store/ containers/ components/
  hooks/ utils/ helpers/ mappers/ schemas/ types/ enums/ constants/ test/ + public `index.ts`.
  Reference module: `src/modules/articles`.
- `src/shared` — generic building blocks. `src/packages/<vendor>` — one owning wrapper per
  third-party package.
- BFF: clients call same-origin `/api/gateway/*` via `httpClient` + `buildGatewayPath`;
  `SERVER_API_MOCKING=enabled` (default) serves module mock fixtures.

## Hard rules digest

- Never import a third-party package directly — use its `src/packages` wrapper
  (map: `eslint/package-boundaries.config.mjs`).
- Cross-module imports only via `@/modules/<feature>` public surface; no deep imports.
- `*.component.tsx` are TSX-only: no hooks, no logic, no raw `className`, no raw copy.
- Containers: `'use client'` + `// client-boundary-reason: …`, glue hooks to components, own the `.map()`.
- No `process.env` outside `src/packages/env`; no browser globals outside `src/packages/browser|storage`.
- Query keys only from builder files; `useAppQuery`/`useAppMutation`, never raw `@tanstack/react-query`.
- All copy through next-intl keys present in every supported catalog; every route preserves the
  URL locale; never `dangerouslySetInnerHTML`.
- Never add `eslint-disable` without a documented exception in `docs/exceptions/` —
  a firing rule means the code belongs in another layer; move it.
- TDD; coverage 95% global, 100% for utils/helpers/mappers/schemas/query-key builders; no `.only`/skips.
