# frontend-architecture/no-direct-browser-api-outside-packages

- **Source:** `eslint/architecture-plugin/rules/no-direct-browser-api-outside-packages.mjs`
- **Registered in:** `eslint/architecture.config.mjs` (severity `error`)

## What it enforces

Direct access to the browser globals `window`, `document`, `localStorage`, `sessionStorage`,
`navigator`, `matchMedia`, and `crypto` is only allowed inside the owning wrappers
`src/packages/browser/` and `src/packages/storage/` (plus `src/proxy.ts`). All other code uses
the safe facades:

- `@/packages/browser` — `isBrowser`, `getSafeWindow`, `getSafeDocument`,
  `matchesMediaQuery`, `prefersReducedMotion`, `copyTextToClipboard`, `setRootAttribute`,
  `getRootAttribute`;
- `@/packages/storage` — `readStorageJson` (schema-validated), `writeStorageJson`,
  `removeStorageItem`.

The rule uses scope analysis: only unresolved (truly global) references are reported, so a
local variable named `document` does not false-positive. Test files are exempt.

## Why

In the App Router, every component may render on the server first. A bare `window.` or
`localStorage.` call is the classic hydration-crash and `ReferenceError: window is not defined`
generator, and ad-hoc storage access means unvalidated JSON parsing scattered everywhere. The
facades centralize SSR-absence handling, availability checks, and Zod-validated
(de)serialization in one reviewed place — exactly how `useUiPreferencesStore`
(`src/modules/ui-preferences/`) persists theme/direction via the storage facade and syncs the
DOM via the browser facade.

## Violation

From `eslint/architecture-plugin/__fixtures__/invalid/bad-article.service.ts`:

```ts
const token = localStorage.getItem('auth-token');
```

Reported as:

`Do not access 'localStorage' directly. Use the safe facade from @/packages/browser or @/packages/storage (SSR-safe, reviewed in one place).`

## Compliant fix

```ts
import { readStorageJson } from '@/packages/storage';
import { STORAGE_KEYS } from '@/shared/constants/storage-keys.constants';

const preferences = readStorageJson(STORAGE_KEYS.uiPreferences, uiPreferencesSchema);
```

For DOM/media access:

```ts
import { prefersReducedMotion, setRootAttribute } from '@/packages/browser';
```

(Note: the repo's cookie-session doctrine means tokens are never in `localStorage` at all —
see [rules/11-security.md](../../rules/11-security.md).)

## Options

```jsonc
{ "allowedPrefixes": ["src/packages/browser/", "src/packages/storage/", "src/proxy.ts"] }
```

Defaults shown above; the repo config relies on the defaults. Extend only via
`eslint/architecture.config.mjs` review.

## When you hit it

1. Look for an existing facade export in `src/packages/browser/` or `src/packages/storage/` —
   most needs are covered.
2. If a capability is missing, add it to the wrapper (SSR-guarded), not at the call site —
   see [skills/create-package-wrapper.md](../../skills/create-package-wrapper.md) and
   [rules/09-library-wrapping.md](../../rules/09-library-wrapping.md).
3. General procedure: [skills/fix-eslint-typecheck.md](../../skills/fix-eslint-typecheck.md).
