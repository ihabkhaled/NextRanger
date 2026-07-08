# Rule 14 — i18n and RTL

Every user-visible string is translated, and every layout works mirrored. English (`en`) and Arabic
(`ar`) ship together; Arabic is the RTL proof that the layout rules are real.

## Catalogs and namespaces

- Message catalogs live at [src/packages/i18n/messages/en.json](../src/packages/i18n/messages/en.json)
  and [src/packages/i18n/messages/ar.json](../src/packages/i18n/messages/ar.json). Both files MUST
  stay key-for-key identical — a key added to one without the other fails review.
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

## Locale selection and direction

- The locale is cookie-based: `LOCALE_COOKIE_NAME = 'NEXT_LOCALE'` in
  [src/packages/i18n/locale.constants.ts](../src/packages/i18n/locale.constants.ts), with
  `SUPPORTED_LOCALES = ['en', 'ar']` and `DEFAULT_LOCALE = 'en'`. There are no locale URL prefixes.
- The `dir` attribute MUST come from `getLocaleDirection(locale)` — `'rtl'` for `ar`, `'ltr'`
  otherwise. Never hardcode `dir="ltr"` or infer direction anywhere else.

## RTL-safe styling: logical properties only

- Always use logical Tailwind utilities: `ps-*`/`pe-*` (padding), `ms-*`/`me-*` (margin),
  `start-*`/`end-*` (position), `text-start`/`text-end`. Physical `pl-`/`pr-`/`left-`/`right-`/
  `text-left`/`text-right` are banned in app code — they break the mirrored layout.
- Directional icons (chevrons, arrows) MUST be chosen or flipped based on direction in the
  container/hook layer, not hidden behind CSS hacks.
- Class bundles live in `*.variants.ts` files per
  [no-inline-classname-outside-design-system](../docs/eslint/no-inline-classname-outside-design-system.md).

## Plurals — Arabic makes them real

Use ICU plural syntax; Arabic has six plural categories, so `one`/`other` alone is wrong. Real
example from [src/packages/i18n/messages/ar.json](../src/packages/i18n/messages/ar.json):

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
