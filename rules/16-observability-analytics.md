# Rule 16 — Observability and Analytics

Console output, error reporting, and (future) product analytics all follow the same doctrine as
every other capability: one owned facade, no raw vendor or platform APIs in app code.

## Logging: `appLogger` is the only console

- All logging goes through `appLogger` from [src/packages/logger](../src/packages/logger/index.ts).
  Direct `console.*` calls are banned by the `no-console` ESLint rule; the logger package is the
  documented owner.
- `appLogger` methods take a message plus a structured `LogContext` object — always log structured
  context, never string-interpolated blobs:

```ts
appLogger.warn('Discarding invalid stored value', { key, issues: result.issues });
```

(real call site: [src/packages/storage/web-storage.ts](../src/packages/storage/web-storage.ts)).

- Never log secrets, tokens, session cookies, or full request/response bodies. Log identifiers and
  shapes, not payloads.

## Error boundary logging

Route error boundaries are the mandatory reporting point for rendering failures.
[src/app/error.tsx](../src/app/error.tsx) is the pattern:

```ts
appLogger.error('Route error boundary caught an error', {
  digest: props.error.digest,
  message: props.error.message,
});
```

Every error boundary MUST log through `appLogger` with the Next.js `digest` so server-side
correlation stays possible, and MUST render translated copy — never `error.message` — to the user
([rules/18-error-handling.md](../rules/18-error-handling.md)).

The BFF gateway logs upstream failures the same way (see `gateway-handler.ts` under
[src/app/api/gateway](../src/app/api/gateway)) before returning a sanitized JSON error.

## Analytics: the facade slot is reserved

- There is no analytics vendor integrated today. When one is adopted, its owner MUST be a new
  wrapper at `src/packages/analytics`, created via
  [skills/create-package-wrapper.md](../skills/create-package-wrapper.md) and registered in
  [eslint/package-boundaries.config.mjs](../eslint/package-boundaries.config.mjs) so raw vendor
  imports are banned from day one.
- The facade exposes intent-level functions (e.g. `trackEvent`, `identifyUser`) — app code never
  sees the vendor SDK. Swapping vendors is then a one-package change, the same argument as every
  wrapper in [rules/09-library-wrapping.md](../rules/09-library-wrapping.md).
- Any analytics script MUST comply with the nonce CSP in [src/proxy.ts](../src/proxy.ts); vendors
  that require `'unsafe-inline'` are rejected.

## Event naming constants doctrine

Analytics event names and property keys follow the same rule as `TEST_IDS`, `STORAGE_KEYS`, and
`ROUTE_PATHS`: they are declared once in an `as const` constants object (inside
`src/packages/analytics` for cross-cutting events, or a module's `constants/` layer for
feature-specific ones) and referenced by symbol. Inline event-name string literals at call sites
are banned — misspelled event names are silent data corruption that no test catches.

## Privacy

Analytics and logs MUST never carry PII beyond an opaque user identifier. Anything more requires a
security review ([skills/security-review.md](../skills/security-review.md)) and an entry in
[memory/security-decisions.md](../memory/security-decisions.md).

Related: [rules/11-security.md](../rules/11-security.md),
[rules/18-error-handling.md](../rules/18-error-handling.md),
[memory/package-decisions.md](../memory/package-decisions.md).
