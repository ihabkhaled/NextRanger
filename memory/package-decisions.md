# Package Decisions

Every third-party package below is owned by exactly one wrapper under `src/packages/` (policy:
[rules/09-library-wrapping.md](../rules/09-library-wrapping.md), ownership map:
[context/package-boundaries.md](../context/package-boundaries.md)). This file records **why each
package won** over its alternatives. Propose a replacement only with a new dated entry here.

## dayjs over date-fns (and Luxon)

- **Decision:** `dayjs`, wrapped at `src/packages/date` (`formatDisplayDate`,
  `formatDisplayDateTime`, `formatRelativeToNow`, `toIsoString`, `isValidDate`).
- **Why:** tiny immutable core with opt-in plugins; the wrapper exposes five verbs, so tree-shaking
  ergonomics of date-fns buy nothing once imports are funneled through one file. Luxon's Intl
  strength is unused because display formatting already routes through the locale-aware wrapper.
  If dayjs is ever swapped, only `src/packages/date` changes.

## next-intl over react-i18next

- **Decision:** `next-intl`, wrapped at `src/packages/i18n` (`useAppTranslation`,
  `getServerTranslations`, `AppIntlProvider`, catalogs in `src/packages/i18n/messages/`).
- **Why:** first-class App Router support — server components translate via
  `getServerTranslations` without shipping catalogs to the client, and the cookie-based locale
  (`LOCALE_COOKIE_NAME = 'NEXT_LOCALE'`) integrates with `src/packages/i18n/request.ts`.
  react-i18next is client-centric and would force provider gymnastics in server components.
  Full rationale: [i18n-rtl-decisions.md](./i18n-rtl-decisions.md).

## sonner over react-hot-toast

- **Decision:** `sonner`, wrapped at `src/packages/toast` (`showToast`, `ToastType`, `AppToaster`).
- **Why:** accessible by default (polite live regions, keyboard dismissal), works as a single
  mounted `AppToaster`, and has a minimal imperative API that maps cleanly onto our typed
  `showToast` facade. react-hot-toast's styling model invites inline classNames, which the
  design-system rule forbids outside `src/packages/ui-primitives`.

## react-virtuoso over react-window / react-virtualized

- **Decision:** `react-virtuoso`, wrapped at `src/packages/virtuoso` (`VirtualizedList`).
- **Why:** automatic dynamic row measurement — no `itemSize` bookkeeping, which is where
  react-window integrations rot. The wrapper (`src/packages/virtuoso/virtualized-list.tsx`)
  requires `computeItemKey` and a fixed `heightPx`, keeping the surface narrow under
  `exactOptionalPropertyTypes`. Threshold for using it:
  [performance-decisions.md](./performance-decisions.md).

## axios over raw fetch

- **Decision:** `axios`, wrapped at `src/packages/axios` (`httpClient`, `createHttpClient`,
  `HttpError`, `isHttpError`, `normalizeToHttpError`).
- **Why:** interceptors give one choke point to normalize every transport failure into `HttpError`
  before it reaches services; raw fetch requires hand-rolling status handling, JSON parsing,
  timeouts, and error shaping at every call site. Since all client traffic goes to the same-origin
  BFF gateway via `buildGatewayPath` (`src/shared/api/api-routes.constants.ts`), fetch's
  edge-runtime advantages are irrelevant here.

## cva + clsx + tailwind-merge trio

- **Decision:** `class-variance-authority` for variant tables, `clsx` for conditional
  composition, `tailwind-merge` for conflict resolution — fused into one `cn` helper and the
  primitives in `src/packages/ui-primitives`.
- **Why:** cva makes variants declarative data (`buttonVariants`, `alertVariants`,
  `stackVariants`); tailwind-merge guarantees the last conflicting utility wins so primitives can
  accept a `className` escape hatch safely. No component outside the design system composes raw
  class strings (rule: `no-inline-classname-outside-design-system`).

## No Radix yet — native-first primitives

- **Decision:** no headless-UI dependency. Primitives (`Button`, `Input`, `Label`, `Card`,
  `Alert`, `Spinner`, `Skeleton`, `Stack`, `PageContainer`) are native elements styled with
  tokens.
- **Why:** everything currently shipped is achievable with semantic HTML plus the jsx-a11y strict
  preset; a headless library adds a dependency surface before any overlay/popover need exists.
  When a composite widget (dialog, combobox, menu) is genuinely needed, Radix is the pre-approved
  candidate and gets its own wrapper under `src/packages/` — record the adoption here first.

## npm over pnpm / yarn

- **Decision:** npm (`packageManager: npm@10.7.0`, `engines.npm >= 10`).
- **Why:** zero-install tooling on every Node >= 22 machine and CI image; `overrides` handles the
  transitive-vulnerability workflow we actually use (see the postcss case in
  [known-pitfalls.md](./known-pitfalls.md)); no workspace features are needed in a single-app
  repo. pnpm's strictness benefits are already delivered by knip, `no-raw-package-imports`, and
  the lockfile-committed policy — a second package manager would only add onboarding friction.
