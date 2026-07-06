# 09 — Library Wrapping

Every third-party package has exactly **one owner**: a wrapper directory under `src/packages/`.
Application code imports the wrapper's public surface (`@/packages/<name>`), never the vendor
package. This is how the repo survives major-version upgrades, swaps a library in one PR, and
keeps vendor quirks (error shapes, SSR hazards, unsafe defaults) contained in one file.

## The ownership map

The full vendor → wrapper table lives in
[eslint/package-boundaries.config.mjs](../eslint/package-boundaries.config.mjs) and in
[context/package-boundaries.md](../context/package-boundaries.md). Highlights:

| Vendor                                       | Owner                                                                                     | Public surface                                                                                                 |
| -------------------------------------------- | ----------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `axios`                                      | `src/packages/axios`                                                                      | `httpClient`, `createHttpClient`, `HttpError`, `isHttpError`, `normalizeToHttpError`                           |
| `@tanstack/react-query`                      | `src/packages/query`                                                                      | `AppQueryProvider`, `useAppQuery`, `useAppMutation`, `useAppSuspenseQuery`, `useAppQueryClient`, `AppQueryKey` |
| `zustand`                                    | `src/packages/zustand`                                                                    | `createAppStore`, `useAppStoreShallow`                                                                         |
| `zod`                                        | `src/packages/zod`                                                                        | `z`, `parseSchema`, `safeParseSchema`, `SchemaParseError`                                                      |
| `dayjs`                                      | `src/packages/date`                                                                       | `formatDisplayDate`, `formatDisplayDateTime`, `formatRelativeToNow`, `toIsoString`, `isValidDate`              |
| `react-hook-form`                            | `src/packages/forms`                                                                      | `useAppZodForm`, `AppRegisteredFieldProps`                                                                     |
| `next-intl`                                  | `src/packages/i18n`                                                                       | `useAppTranslation`, `getServerTranslations`, `AppIntlProvider`, locale constants                              |
| `sonner`                                     | `src/packages/toast`                                                                      | `showToast`, `ToastType`, `AppToaster`                                                                         |
| `lucide-react`                               | `src/packages/icons`                                                                      | named `*Icon` exports only                                                                                     |
| `clsx` + `tailwind-merge` + `cva`            | `src/packages/ui-primitives`                                                              | `cn`, `Button`, `Card`, `Alert`, variants                                                                      |
| `react-virtuoso`                             | `src/packages/virtuoso`                                                                   | `VirtualizedList`                                                                                              |
| `next/link`, `next/image`, `next/navigation` | `src/packages/link`, `src/packages/image`, `src/packages/navigation`                      | `AppLink`/`ExternalLink`, `AppImage` (alt mandatory), `useAppNavigation`/`appRedirect`/`appNotFound`           |
| env / browser / storage / console            | `src/packages/env`, `src/packages/browser`, `src/packages/storage`, `src/packages/logger` | `publicEnv`+`getServerEnv`, safe browser accessors, schema-validated storage, `appLogger`                      |
| `msw`                                        | `src/tests/msw`                                                                           | test-only owner (server + handlers)                                                                            |
| `next/font`                                  | `src/shared/fonts/app-fonts.ts`                                                           | `interFont`                                                                                                    |

## Facade quality bar

A wrapper is not a re-export. Every `src/packages/<vendor>` MUST have:

1. **An `index.ts` public surface** — the only import path consumers may use. Internal files are
   private (deep imports into a package are boundary violations too).
2. **App-owned types** — consumers depend on names the app controls (`AppQueryKey`,
   `AppRegisteredFieldProps`, `ToastType`), so a vendor type rename never ripples outward.
3. **Error normalization** — vendor failures become app errors at the facade:
   `normalizeToHttpError` in `src/packages/axios`, `SchemaParseError` in `src/packages/zod`.
4. **Safe defaults baked in** — `AppImage` makes `alt` mandatory; `ExternalLink` applies rel
   safety with `isSafeExternalUrl` ([src/shared/security/external-url.helper.ts](../src/shared/security/external-url.helper.ts));
   `readStorageJson` validates with a schema; `getServerEnv` is guarded by `server-only`.
5. **Tests** — the facade's contract (not the vendor's internals) is unit-tested per
   [testing/unit-testing-standard.md](../testing/unit-testing-standard.md).

## Enforcement

`no-raw-package-imports` ([docs/eslint/no-raw-package-imports.md](../docs/eslint/no-raw-package-imports.md))
reads the ownership map in [eslint/package-boundaries.config.mjs](../eslint/package-boundaries.config.mjs):
importing a vendor specifier anywhere except inside its owning wrapper is an error, and the message
names the wrapper to use. `no-direct-browser-api-outside-packages` does the same for globals that
have no npm specifier (`window`, `document`, storage). Adding a dependency without adding its
wrapper and map entry MUST fail review.

New wrapper procedure: [skills/create-package-wrapper.md](../skills/create-package-wrapper.md).
Rationale per package: [memory/package-decisions.md](../memory/package-decisions.md).
