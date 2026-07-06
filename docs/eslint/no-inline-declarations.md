# frontend-architecture/no-inline-declarations

- **Source:** `eslint/architecture-plugin/rules/no-inline-declarations.mjs`
- **Registered in:** `eslint/architecture.config.mjs` (severity `error`)
- **Options:** none (`schema: []`)

## What it enforces

Layered implementation files MUST NOT declare module-level `type` aliases, `interface`s,
`enum`s, or non-function `const` values. Those declarations live in the `types/`, `enums/`,
and `constants/` layers so shapes and configuration are shared, tested, and reviewed in one
place. Additionally, `*.component.tsx` files MUST NOT declare variables or functions inside
the component body — a component receives props and returns JSX.

What is still allowed at module level:

- `const` initialized with a function (`const handler = () => …`) — implementation files exist
  to define functions;
- `const` initialized with a call expression (e.g. `cva(...)` in a variants file scope,
  `createAppStore(...)` in a store file) — factories are how these layers are built;
- the approved name `LOG_PREFIX`.

## Why

Inline `interface InlineProps { … }` next to a component, or `const INLINE_CONFIG = { pageSize: 10 }`
inside a service, hides contracts and configuration where nobody looks for them. Types drift
into duplicates across files, config values escape review, and the 100% coverage target for
`constants/` becomes meaningless because constants hide elsewhere.

## Targeted files

Components (`*.component.tsx`), containers (`*.container.tsx`), hooks (`*.hook.ts(x)`),
services (`*.service.ts`), gateways (`*.gateway.ts`), query files
(`*.queries.ts` / `*.mutations.ts` / `*.invalidate.ts`), and App Router route handlers
(`src/app/**/route.ts`). Test files are exempt.

## Violation

From `eslint/architecture-plugin/__fixtures__/invalid/bad-article-card.component.tsx`:

```tsx
interface InlineProps {
  title: string;
}

const INLINE_CONFIG = { pageSize: 10 };
```

Reported messages:

- `Move this interface into the types/ (or enums/) layer. Implementation files must not declare shapes inline.`
- `Move module-level constant 'INLINE_CONFIG' into a constants/ file. Implementation files must not embed configuration values.`
- Inside a component body: `Component bodies must not declare variables or functions. Compute values in the container/hook and pass them as props.`

## Compliant fix

The articles module keeps every declaration in its layer:

- Props and view models: `src/modules/articles/types/article.types.ts` (`ArticleCardProps`);
- Values: `src/modules/articles/constants/article.constants.ts` and
  `src/modules/articles/constants/article-style.constants.ts`;
- Enums as `as const` objects: `src/modules/articles/enums/article-status.enum.ts`.

The component then imports what it needs:

```tsx
import { articleCardClasses } from '../constants/article-style.constants';
import type { ArticleCardProps } from '../types/article.types';
```

## When you hit it

1. Move the type/interface into the module's `types/` file, the enum into `enums/`, the value
   into `constants/` — see [rules/07-types-enums-constants.md](../../rules/07-types-enums-constants.md).
2. If a component body needs a computed value, compute it in the container or hook and pass it
   as a prop ([rules/02-components-and-containers.md](../../rules/02-components-and-containers.md)).
3. General procedure: [skills/fix-eslint-typecheck.md](../../skills/fix-eslint-typecheck.md);
   exceptions require a record in [docs/exceptions/](../exceptions/README.md).
