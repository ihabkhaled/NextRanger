# Skill: Fix ESLint and Typecheck Failures

Lint runs with `--max-warnings=0` plus an error-severity verifier, and stable TypeScript 7 checks
three tsconfig projects, so
"mostly green" does not exist. The prime directive: **fix violations by moving code to the layer
the rule points at — never by disabling the rule.** An `eslint-disable` without a documented
exception in `docs/exceptions/` is itself a lint failure.

## Triage protocol (ESLint)

1. Run `npm run lint` and group failures by rule id.
2. For every `frontend-architecture/*` rule, read its doc first — each rule has one at
   `docs/eslint/<rule-name>.md` (index: [docs/eslint/README.md](../docs/eslint/README.md)). The
   doc explains the intent and the sanctioned fix; the rule message in
   `eslint/architecture.config.mjs` states the layer contract being broken.
3. Apply the resolution from the table below. If the fix means relocating code, follow
   [skills/refactor-feature.md](refactor-feature.md) (tests first, one layer at a time).
4. Re-run `npm run lint`. Use `npm run lint:fix` only for mechanical fixers (import order,
   unused imports) — never expect it to fix architecture rules.

| Violation                                              | Resolution                                                                                                                                                            |
| ------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `no-hooks-in-components`                               | Move the hook call into the container (`*.container.tsx`) or a module hook; pass computed props down.                                                                 |
| `no-inline-declarations` / `no-inline-component-logic` | Extract to `utils/`, `helpers/`, a `*.variants.ts` file, or the container. Components stay TSX-only.                                                                  |
| `no-restricted-layer-imports`                          | You imported against the one-way policy table. Invert the dependency: services never import hooks; move the shared piece down a layer.                                |
| `no-raw-package-imports`                               | Import the owner facade instead (e.g. `@/packages/query`, not `@tanstack/react-query`). Missing owner? [skills/create-package-wrapper.md](create-package-wrapper.md). |
| `no-cross-module-deep-imports`                         | Import from `@/modules/<feature>` and export the symbol from that module's `index.ts` if it is genuinely public.                                                      |
| `no-process-env-outside-config`                        | Read via `publicEnv` / `getServerEnv` from `src/packages/env`; add new vars there and to `.env.example`.                                                              |
| `no-direct-browser-api-outside-packages`               | Use the facade in `src/packages/browser` (`getSafeWindow`, `matchesMediaQuery`, …) or `src/packages/storage`.                                                         |
| `no-inline-query-keys`                                 | Add the key to the module's builder (e.g. `articleQueryKeys` in `src/modules/articles/queries/article-query-keys.ts`) and use it everywhere.                          |
| `no-raw-i18n-text`                                     | Add a message key ([skills/add-i18n-message-key.md](add-i18n-message-key.md)) to `src/packages/i18n/messages/{en,ar}.json` and translate via `useAppTranslation`.     |
| `no-inline-classname-outside-design-system`            | Move class bundles to a `*.variants.ts` file or use a primitive from `src/packages/ui-primitives`.                                                                    |
| `require-client-component-reason`                      | Add `// client-boundary-reason: …` — or better, question whether the file needs `'use client'` at all.                                                                |
| `no-server-only-import-in-client`                      | Keep server env/i18n (`@/packages/env/server`, `getServerTranslations`) in server files; pass data down as props.                                                     |

## Triage protocol (typecheck)

1. Run `npm run typecheck`. It checks `tsconfig.app.json`, `tsconfig.test.json`, and
   `tsconfig.node.json` in sequence — note **which project** failed; that tells you whether the
   error is app code, test code, or tooling config.
2. If a TypeScript 7 diagnostic looks implausible, run `npm run typecheck:compat`. This uses the
   TypeScript 6 API package required by ESLint. Investigate any difference; never swap the aliases.
3. Fix causes, not symptoms: no `any`, no `as` casts to silence a mismatch, no `!` assertions.
   Typical real fixes: narrow with `isDefined` (`src/shared/utils/`), exhaust unions with
   `assertNever`, parse unknown data with `parseSchema`/`safeParseSchema` from
   `src/packages/zod` instead of asserting a shape, and let mappers own wire→domain conversion.
4. Errors in route files about href strings usually mean typedRoutes rejected a path — use
   `ROUTE_PATHS` (`src/shared/constants/route-paths.constants.ts`) with `AppLink`.

## When an exception is genuinely needed

Rare, and never for architecture rules in feature code. If a rule is truly wrong for a specific
line (e.g. a vendor type hole inside a package wrapper):

1. Write the exception using [docs/exceptions/exception-template.md](../docs/exceptions/exception-template.md)
   and add it under `docs/exceptions/` with rationale, scope, owner, and expiry.
2. Only then add the narrowest possible `// eslint-disable-next-line <rule> -- see docs/exceptions/<file>`.
3. Undocumented disables are rejected in review per [rules/20-review-checklist.md](../rules/20-review-checklist.md).

## Done when

`npm run lint` and `npm run typecheck` both exit 0 with no new disables, or every remaining
disable points at a merged exception document.
