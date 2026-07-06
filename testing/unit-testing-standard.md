# Unit Testing Standard

Unit tests run on Vitest 4 in jsdom (`vitest.config.mts`, `environment: 'jsdom'`,
`globals: false` — always import `describe`, `it`, `expect` from `vitest` explicitly).

## Location and naming

- Module unit tests live in the module's `test/` directory:
  `src/modules/<feature>/test/`. Never colocate `.test.ts` files next to source inside other
  layer directories.
- The test file name mirrors the source file name with a `.test` suffix:

  | Source                                                 | Test                                                        |
  | ------------------------------------------------------ | ----------------------------------------------------------- |
  | `src/modules/articles/mappers/article.mapper.ts`       | `src/modules/articles/test/article.mapper.test.ts`          |
  | `src/modules/articles/utils/article.utils.ts`          | `src/modules/articles/test/article.utils.test.ts`           |
  | `src/modules/articles/queries/article-query-keys.ts`   | `src/modules/articles/test/article-query-keys.test.ts`      |
  | `src/modules/articles/hooks/use-articles-list.hook.ts` | `src/modules/articles/test/use-articles-list.hook.test.tsx` |

- Tests for `src/shared` and `src/packages` follow the same mirror-name rule; cross-module
  suites live under `src/tests/unit/`.
- Vitest picks up `src/**/*.test.{ts,tsx}` and excludes the Playwright directories
  (`src/tests/e2e`, `src/tests/accessibility`, `src/tests/visual`).

## Structure

- One top-level `describe` per exported function or hook, named after the export
  (`describe('mapArticleListResponse', …)`).
- `it` sentences state observable behavior, not implementation:
  `it('sinks unpublished articles to the end while preserving relative order')` — this is the
  contract documented in `src/modules/articles/utils/article.utils.ts`.
- Table-driven tests are the default for pure logic with multiple input classes. Use
  `it.each` with a typed case array:

  ```ts
  const cases: readonly { name: string; input: string; expected: string }[] = [
    { name: 'strips a leading slash', input: '/articles', expected: '/api/gateway/articles' },
    { name: 'accepts a bare path', input: 'articles', expected: '/api/gateway/articles' },
  ];

  it.each(cases)('$name', ({ input, expected }) => {
    expect(buildGatewayPath(input)).toBe(expected);
  });
  ```

  (Contract from `src/shared/api/api-routes.constants.ts` — both branches of the
  `startsWith('/')` conditional are cases in the table.)

## Pure logic: 100% branches, no exceptions

Files under `utils/`, `helpers/`, `mappers/`, `schemas/`, and query-key builder files
(`queries/*query-keys*.ts`) carry a 100% threshold for lines, statements, functions, and
branches ([coverage-policy.md](coverage-policy.md)). In practice:

- `article.mapper.test.ts` proves the snake_case → camelCase contract
  (`published_at` → `publishedAt`, `reading_time_minutes` → `readingTimeMinutes`,
  `total_count` → `totalCount`) and the empty-list case of `mapArticleListResponse`.
- `article.utils.test.ts` covers all four comparator branches of `sortArticlesByNewest`:
  both `publishedAt` null, only first null, only second null, both dates present — plus
  input immutability (`toSorted` returns a new array).
- `article-query-keys.test.ts` locks the key hierarchy: `articleQueryKeys.list(params)`
  extends `articleQueryKeys.lists()`, which extends `articleQueryKeys.root`. If this suite
  breaks, cache invalidation in `src/modules/articles/queries/article.invalidate.ts` breaks.

## Rules

- Unit tests MUST NOT render providers, hit MSW, or touch `window` beyond what jsdom gives
  every test. Hook tests use `renderHook` with the narrowest wrapper the hook needs; a hook
  that needs the query client + network (like `useArticlesList`) gets its full behavior proven
  at the integration layer instead.
- Never mock the module under test's own internals. Mock only at owned boundaries
  (`src/packages/*` facades) and only when the real implementation cannot run in jsdom.
- Test data comes from `src/tests/factories` — see
  [test-data-and-fixtures.md](test-data-and-fixtures.md). No inline magic objects.
- No `.only`, no unexplained `.skip` (see [testing/README.md](README.md)).
- Run: `npm run test` (single pass), `npm run test:watch` (TDD loop),
  `npm run test:coverage` (with thresholds enforced).
