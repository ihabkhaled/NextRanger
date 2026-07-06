# frontend-architecture/no-cross-module-deep-imports

- **Source:** `eslint/architecture-plugin/rules/no-cross-module-deep-imports.mjs`
- **Registered in:** `eslint/architecture.config.mjs` (severity `error`)
- **Options:** none (`schema: []`)

## What it enforces

A feature module is a black box. Code outside `src/modules/<feature>/` may import that module
only through its public surface `@/modules/<feature>` — the module's `index.ts` decides what
is public. Deep imports into another module's internals
(`@/modules/articles/services/article.service`) are forbidden. Imports **within** the same
module are unaffected; relative imports are the canonical intra-module style.

## Why

Deep imports turn every internal file into accidental public API: the articles team can no
longer rename `services/article.service.ts` or split a hook without breaking auth or app
routes. The public `index.ts` is the module's contract; everything else stays refactorable.
This is the module-granularity twin of
[no-restricted-layer-imports](no-restricted-layer-imports.md) (layer granularity) and
[no-raw-package-imports](no-raw-package-imports.md) (vendor granularity).

## Targeted files

All of `src/**/*.{ts,tsx}`. The rule resolves `@/…`, `@modules/…`-style aliases and relative
specifiers (see `resolveImportToSourcePath` in
`eslint/architecture-plugin/shared/source-utils.mjs`) and fires only when the resolved target
lives inside a **different** module and is not that module's root/`index`.

## Violation

A route or another module reaching into articles internals:

```ts
import { ArticleCard } from '@/modules/articles/components/article-card.component';
```

Reported as:

`Deep import into module 'articles' internals is forbidden. Import from '@/modules/articles' — its index.ts decides what is public.`

(The same import appears in the fixture
`eslint/architecture-plugin/__fixtures__/invalid/bad-article.service.ts`.)

## Compliant fix

Import from the public surface, which `src/modules/articles/index.ts` curates:

```ts
import { ArticlesListContainer } from '@/modules/articles';
```

If the symbol you need is not exported from `index.ts`, that is a design decision to make in
the owning module: either export it deliberately (widening the module's contract) or expose a
higher-level container/hook instead. Inside the module itself keep using relative paths, as
`src/modules/articles/containers/articles-list.container.tsx` does:

```ts
import { ArticleCard } from '../components/article-card.component';
```

## When you hit it

1. Check `src/modules/<feature>/index.ts` — the export you need may already exist.
2. If not, add it to the module's `index.ts` only if it is genuinely part of the module's
   contract; prefer exporting the container over its internals
   ([skills/create-module.md](../../skills/create-module.md),
   [rules/01-next-app-router-architecture.md](../../rules/01-next-app-router-architecture.md)).
3. If two modules keep needing each other's internals, the shared piece probably belongs in
   `src/shared/` — see [skills/refactor-feature.md](../../skills/refactor-feature.md).
4. General procedure: [skills/fix-eslint-typecheck.md](../../skills/fix-eslint-typecheck.md).
