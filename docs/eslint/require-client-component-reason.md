# frontend-architecture/require-client-component-reason

- **Source:** `eslint/architecture-plugin/rules/require-client-component-reason.mjs`
- **Registered in:** `eslint/architecture.config.mjs` (severity `error`)
- **Options:** none (`schema: []`)

## What it enforces

Server Components are the default in this repo. Every `'use client'` directive MUST be
followed — on the line directly below it — by a comment containing
`client-boundary-reason:` and a specific justification. The reason must be at least 15
characters and must not be one of the rejected generic words: `needed`, `required`, `client`,
`interactivity`, `hooks`.

```tsx
'use client';
// client-boundary-reason: connects the interactive articles query hook to presentational components.
```

## Why

`'use client'` is the most expensive directive in the App Router: it drags the file and its
import graph into the client bundle and gives up server rendering for that subtree. Unjustified
boundaries accumulate silently until the "server-first" app ships a client-side monolith. A
mandatory, specific reason makes each boundary a reviewed decision — and makes stale boundaries
findable when the reason no longer holds. See
[rules/01-next-app-router-architecture.md](../../rules/01-next-app-router-architecture.md) and
[rules/12-performance.md](../../rules/12-performance.md).

## Targeted files

Any file in `src/**/*.{ts,tsx}` containing a `'use client'` directive. Files without the
directive are untouched.

## Violation

The fixture `eslint/architecture-plugin/__fixtures__/invalid/bad-client-page.tsx` has
`'use client'` followed by a blank line, so the reason comment is not on the next line:

```tsx
'use client';

// FIXTURE: deliberate violations — …
```

Reported as:

`'use client' requires a '// client-boundary-reason: <specific reason>' comment on the next line.`

A lazy reason such as `// client-boundary-reason: hooks` reports:

`The client-boundary-reason must be specific (what interactivity forces this boundary?), not a generic word.`

## Compliant fix

The real container pattern (`src/modules/articles/containers/articles-list.container.tsx`):

```tsx
'use client';
// client-boundary-reason: connects the interactive articles query hook to presentational components.
```

Write the reason as an answer to "what interactivity forces this boundary?" — form state,
a query hook, a store subscription, a DOM event. If you cannot answer that, the file should
stay a Server Component.

## When you hit it

1. First ask whether the boundary is necessary at all — data-only pages should fetch on the
   server and pass props down; only the interactive leaf needs `'use client'`.
2. If it is necessary, add the comment on the line directly below the directive (no blank
   line between) with a concrete reason
   ([skills/create-container.md](../../skills/create-container.md),
   [skills/add-route.md](../../skills/add-route.md)).
3. General procedure: [skills/fix-eslint-typecheck.md](../../skills/fix-eslint-typecheck.md).
