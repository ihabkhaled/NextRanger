# Skill: Write Integration Tests

Integration tests render a container with real providers and a mocked network, then assert
what the user sees. They live in `src/tests/integration/` and run under Vitest/jsdom like
unit tests. Standard:
[testing/integration-testing-standard.md](../testing/integration-testing-standard.md).

## The harness

- **`renderWithProviders`** (`src/tests/helpers/render-with-providers.tsx`) wraps the
  subject in the same provider stack the app uses — `AppQueryProvider` (fresh query client
  per test) and `AppIntlProvider` with the real English catalog — so assertions run against
  real translated copy and real query caching.
- **MSW node server** (`src/tests/msw/server.ts`) is started/reset/closed by
  `src/tests/setup/vitest.setup.ts`. Default handlers live in `src/tests/msw/handlers/` and
  mirror the BFF gateway paths that `httpClient` + `buildGatewayPath` produce
  (`src/shared/api/api-routes.constants.ts`).

## Steps

1. **Create the spec** at `src/tests/integration/<feature>.integration.test.tsx`. The
   subject is a container from a module's public surface (e.g. `ArticlesListContainer`
   from `@/modules/articles`) — never a bare component with hand-fed props (that proves
   nothing about wiring).
2. **Arrange the network with MSW.** Use the default happy-path handlers; override per
   test with `server.use(...)` for error/empty variants:

   ```ts
   server.use(
     http.get(buildGatewayPath(ARTICLE_ENDPOINTS.list), () =>
       HttpResponse.json({ message: 'boom' }, { status: 500 }),
     ),
   );
   ```

   Never mock module services or hooks — the point is exercising
   gateway → service → mapper → query → hook → container as one path.

3. **Assert the loading → ready transition.** Containers like
   `src/modules/articles/containers/articles-list.container.tsx` switch across
   loading/error/empty/ready states. Assert the sequence, not just the end state:

   ```ts
   renderWithProviders(<ArticlesListContainer />);

   expect(screen.getByTestId(TEST_IDS.articlesLoading)).toBeInTheDocument();
   expect(await screen.findByTestId(TEST_IDS.articlesList)).toBeInTheDocument();
   ```

   Use `findBy*` (not manual `waitFor` + `getBy*`) for the async settle. Selectors are
   `TEST_IDS` constants and accessible queries (`getByRole`, `getByLabelText`) — never CSS
   classes.

4. **Interact with `@testing-library/user-event`,** not `fireEvent`: `await user.click(...)`,
   `await user.type(...)`. For forms, follow the login reference: submit empty and assert
   the translated validation copy from `en.json` appears in the `role="alert"` error region;
   type the sentinel `AUTH_MOCK_REJECTED_PASSWORD` ('wrong-password') with the matching MSW
   handler returning 401 and assert `TEST_IDS.loginError` shows the generic error
   ([skills/add-form.md](add-form.md)).
5. **Assert user-visible outcomes only:** rendered copy, testid presence, disabled states,
   toast text. Never assert hook internals, query cache contents, or store state directly —
   if an outcome matters, it is visible.
6. **Cover the four states** for every list/detail container: loading, error (with retry
   working — click retry, override the handler back to success, assert ready), empty, ready.
7. **Run** `npm run test`; these specs count toward the 95% coverage gate in
   `vitest.config.mts`. Playwright-only directories (`src/tests/e2e`, `accessibility`,
   `visual`) are excluded from Vitest — keep integration specs out of those folders.

## Definition of done

- Container rendered via `renderWithProviders`; network shaped only by MSW handlers.
- Loading → ready (and error → retry → ready) transitions asserted with `TEST_IDS` and
  real translated copy; interactions via `user-event`.
