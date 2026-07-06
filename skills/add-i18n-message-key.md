# Skill: Add an i18n Message Key

Use this skill whenever user-visible copy is added or changed. Raw literal text in JSX is an
ESLint violation (`no-raw-i18n-text`, see
[docs/eslint/no-raw-i18n-text.md](../docs/eslint/no-raw-i18n-text.md)); doctrine is
[rules/14-i18n-rtl.md](../rules/14-i18n-rtl.md).

## Steps

1. **Choose the namespace.** Namespaces are the top-level objects in the message catalogs and
   are enumerated in `src/shared/i18n/i18n-namespaces.constants.ts` (`I18N_NAMESPACES`:
   `app`, `nav`, `home`, `articles`, `auth`, `settings`, `errors`, `notFound`, `errorPage`,
   `workbench`). A new feature module gets its own namespace; add it to `I18N_NAMESPACES`
   in the same commit as the catalog entry.
2. **Add the key to BOTH catalogs** — `src/packages/i18n/messages/en.json` AND
   `src/packages/i18n/messages/ar.json`. Never land one without the other: the app supports
   `en` and `ar` (`SUPPORTED_LOCALES` in `@/packages/i18n`) and a missing key surfaces at
   runtime in the other locale. Arabic copy must be real Arabic, not transliterated English.
3. **Register the key in the module's message-keys constants file.** Hooks never pass raw
   key strings to `t()`. Each module owns a `constants/<feature>-message-keys.constants.ts`
   with keys relative to the namespace — the auth module is the reference:

   ```ts
   export const AUTH_MESSAGE_KEYS = {
     loginTitle: 'login.title',
     loginSubtitle: 'login.subtitle',
     // …
   } as const;
   ```

   (`src/modules/auth/constants/auth-message-keys.constants.ts`). Shared-surface copy
   (nav, errors) uses the analogous shared constants.

4. **Use ICU plural/argument syntax where counts or values appear.** Real examples from the
   catalogs:
   - en: `"readingTime": "{minutes, plural, one {# minute read} other {# minute read}}"`
   - ar: `"readingTime": "{minutes, plural, one {دقيقة قراءة واحدة} two {دقيقتا قراءة} few {# دقائق قراءة} other {# دقيقة قراءة}}"`
     Arabic has more plural categories (`one`, `two`, `few`, `other` at minimum here) — never
     copy the English category set into `ar.json`. Interpolation uses named arguments:
     `"publishedOn": "Published {date}"`, called as
     `t(ARTICLE_MESSAGE_KEYS.publishedOn, { date: formattedDate })` (see
     `src/modules/articles/hooks/use-articles-list.hook.ts`).
5. **Consume via the wrapper only.** Client hooks use
   `useAppTranslation(I18N_NAMESPACES.<ns>)`; server code uses
   `getServerTranslations(I18N_NAMESPACES.<ns>)` — both from `@/packages/i18n`. Raw
   `next-intl` imports outside `src/packages/i18n/` are a boundary violation.
6. **Validation-message keys live in schemas.** Zod schemas embed message KEYS, not copy —
   see `loginFormSchema` in `src/modules/auth/schemas/auth.schema.ts` — and the hook layer
   translates them before display ([skills/add-form.md](add-form.md)).
7. **Verify with tests.**
   - Unit-test any helper that selects keys (e.g. status → key maps) per
     [skills/write-unit-tests.md](write-unit-tests.md).
   - Integration tests assert the rendered English copy through
     `renderWithProviders` (`src/tests/helpers/render-with-providers.tsx`), which mounts the
     real `AppIntlProvider` — so a key missing from `en.json` fails the test.
   - Run `npm run test` and `npm run lint` (the `no-raw-i18n-text` rule catches copy that
     bypassed the catalog).

## Definition of done

- Key exists in `en.json` AND `ar.json` with correct plural categories per locale.
- Key is exposed through a `*-message-keys.constants.ts` file; no raw key strings at call
  sites; no raw copy in JSX or schemas.
