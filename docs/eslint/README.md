# Custom ESLint Rules — `frontend-architecture`

This directory documents the 14 custom rules of the local `frontend-architecture` ESLint plugin.
These rules enforce the parts of the architecture contract that no off-the-shelf plugin can:
TSX-only component files, one-way layer imports, package ownership, React-free services/helpers,
env/browser facades, query-key builders, i18n copy discipline, and justified client boundaries.

## Where the code lives

| Piece                                 | Path                                               |
| ------------------------------------- | -------------------------------------------------- |
| Plugin entry (registers all 14 rules) | `eslint/architecture-plugin.mjs`                   |
| Rule implementations                  | `eslint/architecture-plugin/rules/<rule-name>.mjs` |
| Shared AST / path / policy helpers    | `eslint/architecture-plugin/shared/`               |
| Deliberately-invalid fixtures         | `eslint/architecture-plugin/__fixtures__/invalid/` |
| Rule test harness                     | `src/tests/unit/eslint-architecture-rules.test.ts` |

## How the rules are registered

The root `eslint.config.mjs` is orchestrator-only; it composes the split configs in
`eslint/*.config.mjs`. Two of those configs register this plugin:

- `eslint/architecture.config.mjs` registers the plugin under the key `frontend-architecture`
  for `src/**/*.{ts,tsx}` and enables 13 of the 14 rules at `error`. It also supplies the
  **one-way layer policy table** (`layerPolicies`) consumed by
  [`no-restricted-layer-imports`](no-restricted-layer-imports.md), and the repo-specific
  `allowedPrefixes` for [`no-process-env-outside-config`](no-process-env-outside-config.md).
- `eslint/package-boundaries.config.mjs` registers the same plugin under the key
  `frontend-architecture-boundaries` and enables
  [`no-raw-package-imports`](no-raw-package-imports.md) with the **package ownership map**
  (`packageBoundaries`) — the machine-readable twin of
  [context/package-boundaries.md](../../context/package-boundaries.md).

## How the rules are tested

The fixtures under `eslint/architecture-plugin/__fixtures__/invalid/` mirror real source
paths so the path-based rules classify them correctly
(`src/modules/demo/components/bad-article-card.component.tsx`,
`src/modules/demo/services/bad-article.service.ts`, `src/app/bad-client-page.tsx`). They are
deliberate violations, excluded from the normal lint run by
`eslint/ignores.config.mjs` and exercised by `src/tests/unit/eslint-architecture-rules.test.ts`,
which asserts that each rule reports the expected messages on them.

## Enforcement

`npm run lint` runs with `--max-warnings=0`; every rule here is severity `error`, so a single
violation fails the lint gate (pre-commit via lint-staged, and CI). An `eslint-disable` for any
of these rules MUST be backed by a documented exception in
[docs/exceptions/](../exceptions/README.md). When a rule fires, follow
[skills/fix-eslint-typecheck.md](../../skills/fix-eslint-typecheck.md).

## Rule index

| Rule                                                                                | One-line contract                                                                         |
| ----------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| [no-hooks-in-components](no-hooks-in-components.md)                                 | `*.component.tsx` files never call hooks or import hooks/queries/store layers.            |
| [no-inline-declarations](no-inline-declarations.md)                                 | Implementation layers never declare inline types/interfaces/enums/constants.              |
| [no-inline-component-logic](no-inline-component-logic.md)                           | Components render precomputed props: no handlers, transforms, or config literals.         |
| [no-restricted-layer-imports](no-restricted-layer-imports.md)                       | One-way dependencies between architecture layers, driven by a policy table.               |
| [no-raw-package-imports](no-raw-package-imports.md)                                 | Third-party packages import only inside their owning `src/packages/<owner>/` wrapper.     |
| [no-cross-module-deep-imports](no-cross-module-deep-imports.md)                     | Other modules are imported only via their public surface `@/modules/<feature>`.           |
| [no-process-env-outside-config](no-process-env-outside-config.md)                   | Raw `process.env` reads only inside the validated env facade and config files.            |
| [no-direct-browser-api-outside-packages](no-direct-browser-api-outside-packages.md) | Browser globals only inside `src/packages/browser` and `src/packages/storage`.            |
| [no-inline-query-keys](no-inline-query-keys.md)                                     | Query/mutation keys come only from `*query-keys.ts` builder files.                        |
| [no-raw-i18n-text](no-raw-i18n-text.md)                                             | Components carry no raw user-facing copy; every visible string is translated upstream.    |
| [no-react-in-pure-layers](no-react-in-pure-layers.md)                               | Services, gateways, utils, helpers, and mappers must not import `react` or `react-dom`.   |
|                                                                                     | [no-inline-classname-outside-design-system](no-inline-classname-outside-design-system.md) | Raw `className` strings only in design-system primitives and `*.variants.ts`/`*.styles.ts`. |
| [require-client-component-reason](require-client-component-reason.md)               | Every `'use client'` carries a specific `client-boundary-reason` comment.                 |
| [no-server-only-import-in-client](no-server-only-import-in-client.md)               | Client files never import server-only modules, Node built-ins, or the server env facade.  |

## Related documents

- [rules/10-eslint-typescript.md](../../rules/10-eslint-typescript.md) — the overall lint/typecheck policy.
- [rules/01-next-app-router-architecture.md](../../rules/01-next-app-router-architecture.md) — the layer model these rules enforce.
- [agents/eslint-boundary-reviewer.md](../../agents/eslint-boundary-reviewer.md) — the reviewer persona for boundary changes.
