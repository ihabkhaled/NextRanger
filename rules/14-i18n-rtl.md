# Rule 14 — i18n and RTL

Every user-visible string is translated, every page has a locale-prefixed URL, and every layout
works mirrored. `SUPPORTED_LOCALES` is the only locale source of truth; Arabic (`ar`) and Persian
(`fa`) are the RTL proof that the layout rules are real.

## Catalogs and namespaces

- Message catalogs live in
  [src/packages/i18n/messages/](../src/packages/i18n/messages/). Every locale in
  `SUPPORTED_LOCALES` MUST have one catalog, and all catalogs MUST stay key-for-key identical
  with identical interpolation placeholders.
- Namespaces are constants in
  [src/shared/i18n/i18n-namespaces.constants.ts](../src/shared/i18n/i18n-namespaces.constants.ts)
  (`I18N_NAMESPACES`). Never pass a raw namespace string to a translation hook.
- Adding a key follows [skills/add-i18n-message-key.md](../skills/add-i18n-message-key.md).

## Keys travel, copy does not

- Components and schemas carry i18n keys, never copy. The
  [no-raw-i18n-text](../docs/eslint/no-raw-i18n-text.md) rule bans raw text in JSX.
- Zod schemas emit keys: `loginFormSchema` in [src/modules/auth](../src/modules/auth) sets error
  messages to keys, which the form hook later translates.
- Errors resolve to keys via `ERROR_MESSAGE_KEYS`
  ([src/shared/errors/error-keys.constants.ts](../src/shared/errors/error-keys.constants.ts)); the
  single exception is `FALLBACK_ERROR_COPY`, used only by `src/app/global-error.tsx` where the i18n
  provider itself may have crashed.

## Where translation happens

- Client side: hooks translate. `useAppTranslation` (from [src/packages/i18n](../src/packages/i18n/index.ts))
  is called in hooks and containers, which hand fully-translated view models to TSX-only
  components — `useArticlesList` in [src/modules/articles](../src/modules/articles) is the
  reference.
- Server side: `getServerTranslations` in server components and `generateMetadata`.
- `*.component.tsx` files MUST NOT call translation hooks (they may not call hooks at all —
  [rules/02-components-and-containers.md](../rules/02-components-and-containers.md)).

## Locale URLs and direction

- The first route segment is the locale: `/<locale>/...`. `src/app/[locale]/layout.tsx` validates
  it, and `src/packages/i18n/request.ts` resolves messages from `requestLocale`.
- `ROUTE_PATHS` remains locale-free. Links and redirects MUST use `buildLocalizedPath`; locale
  switches MUST use `buildLocalizedLocation` so path, query, and hash survive.
- `SUPPORTED_LOCALES` and `DEFAULT_LOCALE` live in
  [src/packages/i18n/locale.constants.ts](../src/packages/i18n/locale.constants.ts). Do not repeat
  the locale list in application logic.
- The `dir` attribute MUST come from `getLocaleDirection(locale)` — RTL for `ar` and `fa`, LTR
  otherwise. Never hardcode direction or let persisted preferences override the URL locale.
- Every public page MUST publish canonical and reciprocal hreflang links for all supported
  locales plus `x-default`; see
  [context/localization-and-seo-map.md](../context/localization-and-seo-map.md).

## RTL-safe styling: logical properties only

- Always use logical Tailwind utilities: `ps-*`/`pe-*` (padding), `ms-*`/`me-*` (margin),
  `start-*`/`end-*` (position), `text-start`/`text-end`. Physical `pl-`/`pr-`/`left-`/`right-`/
  `text-left`/`text-right` are banned in app code — they break the mirrored layout.
- Directional icons (chevrons, arrows) MUST be chosen or flipped based on direction in the
  container/hook layer, not hidden behind CSS hacks.
- Class bundles live in `*.variants.ts` files per
  [no-inline-classname-outside-design-system](../docs/eslint/no-inline-classname-outside-design-system.md).

## Plurals — Arabic makes them real

Use ICU plural syntax appropriate to each locale. Arabic has six plural categories, so
`one`/`other` alone is wrong. Real example from
[src/packages/i18n/messages/ar.json](../src/packages/i18n/messages/ar.json):

```json
"readingTime": "{minutes, plural, one {دقيقة قراءة واحدة} two {دقيقتا قراءة} few {# دقائق قراءة} other {# دقيقة قراءة}}"
```

Never build plurals by string concatenation or `count === 1` ternaries.

## Dates and numbers

All date formatting goes through the date facade [src/packages/date](../src/packages/date)
(`formatDisplayDate`, `formatDisplayDateTime`, `formatRelativeToNow`) so locale handling is owned
in one place. Raw `dayjs` imports are banned by
[no-raw-package-imports](../docs/eslint/no-raw-package-imports.md).

Review: [agents/i18n-rtl-reviewer.md](../agents/i18n-rtl-reviewer.md).
Decisions: [memory/i18n-rtl-decisions.md](../memory/i18n-rtl-decisions.md).
