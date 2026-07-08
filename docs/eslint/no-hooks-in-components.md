# frontend-architecture/no-hooks-in-components

- **Source:** `eslint/architecture-plugin/rules/no-hooks-in-components.mjs`
- **Registered in:** `eslint/architecture.config.mjs` (severity `error`)
- **Options:** none (`schema: []`)

## What it enforces

`*.component.tsx` files are TSX-only. They MUST NOT:

- call any React built-in hook (the full `REACT_BUILTIN_HOOKS` set in
  `eslint/architecture-plugin/shared/ast-utils.mjs`, including `use`) or any custom hook
  (any identifier matching `use[A-Z0-9]…`), including member calls like `React.useState`;
- import from a `hooks/` or `queries/` or `store/` directory, or any `*.hook` module;
- import hook names from `react` (importing `type ReactElement` is fine — only hook
  specifiers are flagged).

## Why

A component that owns state or fetches data cannot be rendered from precomputed props, cannot
be tested without providers, and duplicates behavior the container/hook layer already owns.
Keeping components hook-free is what makes them trivially testable and reusable — the failure
mode prevented is behavior leaking into the view layer until "presentational" components need
the whole app to render.

## Targeted files

Only files matching `*.component.tsx` (see `isComponentFile` in
`eslint/architecture-plugin/shared/source-utils.mjs`). Containers (`*.container.tsx`), hook
files, and everything else are untouched by this rule.

## Violation

From the fixture `eslint/architecture-plugin/__fixtures__/invalid/bad-article-card.component.tsx`:

```tsx
import { useState } from 'react';
import { useArticlesList } from '../hooks/use-articles-list.hook';

export function BadArticleCard(props: InlineProps) {
  const [open, setOpen] = useState(false);
  const articles = useArticlesList();
  // ...
}
```

Reported messages:

- `Component files must not call hooks ('useState'). Move behavior into a container or a hooks/ file.`
- `Component files must not import '../hooks/use-articles-list.hook'. Components receive already-computed props from containers.`

## Compliant fix

Move the hook call into the container and pass computed props down. The real pattern from
`src/modules/articles/containers/articles-list.container.tsx` +
`src/modules/articles/components/article-card.component.tsx`:

```tsx
// articles-list.container.tsx — the container calls the hook
const viewModel = useArticlesList();
// ...
<ArticleCard key={item.id} viewModel={item} />;

// article-card.component.tsx — the component only renders
export function ArticleCard(props: ArticleCardProps): ReactElement {
  return (
    <Card data-testid={props.viewModel.testId}>
      <CardTitle>{props.viewModel.title}</CardTitle>
      {/* ... */}
    </Card>
  );
}
```

## When you hit it

1. If the file genuinely needs behavior, it is a container — rename it `*.container.tsx` and
   follow [skills/create-container.md](../../skills/create-container.md).
2. Otherwise move the hook call up into the owning container/hook per
   [rules/02-components-and-containers.md](../../rules/02-components-and-containers.md) and
   [skills/create-hook.md](../../skills/create-hook.md).
3. General procedure: [skills/fix-eslint-typecheck.md](../../skills/fix-eslint-typecheck.md).
   Never `eslint-disable` without an exception in [docs/exceptions/](../exceptions/README.md).
