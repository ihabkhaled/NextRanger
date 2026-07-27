# UI Design System Decisions

Rationale for the design-system architecture. Normative rules:
[rules/02-components-and-containers.md](../rules/02-components-and-containers.md) and
[rules/12-performance.md](../rules/12-performance.md); trio-of-libraries rationale in
[package-decisions.md](./package-decisions.md).

## Semantic role tokens: `@theme inline` + runtime CSS variables

- **Decision:** `src/app/styles.css` defines two layers of tokens. Runtime layer: `--role-*`
  custom properties (e.g. `--role-primary`, `--role-surface`, `--role-ring`) with light values on
  `:root` and dark values on `[data-theme='dark']`. Tailwind layer: `@theme inline` maps each
  role to a Tailwind color token (`--color-primary: var(--role-primary)`), which is what makes
  utilities like `bg-primary`, `text-foreground`, `outline-ring` exist.
- **Rejected alternatives:** hardcoding palette values in `@theme` directly (Tailwind would
  inline them, breaking runtime theme switching); a `dark:` variant on every class (doubles every
  class list and misses non-Tailwind consumers).
- **Why:** `@theme inline` keeps the utility referencing the CSS variable instead of its value,
  so flipping `data-theme` on the root — done by the ui-preferences store through
  `setRootAttribute` in `src/packages/browser/dom-attributes.ts` — retints the whole app with
  zero re-render and no flash-of-wrong-theme JS. Components speak in **roles** (primary, surface,
  muted, danger…), never in palette values; a rebrand edits one file. The dark variant for the
  rare structural case is declared once:
  `@custom-variant dark (&:where([data-theme='dark'], [data-theme='dark'] *))`.

## Variants-as-constants files instead of inline classes

- **Decision:** class bundles live in dedicated `*.variants.ts` files built with cva —
  `buttonVariants` (`src/packages/ui-primitives/button.variants.ts`), `alertVariants`,
  `stackVariants` — merged via the `cn` helper (clsx + tailwind-merge). Outside
  `src/packages/ui-primitives`, writing a raw `className` string is a lint error
  (`no-inline-classname-outside-design-system`, docs:
  [docs/eslint/no-inline-classname-outside-design-system.md](../docs/eslint/no-inline-classname-outside-design-system.md)).
- **Rejected alternative:** Tailwind's default mode of composing utilities inline at every call
  site.
- **Why:** inline utility strings make every feature file a styling decision point — spacing,
  focus rings, and disabled states drift within weeks. A variants file turns the visual language
  into reviewable data: a `variant`/`size` table with typed props via cva, one place to change,
  and impossible to fork casually. It also keeps `*.component.tsx` files honest — they pass
  variant names, not design opinions.

## Primitive inventory and when to extend

- **Decision:** the current inventory in `src/packages/ui-primitives` is `Button`, `Input`,
  `Label`, `Card`/`CardTitle`/`CardDescription`/`CardContent`, `Alert`, `Spinner`, `Skeleton`,
  `Stack`, `PageContainer`, plus `cn` and the exported variant tables. All are native-element
  based (no headless-UI dependency yet — see [package-decisions.md](./package-decisions.md)).
- **Extend when:** a visual pattern appears in a second module, or a feature needs a styled
  element that would otherwise require a raw className. Procedure: build it inside
  `src/packages/ui-primitives` with role tokens and a variants file, export it from the package
  `index.ts`, add it to the workbench page, and cover it per
  [skills/create-component.md](../skills/create-component.md).
- **Do NOT extend when:** the need is feature-specific composition — that is a module
  `*.component.tsx` composing existing primitives (see `ArticleCard` in
  `src/modules/articles/components/`), not a new primitive.

## Living showcase: the workbench, not Storybook

- **Decision:** every primitive and every variant renders on the `/workbench` route
  (`src/app/[locale]/(workbench)/workbench/page.tsx`, path constant `ROUTE_PATHS.workbench`). Storybook is
  deliberately not used — full reasoning in ADR
  [architecture/adrs/0002-component-workbench-over-storybook.md](../architecture/adrs/0002-component-workbench-over-storybook.md).
- **Why it matters here:** the workbench runs inside the real app shell — real tokens, real
  fonts, real `data-theme` and `dir` switching — so it doubles as the surface that
  `src/tests/visual/` and `src/tests/accessibility/` specs sweep. A new primitive without a
  workbench entry is an unreviewable primitive; adding the entry is a required step of
  [skills/create-component.md](../skills/create-component.md).
