# frontend-architecture/no-inline-query-keys

- **Source:** `eslint/architecture-plugin/rules/no-inline-query-keys.mjs`
- **Registered in:** `eslint/architecture.config.mjs` (severity `error`)
- **Options:** none (`schema: []`)

## What it enforces

TanStack Query keys are cache addresses. Any object property named `queryKey` or `mutationKey`
whose value is an inline array literal is reported. Keys MUST come from a `*query-keys.ts`
builder file — for articles, `articleQueryKeys` in
`src/modules/articles/queries/article-query-keys.ts`. Builder files themselves and test files
are exempt.

## Why

Inline key arrays fragment the cache: `['articles', 'list']` here, `['article-list']` there,
and suddenly `invalidateQueries` misses half the entries after a mutation — stale lists that
no test catches. With a single builder per module, key shape changes happen in one file and
invalidation stays exact (see `invalidateArticleLists` in
`src/modules/articles/queries/article.invalidate.ts`).

## Targeted files

All of `src/**/*.{ts,tsx}` except `*query-keys.ts` files and tests.

## Violation

From `eslint/architecture-plugin/__fixtures__/invalid/bad-client-page.tsx`:

```ts
return { queryKey: ['articles', 'list'] };
```

Reported as:

`Inline queryKey arrays are forbidden. Use a builder from the module's *query-keys.ts file so invalidation stays exact.`

## Compliant fix

The builder file is the only source of article cache addresses
(`src/modules/articles/queries/article-query-keys.ts`):

```ts
export const articleQueryKeys = {
  root: ['articles'] as const,
  lists: () => [...articleQueryKeys.root, 'list'] as const,
  list: (params: ArticleListParams) => [...articleQueryKeys.lists(), params] as const,
  details: () => [...articleQueryKeys.root, 'detail'] as const,
  detail: (id: string) => [...articleQueryKeys.details(), id] as const,
};
```

Consumed in the query file (`src/modules/articles/queries/article.queries.ts`):

```ts
return {
  queryKey: articleQueryKeys.list(params),
  queryFn: () => listArticles(params),
};
```

## When you hit it

1. If the module already has a `*query-keys.ts`, use (or extend) its builder — never restate
   the array.
2. New module or entity? Create the builder file first, then the query/mutation:
   [skills/create-query.md](../../skills/create-query.md),
   [skills/create-mutation.md](../../skills/create-mutation.md).
3. Key discipline and invalidation strategy: [rules/05-tanstack-query.md](../../rules/05-tanstack-query.md).
4. General procedure: [skills/fix-eslint-typecheck.md](../../skills/fix-eslint-typecheck.md).
