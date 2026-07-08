# Skill: Performance Review

Run this review on any diff that adds a dependency, a `'use client'` boundary, a list, an image,
or a query. The binding policy is [rules/12-performance.md](../rules/12-performance.md); delegate
diff reviews to [agents/react-performance-reviewer.md](../agents/react-performance-reviewer.md).

## Steps

1. **Client boundary audit.** Every `'use client'` file MUST carry a
   `// client-boundary-reason: …` comment (enforced by
   [docs/eslint/require-client-component-reason.md](../docs/eslint/require-client-component-reason.md)).
   For each new boundary ask: does this file actually need browser interactivity, or did the
   author mark a whole subtree client to silence an error? Boundaries belong on containers
   (`*.container.tsx`), not on pages or layouts in `src/app`. Server-only code (`getServerEnv`
   from `@/packages/env/server`, `getServerTranslations`) MUST never sit behind a client boundary
   ([docs/eslint/no-server-only-import-in-client.md](../docs/eslint/no-server-only-import-in-client.md)).
2. **Bundle impact of new dependencies.** For each new entry in `package.json` dependencies:
   confirm it has an owning wrapper in `src/packages/` (so it can be swapped or tree-shaken from
   one place), check its install and parse cost, and prefer an existing owner — dates go through
   `src/packages/date` (dayjs), icons through `src/packages/icons` (named `*Icon` exports only,
   which keeps lucide-react tree-shakeable). Run `npm run build` and compare the route-level
   first-load JS figures Next prints; call out any route that grew and why.
3. **List virtualization.** Any list that can grow beyond a screenful MUST render through
   `VirtualizedList` from `src/packages/virtuoso` (react-virtuoso) — see
   [skills/add-virtualized-list.md](add-virtualized-list.md). Reject raw `.map()` over unbounded
   API collections in containers; the flagship pattern is the articles module
   (`src/modules/articles/containers/`).
4. **Image usage.** All images go through `AppImage` (`src/packages/image`), which makes `alt`
   mandatory and inherits next/image sizing/lazy-loading. Flag raw `<img>` tags, missing
   width/height (layout shift), and any image that should be a static asset instead.
5. **Query caching correctness.** Server state lives in TanStack Query, never in Zustand
   ([rules/05-tanstack-query.md](../rules/05-tanstack-query.md),
   [rules/06-zustand.md](../rules/06-zustand.md)). Verify:
   - keys come only from the module's builder file (e.g. `articleQueryKeys` in
     `src/modules/articles/queries/article-query-keys.ts`) — inline arrays are an ESLint error
     ([docs/eslint/no-inline-query-keys.md](../docs/eslint/no-inline-query-keys.md));
   - mutations invalidate the right scope, no broader (`useCreateArticleMutation` invalidating
     via `invalidateArticleLists` is the reference — it does not nuke the whole cache);
   - no duplicate fetching: a hook composes `useAppQuery` once and derives view models
     (`useArticlesList` in `src/modules/articles/hooks/` is the pattern);
   - suspense variants (`useAppSuspenseQuery`) are used deliberately, not to hide loading states
     the container should render.
6. **Render hygiene.** Components (`*.component.tsx`) are TSX-only by rule, so re-render cost
   concentrates in containers and hooks. Check new hooks for unstable object/array literals fed
   into context or query options, and check Zustand consumers use `useAppStoreShallow` for
   multi-field selection instead of subscribing to the whole store.
7. **Verify with the app running.** `npm run dev`, open the affected route, and confirm no
   request waterfalls in the network panel and no long tasks on interaction. For lists, scroll
   and confirm DOM node count stays bounded.

## Done when

Each new client boundary has a defensible reason, `npm run build` shows no unexplained bundle
growth, unbounded lists are virtualized, and every cache key and invalidation traces back to a
query-keys builder file.
