# Security Decisions

Rationale for the security posture. The normative rules live in
[rules/11-security.md](../rules/11-security.md) and the baseline in
[docs/sdlc/security-baseline.md](../docs/sdlc/security-baseline.md).

## Nonce CSP over static `unsafe-inline`

- **Decision:** per-request nonce Content-Security-Policy generated in `src/proxy.ts`
  (`script-src 'self' 'nonce-…' 'strict-dynamic'`), the Next 16 proxy convention. Static headers
  that do not need per-request values (nosniff, `X-Frame-Options: DENY`, referrer-policy,
  permissions-policy, COOP, HSTS) stay in `next.config.ts`.
- **Rejected alternative:** a static CSP with `'unsafe-inline'` (or hash lists) set in
  `next.config.ts`.
- **Why:** `'unsafe-inline'` neutralizes CSP's XSS protection — any injected inline script runs.
  Hash-based CSP breaks on every framework runtime change. A fresh nonce per request plus
  `'strict-dynamic'` lets Next's own bootstrap scripts load while blocking injected ones, at the
  cost of running the proxy on every request — a cost we accept. The nonce MUST never be made
  predictable or cached across requests.

## Cookie sessions over localStorage tokens

- **Decision:** authentication is cookie-session based. `useAuthStore`
  (`src/modules/auth/store/`) holds only a token-free session snapshot (who is logged in), never
  credentials or tokens. No token ever transits through client-readable storage.
- **Rejected alternative:** JWT in `localStorage`/`sessionStorage` with an Authorization header.
- **Why:** anything in web storage is readable by any XSS payload; HttpOnly cookies are not.
  Because all client traffic goes to the same-origin BFF (below), cookies flow automatically and
  no client code needs token plumbing. This is the "cookie-session doctrine": if a change
  requires the client to see a token, the design is wrong.

## BFF gateway over direct API calls

- **Decision:** the client only ever calls same-origin paths built by `buildGatewayPath`
  (`src/shared/api/api-routes.constants.ts`) through `httpClient`; the route handler at
  `src/app/api/gateway/[...path]/` delegates to `gateway-handler.ts`, which either serves module
  mock fixtures (`SERVER_API_MOCKING=enabled`, the default) or proxies to `SERVER_API_BASE_URL`.
- **Rejected alternative:** browser calls straight to the backend origin.
- **Why:** one egress point means CORS never exists, the real backend origin and server env vars
  (`SERVER_API_BASE_URL`, guarded by `server-only` in `src/packages/env/server`) never reach the
  browser, headers/auth can be attached server-side, and the whole app runs with zero backend for
  local dev and e2e. Error bodies are sanitized at this boundary — clients receive message keys
  (`ERROR_MESSAGE_KEYS`), never raw upstream errors.

## The postcss override — transitive vulnerability playbook

- **Decision:** the transitive postcss vulnerability was fixed with an npm override pinned to the
  same spec as the direct devDependency: `"overrides": { "postcss": "^8.5.16" }` in
  `package.json`, plus a lockfile regeneration.
- **Rejected alternatives:** waiting for upstreams to bump, or suppressing the audit finding.
- **Why:** this is the canonical example of the zero-unhandled-vulnerability policy: fix the tree,
  don't silence the scanner. The override spec MUST match the direct dependency exactly (see
  [known-pitfalls.md](./known-pitfalls.md)) and MUST be removed once all dependents require the
  patched version on their own. Every override carries a comment trail in `package.json` and an
  entry here.

## Trivy severity floor: LOW

- **Decision:** `npm run security:scan` runs Trivy with
  `--severity LOW,MEDIUM,HIGH,CRITICAL --exit-code 1` across vuln, secret, and misconfig
  scanners, including dev dependencies; `npm run security:audit` runs `npm audit
--audit-level=low`. Both gate `npm run validate` and CI (`.github/workflows/security.yml`).
- **Rejected alternative:** the common HIGH/CRITICAL-only floor.
- **Why:** severity scores describe the vulnerability in isolation, not our exposure — LOW
  findings routinely chain, and a floor of LOW keeps the backlog at zero instead of letting a
  tolerated pile accumulate. The escape valve is explicit: a finding we accept gets a documented
  exception in [docs/exceptions/](../docs/exceptions/README.md), never a raised floor. Trivy also
  owns secret scanning outright — which is why `sonarjs/no-hardcoded-passwords` is off in
  `eslint/sonar.config.mjs`.

## Standing invariants

- No `dangerouslySetInnerHTML` anywhere in the codebase.
- `poweredByHeader: false` in `next.config.ts`.
- External URLs render only through `ExternalLink` after `isSafeExternalUrl`
  (`src/shared/security/external-url.helper.ts`).
