# i18n and RTL Decisions

Rationale for the internationalization posture. Normative rules:
[rules/14-i18n-rtl.md](../rules/14-i18n-rtl.md); library choice rationale in
[package-decisions.md](./package-decisions.md).

## Path-based locale routing

- **Decision:** every page uses a `src/app/[locale]/` route and a `/<locale>/...` URL.
  `ROUTE_PATHS` remains locale-free; `buildLocalizedPath` and `buildLocalizedLocation` add or
  replace the locale segment at navigation boundaries.
- **Superseded:** the original cookie-only design and its rejection of path prefixes.
- **Why:** public marketing pages require separately crawlable locale documents, reciprocal
  hreflang, stable shared URLs, and locale-specific social metadata. One route shape still serves
  every language while helpers preserve path, query, and hash.

## Fourteen-locale contract

- **Decision:** the locale list is owned only by `SUPPORTED_LOCALES` with English as the default.
  One JSON catalog exists per locale; tests enforce key, placeholder, and corruption parity.
- **Why:** Arabic and Persian prove RTL behavior; Hindi, Thai, Japanese, Chinese, and Korean prove
  non-Latin shaping; the remaining high-usage languages exercise longer Latin copy.
- **Release note:** catalog tests prove structure and basic corruption checks, not native-speaker
  editorial approval. Production teams MUST review brand copy with qualified translators.

## Direction via `dir` attribute + logical properties

- **Decision:** direction is derived from the locale by `getLocaleDirection`
  (`src/packages/i18n/locale.constants.ts`, RTL set = `{ar, fa}`) and applied as the `dir` attribute
  on the document root (synced by the ui-preferences module). Styling MUST use CSS logical
  properties — Tailwind's `ms-*`/`me-*`/`ps-*`/`pe-*`/`start-*`/`end-*` utilities — never
  `ml-*`/`mr-*`/`left-*`/`right-*` for direction-sensitive spacing.
- **Rejected alternative:** RTL-specific stylesheet overrides or `rtl:` variant sprawl.
- **Why:** the `dir` attribute makes the browser do the mirroring; logical properties make every
  component correct in both directions with one class list. `rtl:` variants are reserved for the
  rare genuinely asymmetric case (e.g., an icon that must not mirror) and each use needs a
  comment. Visual specs in `src/tests/visual/` capture both directions to catch physical-property
  regressions.

## Message keys, plurals, and the no-raw-text rule

- **Decision:** all user-visible copy comes from catalogs through `useAppTranslation` /
  `getServerTranslations`, namespaced by `I18N_NAMESPACES`
  (`src/shared/i18n/i18n-namespaces.constants.ts`). Raw literals in JSX are lint errors
  (`no-raw-i18n-text`, [docs/eslint/no-raw-i18n-text.md](../docs/eslint/no-raw-i18n-text.md)).
  The single exception is `FALLBACK_ERROR_COPY` for `global-error`, where the i18n runtime itself
  may have crashed.
- **Plurals:** counts MUST use ICU plural messages, never `count === 1 ? … : …` in code. Arabic
  has six CLDR plural categories (zero, one, two, few, many, other); English's two-branch ternary
  is untranslatable into ar. The catalogs carry the categories; the code passes the number.
- **Error copy:** errors cross layers as message keys (`ERROR_MESSAGE_KEYS`,
  `src/shared/errors/error-keys.constants.ts`) mapped by `mapErrorToMessageKey`, and are
  translated only at the presentation edge — hooks like `useArticlesList` build fully-translated
  view models so components stay copy-free.

Adding a key follows [skills/add-i18n-message-key.md](../skills/add-i18n-message-key.md); review
follows the [agents/i18n-rtl-reviewer.md](../agents/i18n-rtl-reviewer.md) charter.
