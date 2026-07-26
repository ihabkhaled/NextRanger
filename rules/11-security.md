# Rule 11 — Security

Security is enforced by code owned inside the repository, not by convention. Every control below
maps to a real file. Violations block merge via [rules/19-release-gates.md](../rules/19-release-gates.md).

## Content Security Policy: per-request nonce in `src/proxy.ts`

- The CSP MUST come from [src/proxy.ts](../src/proxy.ts) (Next 16 proxy convention). It generates a
  fresh nonce per request and sets `script-src 'self' 'nonce-…' 'strict-dynamic'` in production
  (`'unsafe-eval'` is added only when `NODE_ENV !== 'production'`, for Turbopack dev).
- Never move the CSP into `next.config.ts` as a static header — a static CSP cannot carry a nonce.
- Never add a host, `'unsafe-inline'`, or `'unsafe-eval'` to the production `script-src`. Any CSP
  change requires a security review ([skills/security-review.md](../skills/security-review.md)).

## Static security headers: `next.config.ts`

All non-CSP headers are static and live in [next.config.ts](../next.config.ts): `X-Content-Type-Options: nosniff`,
`X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy`
(camera/microphone/geolocation denied), `Cross-Origin-Opener-Policy: same-origin`, and HSTS with
`includeSubDomains; preload`. `poweredByHeader` MUST stay `false`. Removing or weakening any of
these requires a documented exception in [docs/exceptions/](../docs/exceptions/README.md).

## Environment split and `server-only`

- Client-safe values are read only through `publicEnv` ([src/packages/env/public-env.ts](../src/packages/env/public-env.ts)).
  `NEXT_PUBLIC_*` values MUST never contain secrets.
- Server secrets are read only through `getServerEnv()` from `@/packages/env/server`
  ([src/packages/env/server.ts](../src/packages/env/server.ts)), which imports the `server-only`
  marker so any accidental client import fails at build time.
- Raw `process.env` access anywhere else is banned by the
  [no-process-env-outside-config](../docs/eslint/no-process-env-outside-config.md) rule.
  See [rules/17-configuration-environment.md](../rules/17-configuration-environment.md).

## Cookie-session doctrine: token-free client

- Auth tokens MUST never be stored in `localStorage`, `sessionStorage`, Zustand, or React state.
  Sessions are cookie-based; the client holds only a non-sensitive session snapshot
  (`useAuthStore` in [src/modules/auth](../src/modules/auth) stores user identity, never a token).
- Client code only calls the same-origin BFF gateway (`/api/gateway/[...path]`) via `httpClient` +
  `buildGatewayPath` — upstream URLs and credentials stay on the server.

## Output and link safety

- `dangerouslySetInnerHTML` is banned everywhere. There are zero occurrences in `src/` and none may
  be introduced without an exception document.
- External links MUST use `ExternalLink` from [src/packages/link](../src/packages/link/index.ts),
  which applies safe `rel` attributes. URL values from data MUST be checked with
  `isSafeExternalUrl` ([src/shared/security/external-url.helper.ts](../src/shared/security/external-url.helper.ts)),
  which allows only `https:` and `mailto:` — `javascript:`, `data:`, and plain `http:` are rejected.

## Storage is schema-validated

Web storage is only reachable through the facade in [src/packages/storage](../src/packages/storage/web-storage.ts).
`readStorageJson` validates every value against a Zod schema and returns `null` for anything
malformed — persisted data is untrusted input and MUST never flow into the app unvalidated.

## Error sanitization

Raw vendor or backend error text MUST never reach the user. All failures resolve to a translatable
key from `ERROR_MESSAGE_KEYS` via `mapErrorToMessageKey`
([src/shared/errors/http-error-to-message-key.mapper.ts](../src/shared/errors/http-error-to-message-key.mapper.ts)).
Full chain: [rules/18-error-handling.md](../rules/18-error-handling.md).

## Dependency and scan policy: zero unhandled findings

- `npm run security:audit` (`npm audit --omit=dev --audit-level=low`) owns the deployable runtime
  graph. `npm run security:scan` owns runtime and development dependencies through Trivy's lockfile
  scan (`--include-dev-deps`) plus secret/misconfiguration scanning. Both use every severity and
  MUST pass with zero unhandled findings. They run in `.github/workflows/security.yml`.
- Transitive vulnerabilities are fixed with an `overrides` entry in [package.json](../package.json)
  — the current scoped overrides are reference examples. Suppressing a finding instead of
  fixing it requires an exception per [docs/exceptions/exception-template.md](../docs/exceptions/exception-template.md).

Decisions log: [memory/security-decisions.md](../memory/security-decisions.md).
Baseline policy: [docs/sdlc/security-baseline.md](../docs/sdlc/security-baseline.md).
Reviewer agent: [agents/frontend-security-reviewer.md](../agents/frontend-security-reviewer.md).
