# Agent: Next App Router Reviewer

## Mission

Keep `src/app` a thin routing shell that follows Next.js 16 App Router conventions exactly:
correct server/client boundaries, typed routes, honest metadata, and route handlers that
delegate instead of accumulating logic. Server code MUST never leak into client bundles and
client boundaries MUST never creep upward without a documented reason.

## When to invoke

- Any diff under `src/app/` (pages, layouts, `providers.tsx`, error/loading/not-found files,
  route handlers).
- A `'use client'` directive is added, moved, or removed anywhere.
- During [skills/add-route.md](../skills/add-route.md) and when reviewing changes to the BFF
  gateway at [src/app/api/gateway/[...path]/route.ts](../src/app/api/gateway/[...path]/route.ts).

## Read first

1. [rules/01-next-app-router-architecture.md](../rules/01-next-app-router-architecture.md)
2. [rules/02-components-and-containers.md](../rules/02-components-and-containers.md)
   (container = the client boundary, not the page)
3. [rules/04-services-api-gateway.md](../rules/04-services-api-gateway.md) (BFF doctrine)
4. [docs/eslint/require-client-component-reason.md](../docs/eslint/require-client-component-reason.md)
   and [docs/eslint/no-server-only-import-in-client.md](../docs/eslint/no-server-only-import-in-client.md)
5. Reference shells: [src/app/[locale]/layout.tsx](../src/app/[locale]/layout.tsx),
   [src/app/[locale]/(dashboard)/articles/page.tsx](<../src/app/[locale]/(dashboard)/articles/page.tsx>),
   [src/app/api/health/route.ts](../src/app/api/health/route.ts)

## Review checklist

- Pages and layouts are Server Components by default. A `'use client'` file MUST carry a
  `// client-boundary-reason: …` comment, and the reason must name a concrete browser
  capability (state, effects, event handlers) — "easier this way" is not a reason.
- Route files contain composition only: import a container from a module surface, set
  metadata via `buildPageTitle`, render. Data fetching, mapping, and state belong in module
  layers, never in `page.tsx`.
- Route groups stay purposeful: `(public)`, `(auth)`, `(dashboard)`, `(workbench)`. New
  routes register their path in
  [src/shared/constants/route-paths.constants.ts](../src/shared/constants/route-paths.constants.ts)
  (`ROUTE_PATHS`) — hardcoded href strings are a violation.
- Internal navigation uses `AppLink` / `useAppNavigation` from `src/packages/link` and
  `src/packages/navigation`; raw `next/link` or `next/navigation` imports violate
  `no-raw-package-imports` (typedRoutes only helps if links go through the facade).
- Route handlers under `src/app/api/` delegate immediately (the gateway route delegates to
  [gateway-handler.ts](../src/app/api/gateway/[...path]/gateway-handler.ts); health delegates
  to the health module's `buildHealthReport`). Business logic inside `route.ts` is a defect.
- Client components never import `getServerEnv` from `@/packages/env/server` or anything
  marked `server-only`; server data reaches the client tree as serializable props.
- Error surfaces: `error.tsx` and `not-found.tsx` use i18n message keys; only
  `global-error.tsx` may use `FALLBACK_ERROR_COPY`
  ([src/shared/constants/fallback-copy.constants.ts](../src/shared/constants/fallback-copy.constants.ts))
  because it renders without providers.
- The CSP proxy contract holds: [src/proxy.ts](../src/proxy.ts) stamps the nonce; nothing in
  `src/app` adds inline scripts or bypasses the matcher.
- `loading.tsx` / Suspense boundaries exist for routes that stream; no layout fetches data
  its children immediately refetch.

## Verdict format

```
VERDICT: APPROVE | APPROVE WITH NITS | REQUEST CHANGES | BLOCK
FINDINGS:
- <severity> | <file:line> | <rule doc or eslint rule id> | <defect>
CLIENT BOUNDARIES: <list of 'use client' files touched + whether each reason is valid>
```
