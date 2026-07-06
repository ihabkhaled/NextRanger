# Release Smoke Test — <version>

- **Release:** <version / commit SHA>
- **Environment:** <production URL>
- **Executed by:** <name>, <YYYY-MM-DD HH:MM UTC>
- **Result:** <PASS | FAIL — if any item fails, evaluate [rollback-template.md](rollback-template.md)>

Run within 15 minutes of every production deploy, on the live environment, in a real browser.
This complements — never replaces — the automated gates (`npm run validate`, CI in
`.github/workflows/`). Execute in order; stop and escalate on the first Sev-relevant failure
(see severity table in [incident-response-template.md](incident-response-template.md)).

## 1. Liveness

- [ ] `GET <base-url>/api/health` returns HTTP 200 with a JSON health report
      (served by [src/app/api/health/route.ts](../src/app/api/health/route.ts) via `buildHealthReport`).

## 2. Home renders

- [ ] `/` (route `ROUTE_PATHS.home`) renders with no error boundary, no blank screen.
- [ ] Browser console shows no CSP violations (nonce CSP from `src/proxy.ts`) and no uncaught errors.

## 3. Locale switch and RTL

- [ ] Switch locale en → ar (cookie `NEXT_LOCALE`): UI copy changes to Arabic and the document
      `dir` attribute flips to `rtl`; layout mirrors correctly.
- [ ] Switch back ar → en: copy returns to English, `dir` returns to `ltr`.
- [ ] No untranslated message keys visible on the home page in either locale.

## 4. Articles list from the gateway

- [ ] `/articles` shows the ready state with article cards (data flows through
      `/api/gateway/articles` — mock fixtures or upstream depending on `SERVER_API_MOCKING`).
- [ ] Network tab confirms the request went to the same-origin gateway path, not a third-party origin.
- [ ] Loading state appears briefly and resolves; no error or empty state on a healthy backend.

## 5. Login — happy and negative path

- [ ] `/login`: submit valid credentials → success path (session established, redirect/confirmation).
- [ ] `/login`: submit the rejected password (in mock mode the sentinel is
      `AUTH_MOCK_REJECTED_PASSWORD` = `wrong-password`, from
      [src/modules/auth/api/auth.mock.ts](../src/modules/auth/api/auth.mock.ts)) → a translated,
      user-safe error message renders; no raw error, stack trace, or English-only text in ar locale.
- [ ] Empty form submit shows field-level validation messages from the login schema.

## 6. Settings persistence (ui-preferences)

- [ ] `/settings`: toggle theme → `[data-theme='dark']` styling applies immediately.
- [ ] Reload the page: theme, direction, and sidebar preferences survive (storage-facade persistence).
- [ ] Toggle back and confirm the light theme restores.

## 7. Cross-cutting checks

- [ ] `/workbench` renders the primitive showcase without errors (canary for design-system regressions).
- [ ] Response headers include the static security headers from `next.config.ts`
      (`X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, HSTS) and no `X-Powered-By`.

## Notes and anomalies

| Item     | Observation     | Action taken                    |
| -------- | --------------- | ------------------------------- |
| <item #> | <what was seen> | <escalated / logged / accepted> |

Any FAIL: open [incident-response-template.md](incident-response-template.md) if
user-impacting, and record the outcome in the release's notes
([release-notes/release-notes-template.md](../release-notes/release-notes-template.md), gate
evidence table).
