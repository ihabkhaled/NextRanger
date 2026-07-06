# Skill: Create a Mutation

Add a write operation to a module: a `useAppMutation`-based hook plus an exact-scope invalidation
helper. Mutations call service use-cases and reconcile the cache deliberately — never with a
blanket "invalidate everything".

## Read first

- [rules/05-tanstack-query.md](../rules/05-tanstack-query.md)
- Reference: `src/modules/articles/queries/article.mutations.ts` and `article.invalidate.ts`

## Steps

1. Ensure the write exists as a service use-case (e.g. `createArticle` in
   `src/modules/articles/services/article.service.ts`) per
   [skills/create-service.md](create-service.md).
2. Create or extend the invalidation helper in
   `src/modules/<feature>/queries/<feature>.invalidate.ts`. It takes a `QueryClientLike` (from
   `@/packages/query`) and invalidates the narrowest key scope that the write affects:

   ```ts
   /** Exact-scope invalidation: only article lists refetch, nothing else. */
   export function invalidateArticleLists(queryClient: QueryClientLike): Promise<void> {
     return queryClient.invalidateQueries({ queryKey: articleQueryKeys.lists() });
   }
   ```

   Keys come only from the builder file ([skills/create-query.md](create-query.md)). One helper
   per scope; a mutation that touches lists and one detail calls two helpers.

3. Create the mutation hook in `src/modules/<feature>/queries/<feature>.mutations.ts`:

   ```ts
   export function useCreateArticleMutation(): ReturnType<
     typeof useAppMutation<Article, Error, CreateArticleInput>
   > {
     const queryClient = useAppQueryClient();

     return useAppMutation<Article, Error, CreateArticleInput>({
       mutationFn: createArticle,
       onSuccess: () => invalidateArticleLists(queryClient),
     });
   }
   ```

   `useAppMutation` and `useAppQueryClient` come from `@/packages/query` — never the vendor
   package. Type all three generics: result, error, input.

4. Surface the outcome in the view-model hook that consumes the mutation: success/error toasts go
   through `showToast` from `@/packages/toast` with messages translated from keys (error mapping
   via `mapErrorToMessageKey` from `src/shared/errors/http-error-to-message-key.mapper.ts`).
5. Optimistic updates are opt-in, not default. Use them only when the UI must reflect the write
   instantly, and always with rollback:
   - `onMutate`: `await queryClient.cancelQueries({ queryKey: articleQueryKeys.lists() })`,
     snapshot the previous data with `getQueryData`, write the optimistic value with
     `setQueryData` (keys from the builder), and return `{ previous }` as context.
   - `onError`: restore the snapshot with `setQueryData(key, context.previous)`.
   - `onSettled`: call the invalidation helper so the cache reconverges with the server.
     Skipping any of the three steps is a defect, not a simplification.
6. Test it:
   - Unit test the invalidation helper in `src/modules/<feature>/test/` with a stubbed
     `QueryClientLike`, asserting the exact `queryKey` scope (100% bucket for query-key code).
   - Integration test the flow in `src/tests/integration/`: MSW handler accepts the POST, the
     affected list query refetches, and the error path (handler returns 400/500) leaves the cache
     unchanged and surfaces the translated error. For optimistic updates, assert the rollback by
     checking the rendered list after a failed mutation.

## Forbidden

- `queryClient.invalidateQueries()` with no key, or inline key arrays in mutation callbacks.
- Mutating Zustand stores to mirror server state after a write — the query cache is the single
  source of server truth.
- Optimistic writes without snapshot + rollback + settle-invalidate.

## Validation

```bash
npm run lint
npm run typecheck
npm run test
```

## Definition of done

- Mutation hook wraps `useAppMutation` with full generics and calls a named invalidation helper.
- Invalidation scope is the narrowest key that covers the write; helper is unit-tested.
- Success and failure paths are integration-tested against MSW, including rollback if optimistic.
