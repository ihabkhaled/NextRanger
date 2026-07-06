# Rule 17 — Configuration and Environment

Environment variables are configuration inputs with a typed, validated contract — never ambient
strings scattered through the code.

## The two facades

- **Client-safe:** `publicEnv` from [src/packages/env](../src/packages/env/index.ts), defined in
  [src/packages/env/public-env.ts](../src/packages/env/public-env.ts). Zod-validated with local
  defaults (`NEXT_PUBLIC_APP_ENV` defaults to `local`, `NEXT_PUBLIC_APP_URL` to
  `http://localhost:3000`). Exposes camelCase fields (`publicEnv.appEnv`, `publicEnv.appUrl`).
- **Server-only:** `getServerEnv()` from `@/packages/env/server`
  ([src/packages/env/server.ts](../src/packages/env/server.ts)). Imports the `server-only` marker,
  so a client import is a build-time error. Validates `SERVER_API_BASE_URL` and
  `SERVER_API_MOCKING`, caches the parsed result.
- Raw `process.env` reads anywhere outside these facades are banned by
  [no-process-env-outside-config](../docs/eslint/no-process-env-outside-config.md). Derived app
  configuration lives in [src/shared/config/app-config.ts](../src/shared/config/app-config.ts)
  (`appConfig`), which consumes the facades.

## Why the public/private split is structural

`NEXT_PUBLIC_*` values are inlined into the client bundle at build time — they are public by
definition and MUST never hold secrets. Everything else exists only in the server process. The
split is enforced three ways: naming (`NEXT_PUBLIC_` prefix vs `SERVER_` prefix), the `server-only`
marker, and the [no-server-only-import-in-client](../docs/eslint/no-server-only-import-in-client.md)
lint rule. Note the comment in `public-env.ts`: public values MUST be read with static dot-access
(`process.env.NEXT_PUBLIC_APP_URL`), never dynamic keys, or Next.js cannot inline them.

## The `.env.example` contract

[.env.example](../.env.example) is the canonical list of every variable the app reads, grouped into
a public block and a server-only block, each with a comment explaining non-obvious values. A
variable that is not in `.env.example` does not exist. `.env*` files are gitignored;
`.env.example` is the only committed env file.

## `SERVER_API_MOCKING`

- Default `enabled`: the BFF gateway (`/api/gateway/[...path]`) serves module mock fixtures (e.g.
  [src/modules/articles/api/articles.mock.ts](../src/modules/articles/api/articles.mock.ts)) so the
  app runs with zero backend.
- Set `disabled` to proxy to `SERVER_API_BASE_URL` instead. Client code never knows the difference
  — it only ever calls same-origin gateway paths via `httpClient` + `buildGatewayPath`
  ([src/shared/api/api-routes.constants.ts](../src/shared/api/api-routes.constants.ts)).

## Adding a variable — the required steps

1. **Schema:** add the field to `publicEnvSchema` in `public-env.ts` or `serverEnvSchema` in
   `server.ts`, with a Zod type and a sensible local default (or make it required and let startup
   fail loudly).
2. **Types:** extend the `ProcessEnv` declaration in
   [src/packages/env/env.d.ts](../src/packages/env/env.d.ts) so `process.env.<NAME>` is typed at
   the single place it is read.
3. **Expose it:** add a camelCase field to the `PublicEnv` / `ServerEnv` interface and the exported
   object — consumers use the parsed field, never the raw name.
4. **Document:** add the variable with a comment to [.env.example](../.env.example).
5. **Docs:** if the variable changes behavior (like `SERVER_API_MOCKING`), update this rule and any
   affected runbook under [runbooks/](../runbooks/README.md).

Never skip step 1 — an unvalidated variable is a runtime typo waiting for production.

## Non-env configuration

Build-time configuration lives in [next.config.ts](../next.config.ts) (headers, typedRoutes,
image hosts) and MUST NOT read server env directly; feature constants live in module `constants/`
layers, shared ones in [src/shared/constants](../src/shared/constants). See
[rules/07-types-enums-constants.md](../rules/07-types-enums-constants.md).
