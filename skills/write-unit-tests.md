# Skill: Write Unit Tests

Unit tests cover a single file's contract in isolation with Vitest (jsdom environment,
`globals: false` — always import `describe/it/expect` from `vitest`). Standard:
[testing/unit-testing-standard.md](../testing/unit-testing-standard.md); policy:
[rules/15-testing-and-coverage.md](../rules/15-testing-and-coverage.md).

## What MUST be unit tested

- **Pure logic at 100% coverage** — `vitest.config.mts` enforces 100%
  lines/statements/functions/branches for `src/**/{utils,helpers,mappers,schemas}/**/*.ts`
  and `src/**/queries/*query-keys*.ts`. That means: mappers
  (`src/modules/articles/mappers/article.mapper.ts`), display helpers
  (`src/modules/articles/helpers/article-display.helper.ts`), utils
  (`src/modules/articles/utils/article.utils.ts`), Zod schemas
  (`src/modules/auth/schemas/auth.schema.ts`), and query-key builders
  (`src/modules/articles/queries/article-query-keys.ts`).
- **Services and gateways** (React-free): request shaping, response validation, error
  normalization to `HttpError`/`AppError`.
- **Package wrapper logic** under `src/packages/**` (inside the 95% global gate).
- Shared helpers like `buildPageTitle`, `buildIndexedTestId`, `isSafeExternalUrl`,
  `mapErrorToMessageKey`.

Do NOT unit-test TSX-only `*.component.tsx` files for internals — component behavior is
asserted user-visibly at the integration level
([skills/write-integration-tests.md](write-integration-tests.md)).

## Steps

1. **Locate the test file.** Module unit tests live in `src/modules/<feature>/test/`,
   named after the subject: `article.mapper.test.ts`. Shared/package tests follow the same
   `*.test.ts` convention (Vitest `include` is `src/**/*.test.{ts,tsx}`).
2. **Setup is global.** `src/tests/setup/vitest.setup.ts` already loads jest-dom, starts
   the MSW node server, and mocks `server-only` — do not repeat this per file.
3. **Test the contract, not the implementation.** One `describe` per export. Example
   contract for `mapArticleApiItem`: snake_case wire fields (`published_at`,
   `reading_time_minutes`) map to camelCase domain fields — assert the full output object.
4. **Prefer table-driven cases** for pure functions and schemas:

   ```ts
   it.each([
     { password: '', expectedKey: AUTH_VALIDATION_MESSAGE_KEYS.passwordRequired },
     { password: 'short', expectedKey: AUTH_VALIDATION_MESSAGE_KEYS.passwordTooShort },
   ])('rejects "$password" with $expectedKey', ({ password, expectedKey }) => {
     const result = loginFormSchema.safeParse({ email: 'a@b.co', password });

     expect(result.success).toBe(false);
   });
   ```

   Schemas that embed i18n keys are asserted against the `*_MESSAGE_KEYS` constants, never
   against literal key strings.

5. **Cover every branch.** 100% branch coverage on pure logic means: empty input, boundary
   values (e.g. `PASSWORD_MIN_LENGTH` exactly), each enum member (use `assertNever`-guarded
   switches to make this mechanical), and error paths.
6. **Use factories, not inline fixtures,** for domain objects — see
   [testing/test-data-and-fixtures.md](../testing/test-data-and-fixtures.md) and the
   factories under `src/tests/factories/`.
7. **Run the gates.** `npm run test` while iterating, `npm run test:coverage` before
   pushing — the thresholds (95% global, 100% pure-logic) fail the build, and
   `.husky/pre-push` runs typecheck + tests. No `.only`, no skipped tests without a
   documented exception in [docs/exceptions/](../docs/exceptions/README.md).

## Definition of done

- Every exported pure function has table-driven cases covering all branches.
- `npm run test:coverage` passes both threshold tiers; no `.only`/`.skip` left behind.
