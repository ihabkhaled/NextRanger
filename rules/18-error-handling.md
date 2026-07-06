# Rule 18 — Error Handling

One doctrine: vendor errors are normalized at the boundary, carried as typed app errors, and reach
the user only as translated copy. Raw error text never crosses a layer it does not belong to.

## The normalization chain

```
axios failure
  → HttpError            (src/packages/axios/http-error.ts — thrown by the wrapper)
  → mapErrorToMessageKey (src/shared/errors/http-error-to-message-key.mapper.ts)
  → ErrorMessageKey      (src/shared/errors/error-keys.constants.ts)
  → t(messageKey)        (translated in a hook or server component)
```

- The axios wrapper converts every failure via `normalizeToHttpError`; services and hooks only ever
  see `HttpError` ([src/packages/axios/http-error.ts](../src/packages/axios/http-error.ts)) with a
  `kind` (`'http' | 'network' | 'timeout' | 'aborted' | 'unknown'`), a nullable `status`, and the
  `responseBody`. Never `catch` an `AxiosError` outside `src/packages/axios` — the import is banned
  by [no-raw-package-imports](../docs/eslint/no-raw-package-imports.md).
- `mapErrorToMessageKey` is the ONLY path from transport failures to user-visible copy: network →
  `errors.network`, timeout → `errors.timeout`, 401/403/404/5xx → their keys, everything else →
  `errors.generic`. Add new mappings there, never inline at a call site.
- Hooks translate the key and put copy into the view model; the reference is the articles list
  flow rendered by `ArticlesListContainer` in [src/modules/articles](../src/modules/articles).

## Typed app errors

- `AppError` ([src/shared/errors/app-error.ts](../src/shared/errors/app-error.ts)) carries an
  `ErrorMessageKey` instead of raw text. Use `toAppError(value)` to coerce any thrown value; it
  preserves the original as `cause` for logging while guaranteeing a translatable surface.
- `SchemaParseError` ([src/packages/zod/parse-schema.ts](../src/packages/zod/parse-schema.ts)) is
  thrown by `parseSchema` when wire data or env fails validation, with normalized
  `{ path, message }` issues — never a raw `ZodError`. Non-throwing paths use `safeParseSchema`
  and its discriminated union.

## Error boundaries

- Every route segment relies on [src/app/error.tsx](../src/app/error.tsx): a client component
  (with its documented `client-boundary-reason`) that logs via `appLogger` with the error `digest`
  and renders `ErrorState` with translated copy and a retry wired to `reset`.
- [src/app/global-error.tsx](../src/app/global-error.tsx) is the last resort when providers
  themselves crashed; it is the single sanctioned user of `FALLBACK_ERROR_COPY` (untranslated,
  because i18n may be down).
- Boundaries MUST render `t(key)` copy — never `error.message`, which may contain stack fragments
  or upstream internals.

## Gateway error responses

The BFF gateway (`gateway-handler.ts` under [src/app/api/gateway](../src/app/api/gateway)) returns
sanitized JSON error codes only: `{ error: 'invalid_request' }` (400),
`{ error: 'invalid_credentials' }` (401), `{ error: 'not_found' }` (404), and
`{ error: 'bad_gateway' }` (502) when the upstream call fails — the upstream failure is logged
server-side via `appLogger`, never forwarded to the browser. New gateway branches MUST follow this
shape: stable machine-readable `error` code, correct status, no upstream text.

## Hard rules

- Never show `error.message`, `responseBody`, or stack traces to users.
- Never swallow an error silently: either recover meaningfully, or log via `appLogger` and surface
  translated copy.
- Empty states are not errors — a 200 with zero items renders the empty branch, not `ErrorState`.
- Form validation errors flow through `mapSchemaIssuesToFieldErrors`
  ([src/shared/mappers](../src/shared/mappers)) into `FormField` error slots
  ([rules/13-accessibility.md](../rules/13-accessibility.md)).

Related: [rules/11-security.md](../rules/11-security.md) (sanitization rationale),
[rules/16-observability-analytics.md](../rules/16-observability-analytics.md) (logging),
[rules/04-services-api-gateway.md](../rules/04-services-api-gateway.md) (layer ownership).
