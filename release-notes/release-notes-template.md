# Release <version> — <YYYY-MM-DD>

- **Release owner:** <name>
- **Commit:** <SHA on main>
- **Previous release:** <version / SHA>
- **Deploy status:** <Deployed <time UTC> | Rolled back — see link>
- **Smoke test:** <PASS/FAIL, link to the filled runbooks/release-smoke-test-template.md copy>

## Highlights

<3–5 bullets, written for stakeholders. What can users do now that they could not before?
What risk was removed? Plain language, no file paths.>

- <highlight>
- <highlight>

## Changes by module

Assembled from conventional commits between <previous tag> and <this tag>, edited for readers.
Delete module sections with no changes.

### articles

- <feat/fix summary — user-visible effect>

### auth

- <feat/fix summary>

### ui-preferences

- <feat/fix summary>

### shared / packages / app shell

- <changes to src/shared, src/packages wrappers, routes/layouts, proxy/CSP, providers>

### tooling / CI

- <changes to eslint configs, scripts, workflows, hooks — only if operator-relevant>

## Gate evidence

Every row MUST link to a real run for the release commit. See
[testing/quality-gates.md](../testing/quality-gates.md) for what each gate proves.

| Gate                        | Command / workflow                                       | Result                       | Evidence  |
| --------------------------- | -------------------------------------------------------- | ---------------------------- | --------- |
| Lint (zero warnings)        | `npm run lint`                                           | <pass>                       | <CI link> |
| Typecheck                   | `npm run typecheck`                                      | <pass>                       | <CI link> |
| Unit/integration + coverage | `npm run test:coverage`                                  | <pass, % vs thresholds>      | <CI link> |
| Build                       | `npm run build`                                          | <pass>                       | <CI link> |
| E2E                         | `npm run test:e2e` (.github/workflows/e2e.yml)           | <pass>                       | <CI link> |
| Accessibility               | `npm run test:a11y`                                      | <pass>                       | <CI link> |
| Visual                      | `npm run test:visual`                                    | <pass / N baselines updated> | <CI link> |
| Dependency audit            | `npm run security:audit`                                 | <pass>                       | <CI link> |
| Trivy scan                  | `npm run security:scan` (.github/workflows/security.yml) | <pass>                       | <CI link> |
| Dead code / circular deps   | `npm run quality:dead-code`, `npm run quality:circular`  | <pass>                       | <CI link> |

## Known issues

Synchronized with the support known-issues document
([support/known-issues-template.md](../support/known-issues-template.md)).

| ID      | Summary    | Severity  | Workaround             |
| ------- | ---------- | --------- | ---------------------- |
| <KI-NN> | <one line> | <Sev-3/4> | <workaround or "none"> |

## Upgrade notes

Operator-facing. Write "None." explicitly if empty — never omit the section.

- **Environment variables:** <added/changed/removed vs .env.example, with required values>
- **Cookies / storage:** <changes to NEXT_LOCALE, session cookies, or storage schemas>
- **Gateway / API contract:** <new or changed /api/gateway/* paths; upstream version required>
- **Dependency notes:** <major bumps, new overrides in package.json, wrapper API changes>
- **Rollback caveats:** <anything that makes rolling back to the previous version non-trivial>
