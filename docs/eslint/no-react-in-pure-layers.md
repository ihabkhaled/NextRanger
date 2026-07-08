# frontend-architecture/no-react-in-pure-layers

- **Source:** `eslint/architecture-plugin/rules/no-react-in-pure-layers.mjs`
- **Registered in:** `eslint/architecture.config.mjs` (severity `error`)
- **Options:** none (`schema: []`)

## What it enforces

Services, gateways, utils, helpers, and mappers are React-free layers. They must not import `react`, `react-dom`, or any React-related runtime (`react/jsx-runtime`, `react/jsx-dev-runtime`, etc.).

Why: these layers are called from tests, route handlers, and query functions without a renderer. A React import in a service or mapper is a sign that UI logic has leaked downward.

## Targeted files

- `src/modules/<feature>/services/*.service.ts`
- `src/modules/<feature>/gateway/*.gateway.ts`
- `src/modules/<feature>/utils/*.util.ts`
- `src/modules/<feature>/helpers/*.helper.ts`
- `src/modules/<feature>/mappers/*.mapper.ts`
- Shared equivalents under `src/shared/`

Test files are exempt.

## Violation

```ts
import { useMemo } from 'react';

export function listArticles() {
  // ...
}
```

Reported message:

> React-free layer 'services' must not import 'react'. Move React concerns into hooks, containers, or components.

## Compliant fix

Keep React in the view layer. If a value needs memoization, do it in the hook; if a transformation needs a stable reference, return it from a pure helper and memoize it in the hook with `useMemo` / `useCallback`.

## When you hit it

1. Remove the React import from the pure layer.
2. Move the React-dependent computation into a `hooks/*.hook.ts` or `containers/*.container.tsx` file.
3. General procedure: [skills/fix-eslint-typecheck.md](../../skills/fix-eslint-typecheck.md).
