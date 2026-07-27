# Rule 12 — Performance

Performance is an architectural property here, not an optimization pass. The rules below keep the
client bundle small and rendering work bounded by default.

## Server components first

- Every route and component is a React Server Component unless it demonstrably needs browser
  interactivity. `src/app` pages (e.g. [src/app/[locale]/(dashboard)/articles/page.tsx](<../src/app/[locale]/(dashboard)/articles/page.tsx>))
  MUST stay server components that compose containers.
- `'use client'` is a justified exception, never a default. Every client file MUST carry a
  `// client-boundary-reason: …` comment, enforced by
  [require-client-component-reason](../docs/eslint/require-client-component-reason.md). If you
  cannot state the reason in one sentence, the boundary is wrong.
- Push client boundaries down: a container (`*.container.tsx`) is the client boundary; the page and
  layout above it stay on the server.

## Route-level loading boundaries

Every route group MUST have a loading boundary so navigation streams immediately —
[src/app/[locale]/loading.tsx](../src/app/[locale]/loading.tsx) is the locale-shell example,
built from `Spinner`/`Skeleton`
primitives in [src/packages/ui-primitives](../src/packages/ui-primitives). Never block a whole page
on one slow query when a skeleton can render first.

## Images and fonts

- All images go through `AppImage` ([src/packages/image](../src/packages/image)) — it wraps
  `next/image` (sizing, lazy loading, format negotiation) and makes `alt` mandatory. Raw `<img>` is
  banned by [no-raw-package-imports](../docs/eslint/no-raw-package-imports.md) ownership.
- Remote image hosts MUST be allow-listed in `images.remotePatterns` in [next.config.ts](../next.config.ts).
- Fonts load only via `next/font` through [src/shared/fonts/app-fonts.ts](../src/shared/fonts/app-fonts.ts)
  (`interFont`). Never add a `<link>` to a font CDN — it breaks the CSP and adds render-blocking
  requests.

## Long lists: virtualize at 100+ rows

Any list that can plausibly exceed ~100 rows MUST render through `VirtualizedList`
([src/packages/virtuoso/virtualized-list.tsx](../src/packages/virtuoso/virtualized-list.tsx)), the
owned wrapper around react-virtuoso. See [skills/add-virtualized-list.md](../skills/add-virtualized-list.md).
Never `.map()` an unbounded collection straight into the DOM.

## Pagination is backend-driven

Lists fetch pages from the gateway; the client MUST never download a full dataset and paginate,
filter, or sort it in memory. Query keys include the pagination params (see `articleQueryKeys` in
[src/modules/articles/queries/article-query-keys.ts](../src/modules/articles/queries/article-query-keys.ts))
so TanStack Query caches each page separately.

## Memoization only when measured

- Do not sprinkle `useMemo`/`useCallback`/`React.memo` preemptively. Add memoization only after a
  React Profiler measurement shows a real re-render cost, and record the finding in
  [memory/performance-decisions.md](../memory/performance-decisions.md).
- When memoization is justified it lives in hooks, never in components: `*.component.tsx` files are
  TSX-only and may not call hooks ([no-hooks-in-components](../docs/eslint/no-hooks-in-components.md)).
  Hooks such as `useArticlesList` are where derived view models are built and, when measured,
  memoized.
- Component-level "logic memoization" is structurally impossible by design — inline expressions in
  components are banned by [no-inline-component-logic](../docs/eslint/no-inline-component-logic.md).

## Web vitals stance

- The budget targets are the Core Web Vitals "good" thresholds: LCP ≤ 2.5 s, INP ≤ 200 ms,
  CLS ≤ 0.1 on mid-tier hardware.
- There is no web-vitals reporting wired today; when field data is needed it MUST enter through an
  owned facade (see the analytics owner plan in
  [rules/16-observability-analytics.md](../rules/16-observability-analytics.md)), never a raw
  third-party snippet — the CSP in [src/proxy.ts](../src/proxy.ts) forbids foreign scripts anyway.
- Regressions found during review follow [skills/performance-review.md](../skills/performance-review.md)
  and the [agents/react-performance-reviewer.md](../agents/react-performance-reviewer.md) charter.
