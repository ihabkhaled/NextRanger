# 02 — Components and Containers

The view layer is split in two: **components** (`*.component.tsx`) render, **containers**
(`*.container.tsx`) wire. Nothing else renders module UI.

## Components: TSX-only doctrine

A component file receives fully-computed props and returns markup. That is the whole job.

**Allowed in a `*.component.tsx`:**

- imports and type imports;
- the exported component function;
- TSX using props, design-system primitives from `@/packages/ui-primitives`, and shared components
  from `src/shared/components/`;
- conditional rendering on pre-computed booleans/strings (`viewModel.publishedLabel ? … : null`);
- class bundles imported from a `*.variants.ts` / `*-style.constants.ts` file;
- `data-testid` values passed in via props or `TEST_IDS`.

**Forbidden in a `*.component.tsx`:**

- local `const`, `let`, `var`, `type`, `interface`, `enum`, function declarations, or arrow helper
  declarations;
- local declarations inside the component body;
- hooks of any kind (`no-hooks-in-components`);
- logic: computation, formatting, sorting, branching beyond render ternaries
  (`no-inline-component-logic`);
- inline object/array/function declarations (`no-inline-declarations`);
- raw user-facing copy — labels arrive pre-translated (`no-raw-i18n-text`);
- raw `className` strings (`no-inline-classname-outside-design-system`); class bundles come from
  variants files or primitives;
- imports from hooks/queries/services/gateway/store layers — enforced by the layer policy in
  [eslint/architecture.config.mjs](../eslint/architecture.config.mjs).

Reference: [src/modules/articles/components/article-card.component.tsx](../src/modules/articles/components/article-card.component.tsx) —
every label pre-translated, every class from
[src/modules/articles/constants/article-style.constants.ts](../src/modules/articles/constants/article-style.constants.ts).

## Containers: the wiring layer

A container is a `'use client'` file with a `// client-boundary-reason: …` comment. It calls exactly
one orchestration hook, switches on the view-model state, and renders components. **The container —
not the component — does the `.map()` to child elements**, so list components stay pure layout:

```tsx
case 'ready': {
  return (
    <ArticleList testId={TEST_IDS.articlesList}>
      {viewModel.items.map((item) => (
        <ArticleCard key={item.id} viewModel={item} />
      ))}
    </ArticleList>
  );
}
```

(From [src/modules/articles/containers/articles-list.container.tsx](../src/modules/articles/containers/articles-list.container.tsx).)

Containers MUST:

- Handle every view-model state — loading, error, empty, ready — using the shared feedback
  components (`LoadingState`, `ErrorState`, `EmptyState` in `src/shared/components/feedback/`).
- Close the switch with `assertNever` ([src/shared/utils/assert-never.util.ts](../src/shared/utils/assert-never.util.ts))
  so a new state is a compile error, not a blank screen.
- Never import services or gateways directly (layer policy: containers consume hooks/queries only).
- Never compute or translate anything — that already happened in the hook.

## The view-model contract

Hooks return a discriminated-union view model (`state: 'loading' | 'error' | 'empty' | 'ready'`)
whose fields are render-ready: translated strings, formatted dates, resolved class names, stable
callbacks, test ids. See `ArticlesListViewModel` in
[src/modules/articles/types/article.types.ts](../src/modules/articles/types/article.types.ts).
If a component needs to "figure something out", the view model is incomplete — fix the hook or
helper, never the component.

How-to recipes: [skills/create-component.md](../skills/create-component.md),
[skills/create-container.md](../skills/create-container.md). Related rules:
[03-hooks.md](03-hooks.md), [14-i18n-rtl.md](14-i18n-rtl.md).
