# frontend-architecture/no-server-only-import-in-client

- **Source:** `eslint/architecture-plugin/rules/no-server-only-import-in-client.mjs`
- **Registered in:** `eslint/architecture.config.mjs` (severity `error`)
- **Options:** none (`schema: []`)

## What it enforces

Files marked `'use client'` MUST NOT import server-only code. Four categories are reported:

1. the `server-only` marker package itself;
2. Node.js built-ins (`node:`-prefixed or bare names from `NODE_BUILTIN_MODULES` in
   `eslint/architecture-plugin/shared/ast-utils.mjs` — `fs`, `crypto`, `path`, …);
3. the server env facade — anything resolving to `src/packages/env/server*` or any
   `*.server.*` suffixed module;
4. App Router route handlers (`src/app/**/route.ts`).

## Why

A server import in a client file either breaks the build late or — worse — succeeds and leaks
server code and secrets (`SERVER_API_BASE_URL`, `SERVER_API_MOCKING`) into the public bundle.
Next's own `server-only` marker only fails at build time and only when the marker is present;
this rule catches the whole category at lint time, at the import site, with an actionable
message. It is the structural guarantee behind the env split in
[rules/17-configuration-environment.md](../../rules/17-configuration-environment.md) and the
bundle hygiene rules in [rules/11-security.md](../../rules/11-security.md).

## Targeted files

Only files whose program body contains the `'use client'` directive. Server files may import
all of the above freely — the route handler pattern depends on it.

## Violation

From `eslint/architecture-plugin/__fixtures__/invalid/bad-client-page.tsx` (a `'use client'` file):

```ts
import { readFileSync } from 'node:fs';

import { serverEnv } from '@/packages/env/server';
```

Both imports are reported as:

`Client file imports server-only module 'node:fs'. Move the server dependency behind a route handler or a server component boundary.`

(and the same message with `'@/packages/env/server'`.)

## Compliant fix

Keep the server dependency on the server and expose it over the BFF gateway. Client code calls
same-origin gateway paths via the HTTP facade:

```ts
import { httpClient } from '@/packages/axios';
import { buildGatewayPath } from '@/shared/api/api-routes.constants';
```

The server side — `src/app/api/gateway/[...path]/route.ts` delegating to `gateway-handler.ts`
— is where `getServerEnv()` from `@/packages/env/server` is read. Client-safe values come from
`publicEnv` (`@/packages/env`), which contains only `NEXT_PUBLIC_*` variables.

## When you hit it

1. Decide where the logic truly runs. If it needs Node APIs or server env, move it into a
   route handler or a Server Component and pass results down as props/responses
   ([rules/04-services-api-gateway.md](../../rules/04-services-api-gateway.md)).
2. If you only needed configuration, switch to `publicEnv` — and if the value is genuinely
   client-safe, promote it to a `NEXT_PUBLIC_*` variable in `.env.example` and the env schema.
3. General procedure: [skills/fix-eslint-typecheck.md](../../skills/fix-eslint-typecheck.md);
   this rule is security-relevant, so exceptions additionally need review per
   [docs/sdlc/security-baseline.md](../sdlc/security-baseline.md).
