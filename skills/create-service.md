# Skill: Create a Service

Create a React-free use-case function in a module's `services/` layer. A service composes the
module's gateway (HTTP contract) with its mapper (wire → domain) and returns domain types. React,
hooks, JSX, and browser APIs do not exist at this layer — services must run identically in a route
handler, a query function, or a plain Vitest test.

## Read first

- [rules/04-services-api-gateway.md](../rules/04-services-api-gateway.md)
- [rules/08-utils-helpers-mappers.md](../rules/08-utils-helpers-mappers.md)
- Reference: `src/modules/articles/services/article.service.ts`

## Steps

1. Make sure the layers below exist first:
   - `api/<feature>.api.types.ts` — wire types in snake_case.
   - `schemas/<feature>.schema.ts` — Zod schemas (via `@/packages/zod`) validating the wire shape.
   - `gateway/<feature>.gateway.ts` — functions that call `httpClient` from `@/packages/axios`
     against `buildGatewayPath(...)` (`src/shared/api/api-routes.constants.ts`) and return
     `parseSchema`-validated API types, like `fetchArticleListFromGateway` in
     `src/modules/articles/gateway/articles.gateway.ts`. Endpoint suffixes live in
     `constants/<feature>.constants.ts` (see `ARTICLE_ENDPOINTS`).
   - `mappers/<feature>.mapper.ts` — pure wire → domain conversion; nothing above the service
     ever sees snake_case (see `mapArticleApiItem` in `src/modules/articles/mappers/article.mapper.ts`).
2. Create `src/modules/<feature>/services/<feature>.service.ts` with one exported async function
   per use-case, named as a verb phrase. The whole flagship service:

   ```ts
   /** Use-case: list articles. React does not exist at this layer. */
   export async function listArticles(params: ArticleListParams): Promise<ArticleListResult> {
     const response = await fetchArticleListFromGateway(params);

     return mapArticleListResponse(response);
   }
   ```

3. Accept and return domain types from `types/<feature>.types.ts` only. If the caller needs a
   different input shape (like `CreateArticleInput`), the service translates it into the wire
   request explicitly, as `createArticle` does before calling `postArticleToGateway`.
4. Let errors propagate. The gateway's `httpClient` normalizes failures to `HttpError`
   (`@/packages/axios`), and `parseSchema` throws `SchemaParseError` on contract drift; upper
   layers map them to message keys via `mapErrorToMessageKey`
   (`src/shared/errors/http-error-to-message-key.mapper.ts`). Never `try/catch`-and-swallow here.
5. Write unit tests in `src/modules/<feature>/test/` with the gateway mocked:

   ```ts
   vi.mock('../gateway/articles.gateway');
   ```

   Assert that the service calls the gateway with the right arguments, maps the response through
   the mapper (snake_case in, camelCase out), and rethrows gateway failures untouched. Mapper and
   schema files get their own direct tests — they sit in the 100%-coverage bucket of
   `vitest.config.mts` ([testing/coverage-policy.md](../testing/coverage-policy.md)).

## Forbidden

- Importing React, anything from `hooks/`, `components/`, `containers/`, or `@/packages/query`.
- Calling `axios` (or `fetch`) directly, hard-coding URLs, or skipping `buildGatewayPath` — the
  browser only ever talks to the same-origin BFF gateway.
- Returning unmapped wire types upward, or mapping inside the gateway (mapping is the service's
  composition of the mapper).
- Reading `process.env` — server config comes from `getServerEnv` in `@/packages/env/server`,
  and only in server-side code.

## Validation

```bash
npm run lint
npm run typecheck
npm run test
npm run quality:circular   # services must not create layer cycles
```

## Definition of done

- Service exports pure async use-cases: gateway in, mapper out, domain types only.
- No React/browser imports anywhere in `services/`, `gateway/`, or `mappers/`.
- Unit tests cover success and failure paths with the gateway mocked; mappers/schemas at 100%.
- Gateway mock fixtures exist in `api/<feature>.mock.ts` so `SERVER_API_MOCKING=enabled` serves
  the new endpoints (wired per [skills/create-module.md](create-module.md), step 7).
