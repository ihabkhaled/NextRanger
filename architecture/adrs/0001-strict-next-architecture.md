# ADR 0001: Strict Next.js frontend architecture

- **Status:** Accepted
- **Date:** 2026-07-06
- **Deciders:** Founding maintainers of strict-next-ranger
- **Related:** [rules/00-non-negotiable-rules.md](../../rules/00-non-negotiable-rules.md),
  [context/architecture-map.md](../../context/architecture-map.md),
  [rules/09-library-wrapping.md](../../rules/09-library-wrapping.md)

## Context

Every large Next.js codebase we have inherited failed the same way. Global `components/`,
`hooks/`, and `utils/` folders grew into hundreds of files with no owner; any file imported any
other file, so refactoring one screen meant regression-testing all of them. Third-party imports
(`axios`, `dayjs`, `zustand`, `next/link`) were scattered across the tree, so a vendor breaking
change or a security patch became a repo-wide search-and-pray. Components mixed fetching, state,
formatting, and markup, which made them untestable in isolation. Conventions lived in wiki pages
that nobody read; only conventions a machine rejects survive team growth and turnover.

This repository exists to be the frontend equivalent of a strict backend operating system: a
starter that any team clones and inherits the discipline automatically.

## Decision

We build strict-next-ranger on five load-bearing choices, each machine-enforced:

1. **Module-first layout.** `src/app` holds only routes, layouts, and route handlers. Features
   live in `src/modules/<feature>` with fixed layers (`api/`, `gateway/`, `services/`, `queries/`,
   `store/`, `containers/`, `components/`, `hooks/`, `mappers/`, `schemas/`, …) and a single
   public surface `index.ts`. Cross-module imports go only through `@/modules/<feature>`.
2. **TSX-only components.** `*.component.tsx` files contain markup only — no hooks, no logic, no
   inline declarations, no raw copy, no raw `className` outside the design system. Containers
   (`*.container.tsx`) connect hooks to components; hooks orchestrate; services and gateways are
   React-free. See [rules/02-components-and-containers.md](../../rules/02-components-and-containers.md).
3. **One owning wrapper per vendor.** Every third-party package is imported in exactly one place
   under `src/packages/<vendor>` (e.g. `src/packages/axios`, `src/packages/query`,
   `src/packages/i18n`). Product code imports the wrapper, never the vendor.
4. **Custom ESLint architecture plugin.** The 14 rules in
   [eslint/architecture-plugin.mjs](../../eslint/architecture-plugin.mjs) (layer policy table in
   [eslint/architecture.config.mjs](../../eslint/architecture.config.mjs), ownership map in
   [eslint/package-boundaries.config.mjs](../../eslint/package-boundaries.config.mjs)) turn every
   choice above into a lint failure, run with `--max-warnings=0`.
5. **BFF gateway.** Browser code calls only the same-origin gateway
   ([src/app/api/gateway/[...path]/gateway-handler.ts](../../src/app/api/gateway/%5B...path%5D/gateway-handler.ts)),
   which serves module mock fixtures when `SERVER_API_MOCKING=enabled` or proxies to
   `SERVER_API_BASE_URL`. The app runs with zero backend on day one.

## Consequences

### Positive

- Boundaries are enforced by `npm run lint`, not by review vigilance; violations cannot merge.
- Vendor churn is contained: a breaking major in any package touches one directory.
- TSX-only components plus React-free services make every layer testable in isolation, which is
  what makes the 95%/100% coverage thresholds in `vitest.config.mts` realistic.
- New engineers learn the structure once from the `articles` reference module and can navigate
  any feature.

### Negative / accepted costs

- Real learning curve: the first week feels slower because the linter rejects habits that were
  legal everywhere else. The [skills/](../../skills/README.md) playbooks exist to offset this.
- More files per feature (component + container + variants + hook) than a quick-and-dirty page.
- The custom plugin is our own code to maintain across ESLint majors.
- Escaping a rule requires a documented exception in [docs/exceptions/](../../docs/exceptions/README.md);
  there is deliberately no cheap way out.

### Revisit trigger

If Next.js App Router conventions change such that the layer model no longer maps onto the
framework (e.g. route handlers or the proxy convention are replaced), or if the plugin's rules
block a legitimate pattern more than they prevent defects, re-evaluate with a superseding ADR.

## Alternatives considered

### Atomic design (atoms/molecules/organisms)

Organizes by visual granularity, not by feature ownership. It answers "how big is this
component?" but not "who owns this behavior?" — fetching, state, and domain logic still end up
in shared folders, reproducing the failure mode we are escaping. Rejected.

### Feature-Sliced Design (FSD)

Closest competitor: it also slices by feature with layered imports. But FSD's shared/entities/
features/widgets layering is generic and unenforced out of the box, and it prescribes nothing
about vendor ownership, TSX-only components, or a BFF. We kept its best idea (feature slices
with a public API) and made the rest stricter and machine-enforced. Rejected as-is.

### Plain Next.js defaults (colocate everything under app/)

Fine for a weekend project; collapses at team scale for the exact reasons in Context. Colocation
under `src/app` gives no import policy, no vendor boundary, and no testable layer separation.
Rejected.

### Do nothing

"Do nothing" here means shipping a starter with folder names and a README of intentions. Every
predecessor repo proves that unenforced intentions decay within two quarters. Rejected.
