# frontend-architecture/no-restricted-layer-imports

- **Source:** `eslint/architecture-plugin/rules/no-restricted-layer-imports.mjs`
- **Registered in:** `eslint/architecture.config.mjs` (severity `error`, with the `layerPolicies` table)
- **Helpers:** layer classification in `eslint/architecture-plugin/shared/policy-utils.mjs`

## What it enforces

One-way dependencies between architecture layers. The rule itself is generic; the policy table
lives in `eslint/architecture.config.mjs` so the contract is data, not code. Every import in
`src/**/*.{ts,tsx}` is classified into a layer id (`app`, `module-components`,
`module-hooks`, `module-queries`, `module-services`, `module-gateway`, `module-store`,
`module-containers`, pure-logic layers, `shared`, `packages`, …) and checked against the table.

Current policies (condensed from `eslint/architecture.config.mjs`):

| From                                               | Must not import                                         | Rationale message                                                                  |
| -------------------------------------------------- | ------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| `module-components`                                | hooks, queries, services, gateway, store, app           | `Components receive computed props; behavior lives in containers/hooks.`           |
| `module-hooks`                                     | components, containers, app                             | `Hooks orchestrate data and state; they never reach into the view layer.`          |
| `module-queries`                                   | components, containers, app                             | `Query files bind services to the cache; they never import view code.`             |
| `module-services`                                  | components, containers, hooks, store, queries, app      | `Services are pure API/use-case functions; React does not exist here.`             |
| `module-gateway`                                   | components, containers, hooks, store, queries, app      | `Gateways speak HTTP contracts only.`                                              |
| `module-store`                                     | components, containers, services, queries, gateway, app | `Stores hold client global state only; server data belongs to the query cache.`    |
| `module-containers`                                | services, gateway, app                                  | `Containers consume hooks/queries, never services directly.`                       |
| `module-utils` / `helpers` / `mappers` / `schemas` | every impure layer + app                                | `Pure logic layers depend only on types/constants/enums and other pure logic.`     |
| `shared`                                           | any module layer + app                                  | `Shared code is generic; it must never know about feature modules or routes.`      |
| `packages`                                         | any module layer + shared + app                         | `Package wrappers own one vendor and expose a facade; they sit below every layer.` |

Exemptions built into the rule: type-only imports (`import type { … }`) and test files.

## Why

Without a machine-checked direction, layers erode one PR at a time: a service imports a hook
"just once", shared code learns about a feature module, and the dependency graph becomes a
cycle farm. This rule is what keeps dependency-cruiser (`npm run quality:circular`) clean and
keeps every layer replaceable.

## Violation

A service importing a component (fixture `eslint/architecture-plugin/__fixtures__/invalid/bad-article.service.ts`):

```ts
import { ArticleCard } from '@/modules/articles/components/article-card.component';
```

Reported as:

`Layer 'module-services' must not import layer 'module-components'. Services are pure API/use-case functions; React does not exist here.`

## Compliant fix

Data flows one way: `gateway → service → queries → hooks → containers → components`. If a
service "needs" view code, the dependency is upside down — the container/hook should combine
the two. See `src/modules/articles/` for the reference wiring.

## Options

```jsonc
{
  "policies": [
    {
      "from": "string | string[]",
      "forbid": ["layer-id"],
      "allowIn": ["src/prefix/"],
      "sameModuleOnly": false,
      "message": "…",
    },
  ],
}
```

`from`/`forbid` take layer ids; `allowIn` exempts importer path prefixes; `sameModuleOnly`
restricts a policy to intra-module edges. Change policy only via
`eslint/architecture.config.mjs` review, never per-file.

## When you hit it

1. Re-read the layer map in [rules/01-next-app-router-architecture.md](../../rules/01-next-app-router-architecture.md)
   and move the code to the layer that owns it.
2. If only a type is needed, use `import type` — it is exempt by design.
3. General procedure: [skills/fix-eslint-typecheck.md](../../skills/fix-eslint-typecheck.md);
   policy changes require an ADR or exception ([docs/exceptions/](../exceptions/README.md)).
