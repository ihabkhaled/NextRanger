# 03 — Hooks

Module hooks (`src/modules/<feature>/hooks/*.hook.ts`) are the orchestration layer: they combine
queries, stores, i18n, and helpers into one render-ready view model per screen concern. They are
the only place where data, translation, and presentation decisions meet.

## Rules

- A hook MUST orchestrate, not implement. Sorting, formatting, and view-model construction are
  delegated to `utils/`, `helpers/`, and `mappers/`; the hook composes them. Reference:
  [src/modules/articles/hooks/use-articles-list.hook.ts](../src/modules/articles/hooks/use-articles-list.hook.ts)
  composes `useArticlesListQuery`, `sortArticlesByNewest`, and `buildArticleCardViewModel`.
- Hooks MUST return a complete view model — a discriminated union on `state` with every label
  already translated and every callback already stable (`useCallback`), so components and
  containers never think. See [02-components-and-containers.md](02-components-and-containers.md).
- **Translation happens here.** Hooks call `useAppTranslation(I18N_NAMESPACES.<ns>)` from
  `@/packages/i18n` and pass finished strings down. Message keys come from module constants
  (e.g. `ARTICLE_MESSAGE_KEYS` in
  [src/modules/articles/constants/article-message-keys.constants.ts](../src/modules/articles/constants/article-message-keys.constants.ts)) —
  never inline key strings. When a helper needs to translate per-item, inject translator callbacks:

  ```ts
  translations: {
    translateStatus: (status) => t(ARTICLE_STATUS_MESSAGE_KEYS[status]),
    translateReadingTime: (minutes) => t(ARTICLE_MESSAGE_KEYS.readingTime, { minutes }),
  },
  ```

- Hooks MUST NOT import components, containers, or anything from `src/app` — enforced by the
  `module-hooks` policy in [eslint/architecture.config.mjs](../eslint/architecture.config.mjs).
  A hook that knows about JSX is a container in disguise.
- Hooks MUST NOT call gateways or `httpClient` directly; server data arrives through the module's
  query hooks ([05-tanstack-query.md](05-tanstack-query.md)), client state through store selectors
  ([06-zustand.md](06-zustand.md)).
- **No module-level declarations** in hook files: constants, types, interfaces, enums, default
  params, and pure functions belong in `constants/`, `types/`, `utils/`, or `helpers/` files where
  they are independently tested and reusable. Enforced by `no-inline-declarations`
  ([docs/eslint/no-inline-declarations.md](../docs/eslint/no-inline-declarations.md)).
- Derivations over `query.data` MUST be memoized (`useMemo`) with honest dependency arrays; the
  `react-hooks` config in [eslint/react-hooks.config.mjs](../eslint/react-hooks.config.mjs) treats
  exhaustive-deps violations as errors.
- Side effects that sync state to the DOM or storage live in dedicated effects hooks, not in
  view-model hooks. Reference:
  [src/modules/ui-preferences/hooks/use-ui-preferences-effects.hook.ts](../src/modules/ui-preferences/hooks/use-ui-preferences-effects.hook.ts),
  which syncs theme/direction through the `@/packages/browser` and `@/packages/storage` facades.

## Shape of a view-model hook

1. Read inputs: query hooks, store selectors, `useAppTranslation`, `useAppLocale`.
2. Derive: memoized mapping of domain data to card/row view models via helpers.
3. Resolve `state` from pending/error/empty/ready in a small named function.
4. Return the union: `{ state, items, loadingLabel, emptyMessage, errorMessage, retryLabel, onRetry }`.

Testing: hooks are unit-tested in `src/modules/<feature>/test/` with MSW-backed queries per
[testing/unit-testing-standard.md](../testing/unit-testing-standard.md). How-to:
[skills/create-hook.md](../skills/create-hook.md).
