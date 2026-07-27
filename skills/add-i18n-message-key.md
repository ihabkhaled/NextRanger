---
name: add-i18n-message-key
description: Use when adding or changing visible copy, metadata, labels, validation messages, alt text, aria text, toasts, or locale-dependent formatting.
---

# Add an i18n message key

Read [rule 14](../rules/14-i18n-rtl.md). `SUPPORTED_LOCALES` and
`I18N_NAMESPACES` are the mutable sources of truth; never copy their values into application logic.

## Procedure

1. Choose an existing namespace from `I18N_NAMESPACES`, or register one with the feature.
2. Write the English source key, then add the same key to every JSON catalog in
   `src/packages/i18n/messages/`.
3. Preserve the exact object shape and named interpolation placeholders in every locale. Use
   locale-correct ICU plural categories; never copy English plural branches into another language.
4. Put the relative key in the owning `*-message-keys.constants.ts`. Call sites use that constant,
   not dotted string literals. Feature validation keys stay with the feature; only shared
   cross-feature errors belong in `ERROR_MESSAGE_KEYS`.
5. Translate only through `useAppTranslation` in client hooks/containers or
   `getServerTranslations` in server code. Schemas and errors carry keys, never rendered copy.
   Supply named interpolation values at this translation boundary.
6. Check layouts in affected scripts and lengths; explicitly walk Arabic and Persian RTL.
   Structural tests do not replace qualified native review for production brand copy.

Use separate keys when form, metadata, aria, and social contexts need different meaning or length;
matching English words alone do not make a key reusable.

## Verification

```sh
npx vitest run src/tests/unit/i18n-catalog-parity.test.ts
npm run lint
npm run typecheck
npm run assets:social:check
```

If the social check reports intentional copy drift, run `npm run assets:social:generate`, review
every changed locale card, and rerun the check.

## Done

- Every supported catalog has the key, shape, placeholders, and meaningful localized copy.
- Message-key constants own call-site keys; no raw copy exists in JSX, metadata, schemas, or toasts.
- Locale parity, affected behavior, RTL, and zero-warning gates pass.
