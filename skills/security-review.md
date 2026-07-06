# Skill: Security Review

Run this review on every feature branch before requesting merge, and delegate the same checklist
to [agents/frontend-security-reviewer.md](../agents/frontend-security-reviewer.md) when reviewing
someone else's diff. The binding policy is [rules/11-security.md](../rules/11-security.md) and
[docs/sdlc/security-baseline.md](../docs/sdlc/security-baseline.md).

## Steps

1. **New environment variables.** Any new variable MUST be Zod-validated in `src/packages/env`
   (`public-env.ts` for `NEXT_PUBLIC_*`, `server.ts` — guarded by `server-only` — for the rest),
   documented in `.env.example`, and read only through `publicEnv` or `getServerEnv`. Grep the
   diff for `process.env`: outside `src/packages/env/`, `src/shared/config/`, test setup, and
   `src/proxy.ts` it is an ESLint error
   ([docs/eslint/no-process-env-outside-config.md](../docs/eslint/no-process-env-outside-config.md)).
   Confirm no secret was added under a `NEXT_PUBLIC_` prefix.
2. **New dependencies.** Every third-party package MUST have exactly one owning wrapper under
   `src/packages/<vendor>` registered in `eslint/package-boundaries.config.mjs`
   (see [skills/create-package-wrapper.md](create-package-wrapper.md)). A raw vendor import in
   feature code is a boundary breach, not a style issue. Check `package.json` for the dependency,
   and check whether it needed a transitive-vuln override — the `postcss` override in
   `package.json` is the reference example of doing that properly.
3. **CSP impact.** The nonce-based policy lives in `src/proxy.ts`
   (`script-src 'self' 'nonce-…' 'strict-dynamic'`, `object-src 'none'`,
   `frame-ancestors 'none'`). Anything that would require loosening it — inline scripts, external
   script/font/image origins, embeds — is rejected by default; a genuine need goes through
   [docs/exceptions/README.md](../docs/exceptions/README.md). Static headers (nosniff, DENY,
   COOP, HSTS, referrer/permissions policy) are in `next.config.ts`; verify the diff does not
   remove or weaken any of them.
4. **Cookies and sessions.** The auth doctrine is cookie-session, token-free: `useAuthStore`
   holds a session snapshot, never a token, and browser storage
   (`src/packages/storage`) MUST never hold credentials. Any cookie set by a route handler or the
   BFF gateway MUST be `HttpOnly`, `Secure`, and `SameSite` — flag any `document.cookie` write or
   client-readable auth material immediately.
5. **Links and navigation.** External links go through `ExternalLink`
   (`src/packages/link`), which applies safe `rel` attributes; user- or API-supplied URLs MUST
   pass `isSafeExternalUrl` (`src/shared/security/external-url.helper.ts`), which allows only
   `https:` and `mailto:` and rejects `javascript:`, `data:`, and plain `http:`. Internal
   navigation uses `AppLink` typed routes — reject string-built hrefs.
6. **Error sanitization.** Raw error objects and server messages MUST never reach the UI. Errors
   are normalized (`toAppError` in `src/shared/errors/app-error.ts`, `normalizeToHttpError` in
   `src/packages/axios`) and rendered via message keys through `mapErrorToMessageKey`
   (`src/shared/errors/http-error-to-message-key.mapper.ts`). Flag any component or toast that
   prints `error.message` directly.
7. **Injection surface.** `dangerouslySetInnerHTML` does not exist in this codebase and MUST not
   be introduced. Grep the diff for it, for `eval`, and for `new Function`.
8. **Run the automated gates** and require both to pass clean:

   ```sh
   npm run security:audit   # npm audit --audit-level=low
   npm run security:scan    # trivy fs: vuln + secret + misconfig, exit-code 1 on any severity
   ```

   Zero unhandled findings is the policy ([rules/19-release-gates.md](../rules/19-release-gates.md)).
   A finding is handled only by upgrading, by a documented override in `package.json`, or by a
   documented exception in `docs/exceptions/`.

## Done when

Every checklist item has an explicit yes/no answer in the review notes, both scan commands exit 0,
and any deviation is captured via [docs/exceptions/exception-template.md](../docs/exceptions/exception-template.md).
