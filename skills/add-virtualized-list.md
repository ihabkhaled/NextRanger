# Skill: Add a Virtualized List

Use this skill when a list can realistically exceed ~100 rows. Below that, a plain container
`.map()` over a slot component (the `ArticleList` pattern in
`src/modules/articles/components/article-list.component.tsx`) is correct and simpler. Above
it, an unbounded DOM is a performance defect —
[rules/12-performance.md](../rules/12-performance.md).

## The wrapper

`react-virtuoso` is owned by `src/packages/virtuoso/` (boundary registered in
`eslint/package-boundaries.config.mjs`). The only public surface is `VirtualizedList`:

```tsx
export interface VirtualizedListProps<TItem> {
  readonly items: readonly TItem[];
  readonly heightPx: number;
  readonly computeItemKey: (item: TItem, index: number) => string;
  readonly renderItem: (item: TItem, index: number) => ReactElement;
  readonly testId?: string;
}
```

(`src/packages/virtuoso/virtualized-list.tsx`). Raw `react-virtuoso` imports anywhere else
fail `npm run lint`.

## Steps

1. **Confirm the threshold.** If the dataset is paginated to well under 100 rows per page,
   do not virtualize — record the decision in the feature's
   [docs/features/_template/09-performance-review.md](../docs/features/_template/09-performance-review.md)
   stage doc instead.
2. **Build view models in the hook, not in `renderItem`.** Follow
   `src/modules/articles/hooks/use-articles-list.hook.ts`: the hook maps domain items to
   fully-translated card view models once (memoized); `renderItem` only hands a prebuilt
   view model to a TSX-only component.
3. **Render from the container.** `VirtualizedList` is a client component
   (`'use client'` with a documented boundary reason), so it is composed inside a module
   container, never inside a `*.component.tsx` file and never directly in `page.tsx`.
4. **`computeItemKey` MUST return a stable domain id** — `(item) => item.id` — never the
   index. Index keys break row identity when the list reorders or refetches.
5. **Set an explicit `heightPx`.** Virtuoso needs a bounded viewport to know what to render.
   The value is a named constant in the module's `constants/` file (a magic number inline
   violates `no-inline-declarations`). Coordinate the surrounding layout with `Stack` /
   `PageContainer` from `@/packages/ui-primitives`.
6. **Give the list a `testId`** from `TEST_IDS`
   (`src/shared/constants/test-ids.constants.ts`), and derive per-row testids with
   `buildIndexedTestId` from `src/shared/testing/test-id.helper.ts`
   (e.g. `buildIndexedTestId(TEST_IDS.articleCard, article.id)`).
7. **Test it.**
   - Unit-test the key/view-model helpers to 100% (pure logic —
     [skills/write-unit-tests.md](write-unit-tests.md)).
   - Integration tests (jsdom) cannot measure a real viewport: assert that the list
     container renders and that the FIRST rows' content appears; do not assert total row
     counts. See [skills/write-integration-tests.md](write-integration-tests.md).
   - Scrolling behavior belongs to Playwright: an e2e spec scrolls the list and asserts a
     far row becomes visible ([skills/write-e2e-tests.md](write-e2e-tests.md)).

## Definition of done

- `VirtualizedList` used via `@/packages/virtuoso`, stable `computeItemKey`, constant
  height, testids from `TEST_IDS`.
- Row mapping lives in the hook; components stay TSX-only. `npm run quality` green.
