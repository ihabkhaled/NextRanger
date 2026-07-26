# 10 — ESLint and TypeScript

Static analysis is the primary enforcement layer of this OS: if a rule in `rules/` matters, an
ESLint rule or compiler flag backs it. Lint runs with `--max-warnings=0` — a warning is a failure.

## Flat config layout

The root [eslint.config.mjs](../eslint.config.mjs) is an orchestrator only — it composes the split
configs under `eslint/` and defines no rules itself. Order matters: `ignores.config.mjs` first,
`prettier.config.mjs` last. Each concern has its own file (`base`, `typescript`, `react`,
`react-hooks`, `next`, `tanstack-query`, `accessibility`, `imports`, `promise`, `regexp`,
`security`, `sonar`, `unicorn`, `architecture`, `package-boundaries`, `test`, `storybook`,
`prettier`). Never add a rule to the root file; edit the config that owns the concern.

## The frontend-architecture plugin

The local plugin lives at [eslint/architecture-plugin.mjs](../eslint/architecture-plugin.mjs) with
rule implementations in `eslint/architecture-plugin/rules/` and shared AST/policy helpers in
`eslint/architecture-plugin/shared/`. Its 14 rules, each documented in `docs/eslint/`:

| Rule                                                                                               | One-liner                                                                                                                                     |
| -------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| [no-hooks-in-components](../docs/eslint/no-hooks-in-components.md)                                 | `*.component.tsx` files must not call hooks — behavior lives in hooks/containers.                                                             |
| [no-inline-declarations](../docs/eslint/no-inline-declarations.md)                                 | Objects/arrays/functions must be declared in constants/variants/helper files, not inline.                                                     |
| [no-inline-component-logic](../docs/eslint/no-inline-component-logic.md)                           | Components render pre-computed props; computation in a component file is an error.                                                            |
| [no-restricted-layer-imports](../docs/eslint/no-restricted-layer-imports.md)                       | One-way layer dependencies, driven by the policy table in [eslint/architecture.config.mjs](../eslint/architecture.config.mjs).                |
| [no-raw-package-imports](../docs/eslint/no-raw-package-imports.md)                                 | Vendor packages import only inside their owning wrapper, per [eslint/package-boundaries.config.mjs](../eslint/package-boundaries.config.mjs). |
| [no-cross-module-deep-imports](../docs/eslint/no-cross-module-deep-imports.md)                     | Cross-module imports go through `@/modules/<feature>` public surfaces only.                                                                   |
| [no-process-env-outside-config](../docs/eslint/no-process-env-outside-config.md)                   | `process.env` reads only inside the env package / config layer.                                                                               |
| [no-direct-browser-api-outside-packages](../docs/eslint/no-direct-browser-api-outside-packages.md) | `window`/`document`/storage only via `@/packages/browser` and `@/packages/storage`.                                                           |
| [no-inline-query-keys](../docs/eslint/no-inline-query-keys.md)                                     | Query keys come from builder files, never inline arrays.                                                                                      |
| [no-raw-i18n-text](../docs/eslint/no-raw-i18n-text.md)                                             | No hardcoded user-facing copy; everything is a translation key.                                                                               |
| [no-react-in-pure-layers](../docs/eslint/no-react-in-pure-layers.md)                               | Services, gateways, utils, helpers, and mappers must not import React.                                                                        |
|                                                                                                    | [no-inline-classname-outside-design-system](../docs/eslint/no-inline-classname-outside-design-system.md)                                      | Raw `className` strings only in variants files and design-system primitives. |
| [require-client-component-reason](../docs/eslint/require-client-component-reason.md)               | Every `'use client'` needs a `// client-boundary-reason:` comment.                                                                            |
| [no-server-only-import-in-client](../docs/eslint/no-server-only-import-in-client.md)               | Server-only modules (e.g. `@/packages/env/server`) never reach client code.                                                                   |

## TypeScript: strict family, all on

[tsconfig.json](../tsconfig.json) enables the full strict set and the traps beyond it:
`strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `noImplicitOverride`,
`noPropertyAccessFromIndexSignature`, `noFallthroughCasesInSwitch`, `noImplicitReturns`,
`noUnusedLocals`, `noUnusedParameters`, `useUnknownInCatchVariables`, `verbatimModuleSyntax`,
`isolatedModules`. None of these flags may be weakened; scoped configs (`tsconfig.app.json`,
`tsconfig.test.json`, `tsconfig.node.json`, plus `tsconfig.build.json` / `tsconfig.eslint.json`)
extend the base rather than fork it. Path aliases (`@/*`, `@modules/*`, `@shared/*`,
`@packages/*`, `@tests/*`) are the only import roots — no relative walks across top-level areas.

## Stable TypeScript 7 build compiler

`npm run typecheck` invokes the stable TypeScript 7 binary from `@typescript/native` over the
app/test/node configs and prints both installed compiler versions first. `npm run build` runs the
TypeScript 7 app check before the supported Next.js/Turbopack production build. Because TypeScript
7 does not expose the JavaScript API required by ESLint tooling, the root `typescript` alias points
to `@typescript/typescript6`; `npm run typecheck:compat` checks the same configs with that API.
Both gates MUST be clean.

`npm run lint:severity` calculates the effective config for representative app, utility, test,
and tooling files. Any enabled rule configured as `warn` fails; enabled rules are errors or off
with a documented compatibility/ownership rationale.

## No-disable policy

`any`, non-null assertions (`!`), `@ts-ignore`/`@ts-expect-error`, and `eslint-disable` comments
are banned by default (typed-lint rules in [eslint/typescript.config.mjs](../eslint/typescript.config.mjs)).
The only legal escape hatch is a documented exception: file it under
[docs/exceptions/](../docs/exceptions/README.md) using
[docs/exceptions/exception-template.md](../docs/exceptions/exception-template.md), reference it in
the disable comment, and expect it to be challenged in review. An undocumented disable fails the
gate regardless of how harmless it looks.

When the gate breaks: [skills/fix-eslint-typecheck.md](../skills/fix-eslint-typecheck.md).
Full per-rule reference: [docs/eslint/README.md](../docs/eslint/README.md).
