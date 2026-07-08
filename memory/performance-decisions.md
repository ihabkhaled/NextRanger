# Performance Decisions

Rationale for the performance posture. Normative rules:
[rules/12-performance.md](../rules/12-performance.md).

## Server-first rendering

- **Decision:** components are server components by default. `'use client'` is opt-in, requires a
  `// client-boundary-reason: …` comment (rule `require-client-component-reason`), and boundaries
  are pushed to the leaves — containers and interactive primitives, never whole routes.
- **Rejected alternative:** marking route trees `'use client'` for convenience.
- **Why:** every client boundary ships its subtree's JS to the browser and moves rendering work
  onto the user's device. Making the boundary cost visible (a mandatory written reason) is what
  keeps the client bundle from growing by default. Reference reasons:
  `src/packages/query/app-query-provider.tsx` (query cache lives in browser memory),
  `src/packages/virtuoso/virtualized-list.tsx` (viewport measurement).

## No premature memoization

- **Decision:** `useMemo`, `useCallback`, and `React.memo` are not used speculatively. They are
  added only after a measured re-render problem (React DevTools profiler) and the measurement is
  noted at the call site.
- **Rejected alternative:** blanket memoization "for safety".
- **Why:** the architecture already removes the classic causes of render storms — components are
  TSX-only (`*.component.tsx`, no hooks, no inline declarations, enforced by
  `no-inline-declarations` and `no-inline-component-logic`), containers own the single `.map()`,
  and derived data is built once in hooks like `useArticlesList`
  (`src/modules/articles/hooks/`). On React 19, speculative memo mostly adds comparison cost and
  hides dependency bugs. The React Compiler is the expected long-term answer; hand-memo added now
  would be debt then.

## Virtualization threshold: 100 rows

- **Decision:** any list that can reach 100+ rows MUST render through `VirtualizedList`
  (`src/packages/virtuoso/virtualized-list.tsx`) instead of a bare `.map()`. Below that,
  containers map normally (see `src/modules/articles/containers/articles-list.container.tsx`).
- **Why:** measured DOM cost becomes user-visible (scroll jank, slow hydration) in the low
  hundreds of rows; 100 is the round floor that leaves margin. Virtualizing small lists is a net
  loss — it adds a scroll container, absolute positioning, and measurement work for nothing, and
  complicates accessibility. The skill for adopting it:
  [skills/add-virtualized-list.md](../skills/add-virtualized-list.md).

## Query cache defaults: staleTime 30s

- **Decision:** the app-wide QueryClient (`src/packages/query/app-query-provider.tsx`) sets
  `staleTime: 30_000`, `gcTime: 5 * 60_000`, `retry: 1`, `refetchOnWindowFocus: false`.
- **Rejected alternative:** TanStack's default `staleTime: 0`.
- **Why:** `staleTime: 0` refetches on every mount and navigation, which for a BFF-backed app
  means redundant same-origin round trips users can feel. 30 seconds keeps route transitions
  instant from cache while bounding staleness below anything our data cares about; mutations
  bypass it anyway via explicit invalidation (`invalidateArticleLists` in the articles module is
  the reference). Queries with stricter freshness needs override per-query — never by lowering
  the global default. `refetchOnWindowFocus: false` because focus-triggered refetches produce
  unexplained spinners and duplicate load, not freshness users asked for.

## Devtools only in local

- **Decision:** `ReactQueryDevtools` mounts only when `publicEnv.appEnv === 'local'`
  (`src/packages/query/app-query-provider.tsx`); the env value comes from Zod-validated
  `NEXT_PUBLIC_APP_ENV` via `src/packages/env`.
- **Why:** devtools add bundle weight and expose the full query cache — including server-shaped
  data — to anyone opening the panel. Gating on the validated env (not `NODE_ENV`) means preview
  and production builds are provably clean while local keeps full introspection.

## Standing habits

- Images render through `AppImage` (`src/packages/image`) so sizing/optimization defaults apply
  everywhere; fonts load once via `interFont` in `src/shared/fonts/app-fonts.ts`.
- Performance review of a feature follows
  [skills/performance-review.md](../skills/performance-review.md) and the
  [docs/features/_template/09-performance-review.md](../docs/features/_template/09-performance-review.md)
  gate before release.
