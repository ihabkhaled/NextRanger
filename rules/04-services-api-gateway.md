# 04 — Services, API Types, and the Gateway

Server data flows through a fixed pipeline, one direction only:

```
BFF route (src/app/api/gateway/[...path]) → gateway/ → mappers/ → services/ → queries/ → hooks/
```

## Gateway layer: the wire contract

`src/modules/<feature>/gateway/*.gateway.ts` is the only place a module performs HTTP. Rules:

- Requests go through `httpClient` from `@/packages/axios` — never raw `axios`, never `fetch`.
- URLs are built with `buildGatewayPath` over module endpoint constants (e.g. `ARTICLE_ENDPOINTS`
  in [src/modules/articles/constants/article.constants.ts](../src/modules/articles/constants/article.constants.ts)).
  String-literal endpoints are forbidden — see non-negotiable 16 in
  [00-non-negotiable-rules.md](00-non-negotiable-rules.md).
- Every response body is typed `unknown` and MUST pass a Zod parse before leaving the gateway:

  ```ts
  const response = await httpClient.get<unknown>(buildGatewayPath(ARTICLE_ENDPOINTS.list), {
    params: { page: params.page, page_size: params.pageSize },
  });

  return parseSchema(articleApiListResponseSchema, response.data, 'articles list response');
  ```

  (From [src/modules/articles/gateway/articles.gateway.ts](../src/modules/articles/gateway/articles.gateway.ts).)

- Gateways return **API types** (snake_case wire shapes declared in `api/*.api.types.ts`), never
  domain types. Mapping is the mapper's job ([08-utils-helpers-mappers.md](08-utils-helpers-mappers.md)).
- Gateways MUST NOT import React, components, hooks, stores, or query files — enforced by the
  `module-gateway` policy in [eslint/architecture.config.mjs](../eslint/architecture.config.mjs).

## Service layer: React-free use-cases

`services/*.service.ts` expresses use-cases: call the gateway, map wire to domain, apply domain
logic. **React does not exist at this layer** — no hooks, no JSX, no component imports (enforced by
the `module-services` policy). Reference:
[src/modules/articles/services/article.service.ts](../src/modules/articles/services/article.service.ts) —
`listArticles` and `createArticle` are plain async functions returning domain types, which makes
them directly callable from query files, tests, and (if ever needed) server code.

## The BFF gateway route

Client code never talks to an external API host. It calls same-origin paths under
`API_ROUTES.gatewayPrefix` (`/api/gateway`) built by `buildGatewayPath`
([src/shared/api/api-routes.constants.ts](../src/shared/api/api-routes.constants.ts)). The catch-all
route [src/app/api/gateway/[...path]/route.ts](../src/app/api/gateway/%5B...path%5D/route.ts)
delegates to [src/app/api/gateway/[...path]/gateway-handler.ts](../src/app/api/gateway/%5B...path%5D/gateway-handler.ts),
which:

- **Mock mode** (`SERVER_API_MOCKING=enabled`, the default): serves module mock fixtures such as
  [src/modules/articles/api/articles.mock.ts](../src/modules/articles/api/articles.mock.ts), so the
  app runs with zero backend. Auth's negative path is driven by the sentinel
  `AUTH_MOCK_REJECTED_PASSWORD` (`'wrong-password'`).
- **Proxy mode**: forwards to `SERVER_API_BASE_URL` read via `getServerEnv` from
  `@/packages/env/server` — never `process.env` directly
  ([17-configuration-environment.md](17-configuration-environment.md)).

This keeps API hosts, credentials, and CORS entirely server-side and gives every module a single
seam for mocking.

## Errors

`httpClient` normalizes all failures to `HttpError` (`isHttpError`, `normalizeToHttpError` in
`src/packages/axios`). Services let errors propagate; UI layers map them to translatable keys via
`mapErrorToMessageKey`
([src/shared/errors/http-error-to-message-key.mapper.ts](../src/shared/errors/http-error-to-message-key.mapper.ts)).
Never string-match on error messages. Details: [18-error-handling.md](18-error-handling.md).

How-to: [skills/create-service.md](../skills/create-service.md),
[skills/create-module.md](../skills/create-module.md).
