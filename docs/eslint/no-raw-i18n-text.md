# frontend-architecture/no-raw-i18n-text

- **Source:** `eslint/architecture-plugin/rules/no-raw-i18n-text.mjs`
- **Registered in:** `eslint/architecture.config.mjs` (severity `error`)
- **Options:** none (`schema: []`)

## What it enforces

`*.component.tsx` files MUST NOT contain raw user-facing copy. The rule reports:

- any JSX text node containing letters (Unicode-aware: `/\p{L}/u`, so Arabic copy is caught
  the same as English);
- any string-literal JSX attribute containing letters, unless the attribute is in the
  `NON_COPY_ATTRIBUTES` allow-list (never-copy props such as `className`, `id`, `type`,
  `href`, `role`, `autoComplete`, design-system props like `variant`, `size`, `tone`,
  `testId`, …) or starts with `data-`.

Every visible string is an i18n message resolved upstream — in a hook or container via
`useAppTranslation` / `getServerTranslations` from `@/packages/i18n` — and passed to the
component as a prop.

## Why

One hardcoded `"Retry"` in a component is invisible until the Arabic locale ships with a
half-translated screen. Because this repo ships every `SUPPORTED_LOCALES` catalog and two RTL
languages, untranslated copy is a correctness bug, not a polish issue. Forcing copy through
message keys in `src/packages/i18n/messages/` keeps every catalog complete and reviewable, and
keeps components locale-agnostic. See [rules/14-i18n-rtl.md](../../rules/14-i18n-rtl.md).

## Violation

From `eslint/architecture-plugin/__fixtures__/invalid/bad-article-card.component.tsx`:

```tsx
<h2 onClick={() => setOpen(!open)}>Latest articles</h2>
```

Reported as:

`Raw user-facing text is forbidden in components. Resolve an i18n message key upstream and pass the translated string as a prop.`

A string prop like `<Input placeholder="Search articles" />` reports:

`Raw user-facing text in the 'placeholder' prop is forbidden. Pass a translated message or an imported constant.`

## Compliant fix

`src/modules/articles/hooks/use-articles-list.hook.ts` builds fully-translated view models
(message keys from `src/modules/articles/constants/article-message-keys.constants.ts`), and
the component renders only props (`src/modules/articles/components/article-card.component.tsx`):

```tsx
<span className={props.viewModel.statusBadgeClassName}>{props.viewModel.statusLabel}</span>
<CardTitle>{props.viewModel.title}</CardTitle>
```

Error copy follows the same pipeline: `mapErrorToMessageKey`
(`src/shared/errors/http-error-to-message-key.mapper.ts`) maps failures to
`ERROR_MESSAGE_KEYS`, translated upstream. The single sanctioned raw-copy exception is
`FALLBACK_ERROR_COPY` for the root `global-error` screen, where the i18n provider itself may
have crashed — and that lives in a constants file, not a component.

## When you hit it

1. Add the message key to both `src/packages/i18n/messages/en.json` and `ar.json`:
   [skills/add-i18n-message-key.md](../../skills/add-i18n-message-key.md).
2. Translate in the hook/container with `useAppTranslation` and pass the string down as a prop.
3. If the flagged attribute is genuinely non-copy (a machine token), pass it as an imported
   constant instead of a literal — that satisfies the rule without weakening it.
4. General procedure: [skills/fix-eslint-typecheck.md](../../skills/fix-eslint-typecheck.md);
   exceptions go through [docs/exceptions/](../exceptions/README.md).
