# Skill: Create a Hook (View Model)

Create a `use-<name>.hook.ts` file in a module's `hooks/` layer. Hooks are the orchestration
layer: they combine queries, stores, i18n, and pure helpers into a fully-computed view model that
a container can render without thinking. Everything user-visible — labels, formatted dates, class
names, callbacks — is finished here.

## Read first

- [rules/03-hooks.md](../rules/03-hooks.md)
- [rules/14-i18n-rtl.md](../rules/14-i18n-rtl.md)
- Reference: `src/modules/articles/hooks/use-articles-list.hook.ts`

## Steps

1. Define the view-model types first in `types/<feature>.types.ts`: a state union plus a readonly
   interface, e.g. `ArticlesListState = 'loading' | 'error' | 'empty' | 'ready'` and
   `ArticlesListViewModel` in `src/modules/articles/types/article.types.ts`. The container will
   switch on `state`; design the union before writing the hook.
2. Create `src/modules/<feature>/hooks/use-<name>.hook.ts` exporting one function
   `use<Name>(): <Name>ViewModel`.
3. Gather inputs at the top: query hooks from the module's `queries/` layer, store selectors from
   `store/`, and i18n via `useAppTranslation(I18N_NAMESPACES.<feature>)` and `useAppLocale` from
   `@/packages/i18n`. Message keys come from `constants/<feature>-message-keys.constants.ts` —
   never string literals.
4. Resolve the state union with a pure helper in `helpers/` or `utils/` (not a module-scope
   function in the hook file). The reference hook uses `resolveArticlesListState` from
   `src/modules/articles/helpers/article-list-state.helper.ts`:

   ```ts
   import { resolveArticlesListState } from '../helpers/article-list-state.helper';
   ```

   The hook file itself must contain only the hook function, imports, and imported helpers.
   No module-scope types, interfaces, enums, constants, or helper functions are allowed
   (`no-inline-declarations`). If a helper grows, extract it to `helpers/` or `utils/` like
   `buildArticleCardViewModel` in `src/modules/articles/helpers/article-display.helper.ts`.

5. Apply memoization discipline:
   - `useMemo` for derived collections — the reference hook memoizes `items` over
     `[query.data, locale, t]`, mapping domain articles through the display helper.
   - `useCallback` for every callback handed to the view model — e.g. `onRetry` wrapping
     `query.refetch` with a `void` call.
   - Dependency arrays MUST be exact; never silence `react-hooks/exhaustive-deps`.
6. Return the finished view model: state, display-ready items (each carrying its own `testId`
   from `TEST_IDS`), and every label already translated (`loadingLabel`, `emptyMessage`,
   `errorMessage`, `retryLabel` in the reference).
7. Unit-test the hook in `src/modules/<feature>/test/` with `renderHook`, MSW-backed providers,
   and assertions on the returned view model per
   [testing/unit-testing-standard.md](../testing/unit-testing-standard.md). Pure helpers extracted
   in step 4 get their own 100%-coverage tests.

## Forbidden

- Returning raw query objects, message keys, or untranslated strings to the container.
- HTTP calls or mapping wire data here — that is service/mapper territory
  ([skills/create-service.md](create-service.md)).
- Declaring React components, JSX, or hooks-inside-conditionals.
- Inline types, interfaces, enums, constants, or helper functions in the hook file.
- Inline arrays/objects that should be constants or helpers.
- Large business logic blocks — move pure logic to `utils/`/`helpers/`.
- Reading `process.env`, `window`, or `document` — use `@/packages/env` and `@/packages/browser`.

## Validation

```bash
npm run lint
npm run typecheck
npm run test
```

## Definition of done

- Hook returns a single readonly view model; the container needs zero logic to render it.
- All copy translated via `useAppTranslation` + message-key constants (en + ar keys exist).
- Callbacks are `useCallback`-stable; derived data is `useMemo`-bounded with exact deps.
- Hook and extracted helpers are tested; coverage thresholds hold.
