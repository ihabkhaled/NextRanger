# Test Data and Fixtures

Test data in this repository has exactly three sources. Anything else — an object literal typed
inline in a spec, a hardcoded id, a copy-pasted response body — is a violation.

## 1. Factories: `src/tests/factories`

Factories build **domain-shaped** objects (post-mapper, camelCase) for unit and integration
tests. One factory file per domain type, exporting a `build*` function that returns a valid
default and accepts a partial override:

```ts
const article = buildArticle({ publishedAt: null, status: ArticleStatus.Draft });
```

Rules:

- Defaults are always valid against the module's Zod schema
  (e.g. `src/modules/articles/schemas/article.schema.ts`). A factory that emits invalid data
  by default poisons every consumer.
- Overrides express only what the test cares about. A test that overrides five fields to set up
  one assertion is testing at the wrong layer.
- Factories never generate random data (no faker-style randomness) — a failing test MUST
  reproduce identically on re-run. Distinct ids come from explicit suffixes, using
  `buildIndexedTestId` (`src/shared/testing/test-id.helper.ts`) when the id feeds a testid.
- Wire-shaped (snake_case) builders exist only for mapper tests and MSW handlers; they mirror
  the `*.api.types.ts` contracts (e.g. `src/modules/articles/api/articles.api.types.ts`).

## 2. Module mock fixtures: the gateway's data

Each feature module owns its demo backend data in `api/*.mock.ts` —
`src/modules/articles/api/articles.mock.ts` exports `getArticlesListMockResponse` and
`createArticleMockResponse`. These fixtures are served by the BFF gateway
(`/api/gateway/[...path]`) when `SERVER_API_MOCKING=enabled`, which is how Playwright suites get
their data ([e2e-testing-standard.md](e2e-testing-standard.md)).

- E2e, a11y, and visual assertions reference this fixture content (five articles, ids
  `a-1001`–`a-1005`, one Draft with `published_at: null`, one Archived). Change the fixture and
  the specs that depend on it fail in one obvious place — that coupling is intentional.
- Fixture content is **data, not UI copy** — it is exempt from `no-raw-i18n-text` (stated in
  the fixture file header). Do not translate fixtures.
- Fixtures stay deterministic: fixed ISO dates, stable ordering. `createArticleMockResponse`'s
  `Date.now()`-based id exists for the create flow only; specs assert on the echoed title, not
  the generated id.

## 3. MSW handlers: the API truth for jsdom tests

`src/tests/msw/handlers/` defines the default network behavior for unit/integration runs, wired
through `src/tests/msw/server.ts` and the lifecycle in `src/tests/setup/vitest.setup.ts`
([integration-testing-standard.md](integration-testing-standard.md)).

- Handlers intercept the same-origin gateway paths produced by `buildGatewayPath`
  (`src/shared/api/api-routes.constants.ts`) and respond with the **module mock fixtures** —
  the same data the real mocked gateway serves. jsdom tests and Playwright tests therefore see
  one consistent world.
- Handler responses are wire-shaped (`snake_case`), matching `*.api.types.ts`. If a handler
  returns camelCase, it silently bypasses the mapper layer and the test proves nothing.
- Per-test deviations (errors, empty lists, delays) are `server.use(...)` overrides in the
  spec, never edits to the default handlers.
- MSW is test-only: `src/tests/msw` is the sole owner of the `msw` package. Runtime mocking is
  the gateway's job, controlled by `SERVER_API_MOCKING`.

## No inline magic data

- No literal ids, emails, dates, or response bodies typed directly into specs. Named constants
  from factories/fixtures document _why_ a value matters — `AUTH_MOCK_REJECTED_PASSWORD`
  (`'wrong-password'`, in `src/modules/auth`) reads as a negative-path sentinel; an inline
  `'wrong-password'` string reads as noise and drifts.
- Testids come from `TEST_IDS` (`src/shared/constants/test-ids.constants.ts`); routes from
  `ROUTE_PATHS`; storage keys from `STORAGE_KEYS`.
- Expected translated copy in integration tests is read against the real catalogs in
  `src/packages/i18n/messages/` — never re-typed by hand.
