# Security Baseline

Process-level security policy. The technical rules live in [rules/11-security.md](../../rules/11-security.md); recorded decisions live in [memory/security-decisions.md](../../memory/security-decisions.md). Every feature completes [docs/features/_template/08-security-review.md](../features/_template/08-security-review.md) before release.

## Threat-model checklist for frontend features

Run this checklist during technical refinement and again at security review:

1. **Input** — Is every wire payload parsed through a Zod schema via `parseSchema`/`safeParseSchema` from `@/packages/zod` before use? Untyped `JSON.parse` output MUST never cross a mapper boundary.
2. **Output/injection** — Any new HTML rendering path? `dangerouslySetInnerHTML` is banned repo-wide; a need for it is a design smell, escalate to the architect.
3. **Scripts/CSP** — Does the feature add inline scripts or third-party script sources? The per-request nonce CSP in `src/proxy.ts` (`script-src 'self' 'nonce-…' 'strict-dynamic'`) MUST NOT be weakened; static headers in `next.config.ts` (nosniff, `X-Frame-Options: DENY`, referrer-policy, permissions-policy, COOP, HSTS) MUST NOT be removed.
4. **Secrets/session** — Any token stored client-side? The doctrine is cookie-session, token-free — see `src/modules/auth` where `useAuthStore` holds a session snapshot only. No credentials in Zustand, storage, or query cache.
5. **Server/client split** — Server-only config read exclusively via `getServerEnv` from `@/packages/env/server` (guarded by `server-only`); client code sees only `publicEnv`. The `no-server-only-import-in-client` and `no-process-env-outside-config` ESLint rules enforce this.
6. **Outbound URLs** — External links validated with `isSafeExternalUrl` (`src/shared/security/external-url.helper.ts`) and rendered through `ExternalLink` from `@/packages/link` (rel-safe).
7. **Error surfaces** — Errors shown to users only through message keys (`mapErrorToMessageKey`, `ERROR_MESSAGE_KEYS`) — never raw server messages or stack traces.
8. **BFF exposure** — New gateway paths go through `/api/gateway/[...path]` and `buildGatewayPath`; the browser MUST never call a third-party origin directly.

## Dependency intake policy

Adding or upgrading an npm package:

1. New runtime dependency requires architect approval and an entry in [memory/package-decisions.md](../../memory/package-decisions.md).
2. Every runtime package MUST get exactly one owning wrapper under `src/packages/<vendor>` before any module imports it ([rules/09-library-wrapping.md](../../rules/09-library-wrapping.md)); the ownership map in `eslint/package-boundaries.config.mjs` is updated in the same PR.
3. `npm run security:audit` (npm audit at `--audit-level=low`) and `npm run security:scan` (Trivy: vuln + secret + misconfig, dev deps included, exit-code 1 at LOW and above) MUST pass. Zero unhandled vulnerabilities.
4. Transitive vulnerabilities are fixed with an `overrides` entry in `package.json` — the current `postcss: ^8.5.16` override is the reference example. An override without an upstream fix available is filed as an exception with expiry.
5. Vulnerability acceptance (no fix exists, risk assessed as tolerable) is only possible via [docs/exceptions/README.md](../exceptions/README.md) — owner, expiry, and mitigation mandatory.

## Secret handling

- No secrets in the repo, ever. `.env.example` documents variable names only; real values live in local `.env` files (gitignored) and CI secrets.
- Only `NEXT_PUBLIC_*` variables (`NEXT_PUBLIC_APP_ENV`, `NEXT_PUBLIC_APP_URL`) may reach the client. `SERVER_API_BASE_URL` and `SERVER_API_MOCKING` are server-only by construction.
- Trivy secret scanning runs in `npm run security:scan` and in `.github/workflows/security.yml`. A leaked secret is a Sev-1: rotate first, then clean history, then file the incident.

## Incident escalation

Suspected vulnerability or active exploitation: follow [runbooks/incident-response-template.md](../../runbooks/incident-response-template.md). If a release introduced the issue, execute [runbooks/rollback-template.md](../../runbooks/rollback-template.md) before root-cause analysis. Post-incident, update [memory/security-decisions.md](../../memory/security-decisions.md) and [memory/known-pitfalls.md](../../memory/known-pitfalls.md).
