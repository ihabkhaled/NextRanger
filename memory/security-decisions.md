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

## Scoped overrides — transitive vulnerability playbook

- **Decision:** patched transitive releases are selected with narrow npm overrides and a lockfile
  regeneration. Current pins cover `postcss`, `brace-expansion` 5.0.8, `fast-uri` 3, and Next's
  optional `sharp` image dependency. The `brace-expansion` security fix has no patched 1.x
  release, so the override deliberately lifts legacy `minimatch` consumers to 5.0.8. Because
  5.x changed its CommonJS and ESM export shapes, the fail-closed `postinstall` step restores
  the callable function while preserving the named exports; EXC-0005 documents its confined path
  traversal. Remove the override and compatibility step when the owner ranges catch up.
- **Rejected alternatives:** waiting for upstreams to bump, or suppressing the audit finding.
- **Why:** this is the zero-unhandled-vulnerability policy: fix the resolved tree, do not silence
  the scanner. Direct dependency overrides MUST match their declared spec; transitive overrides
  stay on the narrowest patched line that passes the full lint, test, build, and security gates.
  Every override has an entry here.

## Trivy severity floor: LOW

- **Decision:** Trivy 0.71.0 is pinned in `.trivy-version` and the Security workflow.
  `npm run security:scan` runs it with
  `--severity LOW,MEDIUM,HIGH,CRITICAL --exit-code 1` across vuln, secret, and misconfig
  scanners, including dev dependencies; `npm run security:audit` runs
  `npm audit --omit=dev --audit-level=low` for the deployable graph. Trivy owns the full lockfile,
  including dev tooling, because npm audit can continue attributing a parent advisory after its
  vulnerable transitive child has been overridden to the patched release. Both gate
  `npm run validate` and CI (`.github/workflows/security.yml`).
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
