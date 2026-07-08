# frontend-architecture/no-inline-declarations

- **Source:** `eslint/architecture-plugin/rules/no-inline-declarations.mjs`
- **Registered in:** `eslint/architecture.config.mjs` (severity `error`)
- **Options:** none (`schema: []`)

## What it enforces

Layered implementation files MUST NOT declare module-level `type` aliases, `interface`s,
`enum`s, non-function `const` values, or local helper functions. They also MUST NOT use inline
`type`/`interface` literals in function signatures (e.g., `options: { article: Article; … }`).
Those declarations live in the `types/`, `enums/`, `constants/`, `utils/`, and `helpers/` layers so
shapes, configuration, and pure logic are shared, tested, and reviewed in one place.

Additionally, `*.component.tsx` files MUST NOT declare variables or functions inside the component
body — a component receives props and returns TSX.

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
(`*.queries.ts` / `*.mutations.ts` / `*.invalidate.ts`), utils (`*.util.ts`), helpers
(`*.helper.ts`), mappers (`*.mapper.ts`), App Router route handlers (`src/app/**/route.ts`),
and all other App Router implementation files under `src/app/**/*.ts` (e.g. route helpers such
as `gateway-handler.ts`). Style bundles (`*.variants.ts`) and constants files
(`*.constants.ts`) are exempt.
Test files are exempt.

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
- `Move this inline type/interface literal into the types/ layer as a named type. Function signatures in implementation files must import their shapes.`
- `Move this local function 'resolveListState' into a dedicated utils/, helpers/, or mappers/ file. Implementation files must not embed private helpers.`
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
2. Move inline function-signature type literals into named types in `types/`.
3. Move local helper functions into `utils/` or `helpers/` files and add tests for them.
4. If a component body needs a computed value, compute it in the container or hook and pass it
   as a prop ([rules/02-components-and-containers.md](../../rules/02-components-and-containers.md)).
5. General procedure: [skills/fix-eslint-typecheck.md](../../skills/fix-eslint-typecheck.md);
   exceptions require a record in [docs/exceptions/](../exceptions/README.md).
