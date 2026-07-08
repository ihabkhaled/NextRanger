# Skill: Create a Component (TSX-only)

Create a `*.component.tsx` file that renders a pre-computed view model and nothing else. Component
files are TSX-only leaves of the tree: they contain only imports/type imports, the exported
component function, and the TSX it returns. No hooks, no logic, no local declarations, no raw copy,
no raw `className` outside the design system. All of that is enforced by the `frontend-architecture`
ESLint rules (`no-hooks-in-components`, `no-inline-component-logic`, `no-inline-declarations`,
`no-raw-i18n-text`, `no-inline-classname-outside-design-system`).

## Read first

- [rules/02-components-and-containers.md](../rules/02-components-and-containers.md)
- [rules/14-i18n-rtl.md](../rules/14-i18n-rtl.md)
- Reference: `src/modules/articles/components/article-card.component.tsx`

## Steps

1. Define the props interface in the module's `types/` file, not inline. Props MUST carry
   display-ready data only — pre-translated strings, pre-selected class names, a `testId`. See
   `ArticleCardProps` / `ArticleCardViewModel` in `src/modules/articles/types/article.types.ts`.
2. Create `src/modules/<feature>/components/<name>.component.tsx`. The whole file is one exported
   function returning `ReactElement`. The flagship example:

   ```tsx
   export function ArticleCard(props: ArticleCardProps): ReactElement {
     return (
       <Card data-testid={props.viewModel.testId}>
         <span className={props.viewModel.statusBadgeClassName}>{props.viewModel.statusLabel}</span>
         <CardTitle>{props.viewModel.title}</CardTitle>
         <CardDescription>{props.viewModel.summary}</CardDescription>
         ...
       </Card>
     );
   }
   ```

3. Compose primitives from `@/packages/ui-primitives` (`Card`, `Stack`, `Button`, ...). If you need
   a class bundle beyond primitives, define it in a `constants/<feature>-style.constants.ts` file
   (see `articleCardClasses` in `src/modules/articles/constants/article-style.constants.ts`) or a
   `*.variants.ts` file — never as a literal `className` in the JSX.
4. Copy comes in pre-translated via props. The component never calls `useAppTranslation` and never
   contains an English (or Arabic) string literal. Translation happens in the hook layer
   ([skills/create-hook.md](create-hook.md)).
5. Wire a `testId` prop (or view-model field) through to `data-testid`, sourced from
   `TEST_IDS` in `src/shared/constants/test-ids.constants.ts`. For repeated items use
   `buildIndexedTestId` from `src/shared/testing/test-id.helper.ts`.
6. Keep the markup RTL-safe: the app flips `dir` via the `ui-preferences` store, so
   - use Tailwind logical utilities (`ms-*`, `me-*`, `ps-*`, `pe-*`, `text-start`, `text-end`);
     never `ml-*`/`mr-*` or `text-left`/`text-right` in variants files,
   - use flex/grid `gap` instead of directional margins between siblings,
   - never hard-code `dir` on elements — inherit it from the root.
7. If the component only lays out children built elsewhere, accept a `children: ReactNode` slot
   like `ArticleList` in `src/modules/articles/components/article-list.component.tsx` — the
   `.map()` to child elements belongs in the container, never in the component.
8. Add a unit test in `src/modules/<feature>/test/` asserting user-visible behavior only (rendered
   text, roles, test ids) per [testing/unit-testing-standard.md](../testing/unit-testing-standard.md).

## Forbidden

- Local `const`, `let`, `var`, `type`, `interface`, `enum`, function declarations, arrow helper declarations, or config objects inside the file.
- Local declarations inside the component body.
- Hooks of any kind (`useState`, `useEffect`, `useMemo`, `useCallback`, `useId`, etc.).
- Event-handler bodies with logic, ternary chains computing labels, `.map()` / `.filter()` / `.sort()` / `.reduce()` inside JSX.
- Conditional class composition in JSX — select the class in a helper and pass it in.
- Imports from hooks, queries, services, gateways, stores, or app internals.
- Default-exporting, declaring more than the component and its imports in the file.

## Validation

```bash
npm run lint
npm run typecheck
npm run test
```

## Definition of done

- File contains only imports/type imports and one exported TSX-returning function; ESLint passes with zero warnings.
- Props, types, enums, constants, style bundles, helpers, and config all live in their owning layers and are imported.
- All copy and class names arrive via props/constants; `data-testid` is wired.
- Renders correctly under both `dir="ltr"` and `dir="rtl"` (check via `/settings` toggle).
- Unit test covers each visual state the props can express.
