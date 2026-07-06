# 05 — TanStack Query

All server state lives in the TanStack Query cache, accessed exclusively through the wrapper
`src/packages/query` (`useAppQuery`, `useAppMutation`, `useAppSuspenseQuery`, `useAppQueryClient`,
`AppQueryProvider`). Importing `@tanstack/react-query` directly is a `no-raw-package-imports`
violation.

## Query keys come from builders — always

Every module has exactly one key-builder file. Inline key arrays anywhere else are an ESLint error
(`no-inline-query-keys`, [docs/eslint/no-inline-query-keys.md](../docs/eslint/no-inline-query-keys.md)):

```ts
export const articleQueryKeys = {
  root: ['articles'] as const,
  lists: () => [...articleQueryKeys.root, 'list'] as const,
  list: (params: ArticleListParams) => [...articleQueryKeys.lists(), params] as const,
  details: () => [...articleQueryKeys.root, 'detail'] as const,
  detail: (id: string) => [...articleQueryKeys.details(), id] as const,
};
```

([src/modules/articles/queries/article-query-keys.ts](../src/modules/articles/queries/article-query-keys.ts))

Keys MUST be hierarchical (`root → lists → list(params)`) so invalidation can target any scope.
Key-builder files carry a 100% coverage requirement ([testing/coverage-policy.md](../testing/coverage-policy.md)).

## Query options are exported for reuse

Each query file exports a `build<X>QueryOptions` function alongside the hook, so tests,
prefetching, and the hook itself share one definition:

```ts
export function buildArticlesListQueryOptions(params: ArticleListParams) {
  return {
    queryKey: articleQueryKeys.list(params),
    queryFn: () => listArticles(params),
  };
}
```

([src/modules/articles/queries/article.queries.ts](../src/modules/articles/queries/article.queries.ts))

`queryFn` MUST call a service function ([04-services-api-gateway.md](04-services-api-gateway.md)) —
never a gateway or `httpClient` directly.

## Invalidation is exact and centralized

Every mutation that changes server data MUST invalidate through a named helper in the module's
`queries/*.invalidate.ts` file — never an ad-hoc `invalidateQueries` call with a hand-written key:

```ts
export function invalidateArticleLists(queryClient: QueryClientLike): Promise<void> {
  return queryClient.invalidateQueries({ queryKey: articleQueryKeys.lists() });
}
```

([src/modules/articles/queries/article.invalidate.ts](../src/modules/articles/queries/article.invalidate.ts))

Invalidate the narrowest scope that is actually stale (lists after create, one detail after edit).
Blanket `root` invalidation requires a comment explaining why.

## Mutation pattern

[src/modules/articles/queries/article.mutations.ts](../src/modules/articles/queries/article.mutations.ts)
is the template: `useAppMutation` + service function as `mutationFn` + invalidate helper in
`onSuccess`. Success/error toasts and navigation belong to the consuming hook or container layer —
mutation files stay UI-free. Optimistic updates are allowed only with a rollback in `onError` and a
test covering the rollback path.

## Hard boundaries

- Server data MUST NOT be copied into Zustand stores or React state "for convenience" — the cache
  is the single source of truth ([06-zustand.md](06-zustand.md)).
- Query files MUST NOT import components, containers, or `src/app` (layer policy in
  [eslint/architecture.config.mjs](../eslint/architecture.config.mjs)).
- The plugin config in [eslint/tanstack-query.config.mjs](../eslint/tanstack-query.config.mjs)
  (`@tanstack/eslint-plugin-query`) runs as errors — exhaustive query deps included.

How-to: [skills/create-query.md](../skills/create-query.md),
[skills/create-mutation.md](../skills/create-mutation.md).
