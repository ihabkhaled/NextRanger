# Package Boundaries

Every third-party vendor has exactly one owning wrapper. Importing a vendor anywhere else is an
ESLint error via `frontend-architecture/no-raw-package-imports`, configured in
[eslint/package-boundaries.config.mjs](../eslint/package-boundaries.config.mjs). That config file
is the machine-readable twin of this page — update both together (its header comment says so).

## Vendor → owner → exports

| Vendor                                                 | Owner wrapper                | Key exports (the app-facing API)                                                                                                                                                                                                                                     |
| ------------------------------------------------------ | ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `axios`                                                | `src/packages/axios`         | `httpClient`, `createHttpClient`, `HttpError`, `isHttpError`, `normalizeToHttpError`                                                                                                                                                                                 |
| `@tanstack/react-query` (+ `-devtools`)                | `src/packages/query`         | `AppQueryProvider`, `useAppQuery`, `useAppMutation`, `useAppQueryClient`, `useAppSuspenseQuery`, `AppQueryKey`                                                                                                                                                       |
| `zustand`                                              | `src/packages/zustand`       | `createAppStore`, `useAppStoreShallow`                                                                                                                                                                                                                               |
| `zod`                                                  | `src/packages/zod`           | `z`, `parseSchema`, `safeParseSchema`, `SchemaParseError`                                                                                                                                                                                                            |
| `dayjs` (and `date-fns`, reserved)                     | `src/packages/date`          | `formatDisplayDate`, `formatDisplayDateTime`, `formatRelativeToNow`, `toIsoString`, `isValidDate`                                                                                                                                                                    |
| `react-hook-form` + `@hookform/resolvers`              | `src/packages/forms`         | `useAppZodForm`, `AppRegisteredFieldProps`                                                                                                                                                                                                                           |
| `next-intl`                                            | `src/packages/i18n`          | `useAppTranslation`, `useAppLocale`, `getServerTranslations`, `getServerLocale`, `AppIntlProvider`, `SUPPORTED_LOCALES` (en\|ar), `DEFAULT_LOCALE`, `LOCALE_COOKIE_NAME` (`'NEXT_LOCALE'`), `getLocaleDirection`; catalogs `src/packages/i18n/messages/{en,ar}.json` |
| `sonner`                                               | `src/packages/toast`         | `showToast`, `ToastType`, `AppToaster`                                                                                                                                                                                                                               |
| `lucide-react`                                         | `src/packages/icons`         | Named `*Icon` exports only                                                                                                                                                                                                                                           |
| `clsx` + `tailwind-merge` + `class-variance-authority` | `src/packages/ui-primitives` | `cn`, `Button`, `Input`, `Label`, `Card`/`CardTitle`/`CardDescription`/`CardContent`, `Alert`, `Spinner`, `Skeleton`, `Stack`, `PageContainer`, `buttonVariants`, `alertVariants`, `stackVariants`                                                                   |
| `react-virtuoso`                                       | `src/packages/virtuoso`      | `VirtualizedList`                                                                                                                                                                                                                                                    |
| `msw`                                                  | `src/tests/msw`              | Test-only owner: node server + handlers                                                                                                                                                                                                                              |
| `next/link`                                            | `src/packages/link`          | `AppLink` (typed-route internal links), `ExternalLink` (rel-safe)                                                                                                                                                                                                    |
| `next/image`                                           | `src/packages/image`         | `AppImage` (alt mandatory)                                                                                                                                                                                                                                           |
| `next/navigation`                                      | `src/packages/navigation`    | `useAppNavigation`, `appRedirect`, `appNotFound`                                                                                                                                                                                                                     |
| `next/font/google`, `next/font/local`                  | `src/shared/fonts`           | `interFont` (app-fonts.ts)                                                                                                                                                                                                                                           |
| `process.env`                                          | `src/packages/env`           | `publicEnv` (client-safe); `getServerEnv` from `@/packages/env/server` guarded by `server-only`                                                                                                                                                                      |
| Browser globals (`window`, `document`, …)              | `src/packages/browser`       | `isBrowser`, `getSafeWindow`, `getSafeDocument`, `matchesMediaQuery`, `prefersReducedMotion`, `copyTextToClipboard`, `setRootAttribute`, `getRootAttribute`                                                                                                          |
| Web storage                                            | `src/packages/storage`       | `readStorageJson` (schema-validated), `writeStorageJson`, `removeStorageItem`                                                                                                                                                                                        |
| `console`                                              | `src/packages/logger`        | `appLogger`                                                                                                                                                                                                                                                          |

Env, browser, storage, and console ownership is enforced by the companion rules
`no-process-env-outside-config` and `no-direct-browser-api-outside-packages` rather than the
boundary map — same doctrine, different detection.

## Forbidden vs. allowed

```ts
// FORBIDDEN — raw vendor imports outside the owner wrapper (ESLint error):
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';
import dayjs from 'dayjs';
import { toast } from 'sonner';
import Link from 'next/link';
const url = process.env.NEXT_PUBLIC_APP_URL;
window.localStorage.setItem('theme', 'dark');

// ALLOWED — the facade equivalents:
import { httpClient, isHttpError } from '@/packages/axios';
import { useAppQuery } from '@/packages/query';
import { z, parseSchema } from '@/packages/zod';
import { formatDisplayDate } from '@/packages/date';
import { showToast, ToastType } from '@/packages/toast';
import { AppLink } from '@/packages/link';
import { publicEnv } from '@/packages/env';
import { writeStorageJson } from '@/packages/storage';
```

## Rules for adding a new vendor

1. Justify it: no existing wrapper covers the need, and the dependency passes the review bar in
   [rules/09-library-wrapping.md](../rules/09-library-wrapping.md) (maintenance, size, license,
   `npm audit` / `security:scan` clean).
2. Create exactly one owner: `src/packages/<vendor>/` with an `index.ts` facade exposing
   app-named exports (`useAppX`, `AppX`, verbs) — never re-export the vendor API wholesale.
   Follow [skills/create-package-wrapper.md](../skills/create-package-wrapper.md).
3. Register the boundary: add a `{ package: '<vendor>', owners: ['src/packages/<vendor>/'] }`
   entry to [eslint/package-boundaries.config.mjs](../eslint/package-boundaries.config.mjs).
   For framework subpath vendors (like `next/link`) set `matchSubpaths: false`.
4. Update this page and record the decision in
   [memory/package-decisions.md](../memory/package-decisions.md).
5. Test the facade to the 100% threshold that applies to pure layers where relevant, and run
   `npm run quality:dead-code` so knip confirms every export is used.

One vendor, one owner, one facade. If two wrappers need the same vendor, the design is wrong —
extract the shared need into the single owner instead.
