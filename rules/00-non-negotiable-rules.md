# 00 — Non-Negotiable Rules

These 20 rules are the contract of this repository. They are never waived in review, never
"cleaned up later", and never bypassed with an eslint-disable that lacks a documented exception
in [docs/exceptions/](../docs/exceptions/README.md). Each entry states why it exists and what
enforces it.

1. **The architecture map is the source of truth.** `src/app` holds routes only, `src/modules/<feature>`
   holds features, `src/shared` holds generic building blocks, `src/packages/<vendor>` holds library
   wrappers. Code in the wrong place rots the whole system because every other rule assumes this layout.
   Enforced by: `no-restricted-layer-imports` driven by the policy table in
   [eslint/architecture.config.mjs](../eslint/architecture.config.mjs), plus review against
   [context/architecture-map.md](../context/architecture-map.md).

2. **Components are TSX-only.** `*.component.tsx` files render pre-computed props and nothing else,
   so they are trivially testable, reusable, and safe to restyle. Enforced by:
   `no-inline-component-logic`, `no-hooks-in-components`, `no-raw-i18n-text`,
   `no-inline-classname-outside-design-system`.

3. **No hooks in components.** Hooks in presentational files smuggle behavior into the view and make
   the component untestable without providers. Behavior belongs in `hooks/` and `containers/`.
   Enforced by: `no-hooks-in-components` ([docs/eslint/no-hooks-in-components.md](../docs/eslint/no-hooks-in-components.md)).

4. **No inline declarations.** Objects, arrays, functions, and config literals declared inside JSX or
   component bodies create unstable references and hide reusable values. Declare them in constants,
   variants, or helper files. Enforced by: `no-inline-declarations`.

5. **No TypeScript `enum` keyword.** `enum` emits runtime code, breaks `isolatedModules` patterns, and
   erases values under `verbatimModuleSyntax`. Use the `as const` object + derived type pattern shown in
   [src/shared/enums/app-theme.enum.ts](../src/shared/enums/app-theme.enum.ts). Enforced by:
   ESLint restricted-syntax in [eslint/typescript.config.mjs](../eslint/typescript.config.mjs) and review.

6. **No magic strings.** Routes, storage keys, test ids, endpoints, message keys, and namespaces come
   from the catalogs in `src/shared/constants/`, `src/shared/errors/`, and module `constants/` folders.
   A string literal repeated twice is already a bug vector. Enforced by: `no-inline-query-keys`,
   `no-raw-i18n-text`, and the review checklist in [rules/20-review-checklist.md](20-review-checklist.md).

7. **No raw package imports outside wrappers.** Every third-party package has exactly one owner under
   `src/packages/` so upgrades, error normalization, and API discipline live in one file. Enforced by:
   `no-raw-package-imports` with the ownership map in
   [eslint/package-boundaries.config.mjs](../eslint/package-boundaries.config.mjs).

8. **No cross-module deep imports.** Modules talk to each other only through `@/modules/<feature>`
   (the `index.ts` public surface); reaching into another module's internals couples features
   irreversibly. Enforced by: `no-cross-module-deep-imports`.

9. **No server data in Zustand.** Server state lives in the TanStack Query cache where it gets caching,
   invalidation, and refetching for free; duplicating it in a store guarantees staleness bugs.
   Enforced by: the `module-store` policy in [eslint/architecture.config.mjs](../eslint/architecture.config.mjs)
   and review per [rules/06-zustand.md](06-zustand.md).

10. **No direct browser APIs outside wrappers.** `window`, `document`, `localStorage`, and
    `matchMedia` crash on the server and scatter feature detection. Use `src/packages/browser` and
    `src/packages/storage`. Enforced by: `no-direct-browser-api-outside-packages`.

11. **No raw `process.env` outside env/config.** Unvalidated env reads fail silently at runtime.
    All env access goes through `publicEnv` / `getServerEnv` in `src/packages/env`, both Zod-validated.
    Enforced by: `no-process-env-outside-config`.

12. **No raw user-facing copy — i18n keys only.** Hardcoded strings are invisible to translators and
    break the ar locale. Copy comes from `src/packages/i18n/messages/{en,ar}.json` via translation keys;
    the single exception is `FALLBACK_ERROR_COPY` for `global-error.tsx`. Enforced by: `no-raw-i18n-text`.

13. **No raw `className` outside the design system.** Tailwind class soup in feature code makes theming
    and RTL audits impossible. Class bundles live in `*.variants.ts` files and
    `src/packages/ui-primitives`. Enforced by: `no-inline-classname-outside-design-system`.

14. **No `any`, non-null assertions, `@ts-ignore`, or undocumented disables.** Each of these deletes the
    type system exactly where it was about to help. Any suppression requires a documented exception in
    [docs/exceptions/](../docs/exceptions/README.md). Enforced by: strict flags in
    [tsconfig.json](../tsconfig.json), typed-lint rules in eslint/typescript.config.mjs, `--max-warnings=0`.

15. **Query keys come from builders only.** Inline key arrays drift from the invalidation code and
    silently stop matching. Keys come from builder files like
    [src/modules/articles/queries/article-query-keys.ts](../src/modules/articles/queries/article-query-keys.ts).
    Enforced by: `no-inline-query-keys`.

16. **API endpoints are constants only.** URL strings assembled ad hoc dodge the BFF gateway and break
    when the backend moves. Paths come from `API_ROUTES` + `buildGatewayPath`
    ([src/shared/api/api-routes.constants.ts](../src/shared/api/api-routes.constants.ts)) and module
    endpoint constants. Enforced by: review + gateway-layer ownership of `httpClient` calls.

17. **Errors surface as sanitized message keys.** Raw error messages can leak internals and are
    untranslatable. Errors normalize through `toAppError` and map to `ERROR_MESSAGE_KEYS` via
    [src/shared/errors/http-error-to-message-key.mapper.ts](../src/shared/errors/http-error-to-message-key.mapper.ts).
    Enforced by: `HttpError` normalization in `src/packages/axios` and review per
    [rules/18-error-handling.md](18-error-handling.md).

18. **Security headers and env validation are mandatory.** The nonce CSP in
    [src/proxy.ts](../src/proxy.ts), the static headers in [next.config.ts](../next.config.ts), and
    Zod-validated env are baseline, not features. Removing any of them is a security regression.
    Enforced by: `npm run security:scan` (Trivy), `security:audit`, and
    [rules/11-security.md](11-security.md).

19. **TDD is required for behavior changes.** A behavior change without a failing test first is a
    change nobody can safely refactor later. Write the test, watch it fail, make it pass.
    Enforced by: coverage thresholds in [vitest.config.mts](../vitest.config.mts) (95% global, 100%
    for utils/helpers/mappers/schemas/query-key builders) and review per
    [testing/testing-strategy.md](../testing/testing-strategy.md).

20. **All gates pass before handoff.** `npm run validate` (lint, format check, typecheck, tests,
    dead-code, circular-deps) plus the security scripts must be green before a PR is opened — CI is a
    verifier, not a debugger. Enforced by: `.husky/pre-commit`, `.husky/pre-push`, and the CI workflows
    in `.github/workflows/` per [rules/19-release-gates.md](19-release-gates.md).
