# frontend-architecture/no-inline-classname-outside-design-system

- **Source:** `eslint/architecture-plugin/rules/no-inline-classname-outside-design-system.mjs`
- **Registered in:** `eslint/architecture.config.mjs` (severity `error`)

## What it enforces

Raw `className` values — string literals **and** template literals — are forbidden outside the
design system. Class bundles come from imported variants/constants. Allowed locations:

- `src/packages/ui-primitives/` (the `cn`/`cva` owner and the primitive components);
- `src/shared/components/primitives/`;
- dedicated style files matching `*.variants.ts` or `*.styles.ts` (e.g.
  `src/packages/ui-primitives/button.variants.ts`, `src/app/layout.variants.ts`);
- test files.

Passing an imported value (`className={articleCardClasses.meta}`) is always fine — only
literal strings and template literals are reported.

## Why

Inline Tailwind strings scattered across features are how a visual language dies: three
slightly different card paddings, dark-theme tokens missed in one file, and RTL-unsafe
spacing that no review catches. Concentrating class bundles in `*.variants.ts` files and
primitives keeps every visual decision greppable, theme-aware (tokens from
`src/app/styles.css`), and reviewable in one place. See
[memory/ui-design-system-decisions.md](../../memory/ui-design-system-decisions.md).

## Violation

From `eslint/architecture-plugin/__fixtures__/invalid/bad-article-card.component.tsx`:

```tsx
<article className="rounded-lg border p-4">
```

Reported as:

`Raw className strings are forbidden here. Import a variant/constant from the design system or a *.variants.ts file.`

Template literals like ``className={`card ${extra}`}`` are reported with the same message.

## Compliant fix

Bundle the classes in a style constants file
(`src/modules/articles/constants/article-style.constants.ts`):

```ts
export const articleCardClasses = {
  meta: 'flex flex-row flex-wrap items-center gap-3 text-xs text-muted-foreground',
} as const;
```

and consume it in the component (`src/modules/articles/components/article-card.component.tsx`):

```tsx
<p className={articleCardClasses.meta}>
```

For reusable visual variants, prefer `cva`-based `*.variants.ts` files exposing typed variant
functions (`buttonVariants`, `alertVariants`, `stackVariants` from `@/packages/ui-primitives`),
or use the primitives themselves (`Button`, `Card`, `Stack`, `PageContainer`) which carry
their own styling.

## Options

```jsonc
{ "allowedPrefixes": ["src/shared/components/primitives/", "src/packages/ui-primitives/"] }
```

Defaults shown; the repo config relies on the defaults. `*.variants.ts` / `*.styles.ts` files
are always exempt regardless of location.

## When you hit it

1. First check whether a primitive or existing variant already covers the need — browse the
   living showcase at `/<locale>/workbench` (`src/app/[locale]/(workbench)/workbench/page.tsx`, see
   [architecture/adrs/0002-component-workbench-over-storybook.md](../../architecture/adrs/0002-component-workbench-over-storybook.md)).
2. Otherwise move the classes into the module's `*-style.constants.ts` or a `*.variants.ts`
   file next to the consumer ([skills/create-component.md](../../skills/create-component.md)).
3. General procedure: [skills/fix-eslint-typecheck.md](../../skills/fix-eslint-typecheck.md).
