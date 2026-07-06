# frontend-architecture/no-inline-component-logic

- **Source:** `eslint/architecture-plugin/rules/no-inline-component-logic.mjs`
- **Registered in:** `eslint/architecture.config.mjs` (severity `error`)
- **Options:** none (`schema: []`)

## What it enforces

`*.component.tsx` files render already-computed props and nothing else. The rule reports:

| Pattern                                                                                   | Message                                                                                                                |
| ----------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Nested function declarations                                                              | `Components must not define functions. Pass handlers down from the container as props.`                                |
| Inline functions in JSX props                                                             | `JSX props must not receive inline functions. Pass a prepared handler prop from the container.`                        |
| `.map()` / `.filter()` / `.reduce()` / `.sort()` / `.flatMap()` / `.forEach()` inside JSX | `Do not call '.map()' inside JSX. Transform data in a hook/helper/mapper and pass the result as a prop.`               |
| Nested ternaries                                                                          | `Nested ternaries are forbidden in components. Compute the branch in a helper and pass a simple prop.`                 |
| `new Date()`, `Intl.*`, regex literals in JSX                                             | `Do not use new Date() inside JSX. Compute this in a helper/mapper and pass it as a prop.`                             |
| Object/array literals in JSX props                                                        | `JSX props must not receive inline object/array literals. Move the value to a constants/ file or compute it upstream.` |

## Why

Each inline handler and object literal is a new reference every render (breaking memoized
children), each inline `.map()` is untested transformation logic living in the view, and each
nested ternary is a branch nobody can unit-test without mounting the component. The failure
mode prevented is the slow rot of "presentational" components into unmeasurable mini-apps.

## Targeted files

Only `*.component.tsx` files. Containers are explicitly allowed to do the `.map()` to child
elements — that is their job.

## Violation

From `eslint/architecture-plugin/__fixtures__/invalid/bad-article-card.component.tsx`:

```tsx
<h2 onClick={() => setOpen(!open)}>Latest articles</h2>
<ul>
  {articles.items.map((item) => (
    <li key={item.id}>{item.title}</li>
  ))}
</ul>
<p>{open ? (props.title ? props.title : 'Untitled') : 'Closed'}</p>
```

That is an inline handler, an inline `.map()` transform, and a nested ternary in one block.

## Compliant fix

The real split in the articles module: the container iterates, the component renders one item,
and the hook (`src/modules/articles/hooks/use-articles-list.hook.ts`) builds fully-translated
view models. From `src/modules/articles/containers/articles-list.container.tsx`:

```tsx
<ArticleList testId={TEST_IDS.articlesList}>
  {viewModel.items.map((item) => (
    <ArticleCard key={item.id} viewModel={item} />
  ))}
</ArticleList>
```

Handlers follow the same rule: the hook exposes `viewModel.onRetry`, the container passes it
as the `onRetry` prop, and the component wires it to the DOM untouched. Date/format logic
belongs in `src/packages/date` (`formatDisplayDate`, `formatRelativeToNow`) called from a
helper such as `src/modules/articles/helpers/article-display.helper.ts`.

## When you hit it

1. Move handlers and derived values into the hook so they arrive as props
   ([skills/create-hook.md](../../skills/create-hook.md)).
2. Move list/branch transforms into helpers or mappers
   ([rules/08-utils-helpers-mappers.md](../../rules/08-utils-helpers-mappers.md)).
3. Move JSX-prop object/array literals into a `constants/` file.
4. General procedure: [skills/fix-eslint-typecheck.md](../../skills/fix-eslint-typecheck.md);
   see also [rules/02-components-and-containers.md](../../rules/02-components-and-containers.md).
