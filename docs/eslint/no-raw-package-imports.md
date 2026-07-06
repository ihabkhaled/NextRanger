# frontend-architecture/no-raw-package-imports

- **Source:** `eslint/architecture-plugin/rules/no-raw-package-imports.mjs`
- **Registered in:** `eslint/package-boundaries.config.mjs` (plugin key
  `frontend-architecture-boundaries`, severity `error`, with the `packageBoundaries` map)

## What it enforces

Every third-party vendor has exactly one owning wrapper under `src/packages/<owner>/`
(or, for a few Next built-ins, a designated shared/test owner). App code imports the app-owned
facade, never the vendor. The ownership map in `eslint/package-boundaries.config.mjs` is the
machine-readable twin of [context/package-boundaries.md](../../context/package-boundaries.md) —
update both together.

Examples from the map: `axios → src/packages/axios/`, `@tanstack/react-query → src/packages/query/`,
`zustand → src/packages/zustand/`, `zod → src/packages/zod/`, `dayjs → src/packages/date/`,
`next-intl → src/packages/i18n/`, `sonner → src/packages/toast/`, `lucide-react → src/packages/icons/`,
`clsx`/`tailwind-merge`/`class-variance-authority → src/packages/ui-primitives/`,
`msw → src/tests/msw/`, `next/link → src/packages/link/`, `next/image → src/packages/image/`,
`next/navigation → src/packages/navigation/`, `next/font/* → src/shared/fonts/`.

## Why

Unwrapped vendor imports scatter a library's API across the codebase: an axios major upgrade
becomes a 200-file diff, error normalization happens differently per call site, and nobody can
swap or patch the dependency. With one owner, upgrades, security patches, and behavioral
policy (interceptors, defaults, SSR safety) live in a single reviewed directory. See
[rules/09-library-wrapping.md](../../rules/09-library-wrapping.md) and
[memory/package-decisions.md](../../memory/package-decisions.md).

## Violation

From `eslint/architecture-plugin/__fixtures__/invalid/bad-article.service.ts`:

```ts
import axios from 'axios';
```

Reported as:

`Import 'axios' only inside its owner wrapper (src/packages/axios/). Use the app-owned facade instead — see context/package-boundaries.md.`

## Compliant fix

The real gateway pattern (`src/modules/articles/gateway/articles.gateway.ts`) goes through the
facade:

```ts
import { httpClient } from '@/packages/axios';
import { buildGatewayPath } from '@/shared/api/api-routes.constants';
```

Need an icon? `import { SettingsIcon } from '@/packages/icons'`. Need a date label?
`formatDisplayDate` from `@/packages/date`. Need a toast? `showToast` from `@/packages/toast`.

## Options

```jsonc
{
  "boundaries": [
    {
      "package": "axios",
      "owners": ["src/packages/axios/"],
      "matchSubpaths": true,
      "allowInTests": false,
    },
  ],
}
```

- `package` — npm package name, or exact specifier for Next built-ins;
- `matchSubpaths` — default `true` (any subpath of the package matches); set `false` for
  entries like `next/link` where only that exact specifier is owned;
- `owners` — directory prefixes allowed to import the vendor;
- `allowInTests` — set `true` to exempt test files for that package.

## When you hit it

1. Use the existing facade export — the full owner/export list is in
   [context/package-boundaries.md](../../context/package-boundaries.md).
2. If the facade is missing a capability, extend the wrapper (do not bypass it).
3. New dependency? Create a wrapper first:
   [skills/create-package-wrapper.md](../../skills/create-package-wrapper.md).
4. General procedure: [skills/fix-eslint-typecheck.md](../../skills/fix-eslint-typecheck.md).
