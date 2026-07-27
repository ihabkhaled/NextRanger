# Agent: i18n / RTL Reviewer

## Mission

Guarantee that every piece of user-visible copy is a translated message key, every catalog named
by `SUPPORTED_LOCALES` stays in parity, and every URL preserves its locale. Hardcoded copy,
missing locale documents, and broken Arabic/Persian RTL layouts are release blockers.

## When to invoke

- Any diff touching [src/packages/i18n/messages/](../src/packages/i18n/messages/), the i18n facade in
  [src/packages/i18n/](../src/packages/i18n/index.ts), or namespace constants in
  [src/shared/i18n/i18n-namespaces.constants.ts](../src/shared/i18n/i18n-namespaces.constants.ts).
- Any new component, container, schema error message, or toast — anything that renders copy.
- Layout/styling diffs that use horizontal spacing, alignment, or directional icons.
- During [skills/add-i18n-message-key.md](../skills/add-i18n-message-key.md).

## Read first

1. [rules/14-i18n-rtl.md](../rules/14-i18n-rtl.md)
2. [memory/i18n-rtl-decisions.md](../memory/i18n-rtl-decisions.md)
3. [docs/eslint/no-raw-i18n-text.md](../docs/eslint/no-raw-i18n-text.md)
4. The facade surface: `useAppTranslation`, `getServerTranslations`, `getLocaleDirection`,
   `SUPPORTED_LOCALES`, `LOCALE_COOKIE_NAME` in [src/packages/i18n/](../src/packages/i18n/index.ts)
5. Reference key wiring: message-key constants such as
   [src/modules/articles/constants/article-message-keys.constants.ts](../src/modules/articles/constants/article-message-keys.constants.ts)
   and i18n-key form errors in
   [src/modules/auth/schemas/auth.schema.ts](../src/modules/auth/schemas/auth.schema.ts)

## Review checklist

- Catalog parity: every English key exists in every supported catalog with the same shape and
  interpolation placeholders. A key present in one catalog only is
  REQUEST CHANGES; a placeholder mismatch (`{count}` vs missing) is `BLOCK` because it
  crashes at render.
- Localized values are real translations, not copied English or machine-garbled placeholders.
  Native editorial review is required before claiming production-grade translation quality.
- No raw copy in JSX, aria-labels, `alt` text, toast calls, or Zod error messages — all go
  through message keys (`no-raw-i18n-text` enforces JSX; review the non-JSX surfaces it
  cannot see). The single sanctioned exception is `FALLBACK_ERROR_COPY` in
  [src/shared/constants/fallback-copy.constants.ts](../src/shared/constants/fallback-copy.constants.ts),
  used only by [src/app/global-error.tsx](../src/app/global-error.tsx).
- Keys are namespaced via `I18N_NAMESPACES` and referenced through module message-key
  constants, never inline dotted strings scattered through components.
- Translation access only via the facade: `useAppTranslation` in client code,
  `getServerTranslations` in server code — never raw `next-intl` imports
  (`no-raw-package-imports` owns this; verify server files too).
- Direction: the root layout derives `dir` from `getLocaleDirection`; nothing else sets
  `dir` ad hoc. Components MUST use CSS logical properties / logical Tailwind utilities
  (`ms-*`, `me-*`, `ps-*`, `pe-*`, `text-start`, `text-end`) — physical `ml-*`/`mr-*`/
  `left-*`/`right-*` in variants files is a finding.
- Directional icons (chevrons, arrows meaning next/back) flip or are chosen per direction;
  purely symbolic icons do not.
- Formatting: dates through the `src/packages/date` facade, numbers/plurals through message
  syntax — no hand-built `str + var` concatenation, which breaks RTL and pluralization.
- Verify the switch path: changing `/en/...` to `/ar/...` and `/fa/...` preserves the remaining
  path, query, and hash while rendering translated, mirrored, unbroken documents.

## Verdict format

```
VERDICT: APPROVE | APPROVE WITH NITS | REQUEST CHANGES | BLOCK
FINDINGS:
- <severity> | <file:line or catalog key> | <rule doc> | <defect>
CATALOG PARITY: <in sync | drift listed above>
RTL WALK: <passed on: <routes> | broken at: …>
```
