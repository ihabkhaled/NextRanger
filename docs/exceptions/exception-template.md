# Exception: <short title>

Copy this file to `docs/exceptions/exc-<nnnn>-<slug>.md`, fill every field, and add the entry to the register in [README.md](./README.md). An exception PR MUST contain the suppression and this document together, approved by the frontend architect.

## Identification

- **Id**: EXC-<nnnn>
- **Date filed**: <YYYY-MM-DD>
- **Owner**: <name — the person accountable for this exception existing>
- **Expiry**: <YYYY-MM-DD, or "permanent" with justification below — permanent exceptions are re-reviewed at every framework-tier upgrade>

## Scope

- **Rule / gate bypassed**: <e.g. `sonarjs/no-hardcoded-passwords`, TypeScript 7 strict typecheck via `@ts-expect-error`, `npm run security:audit` finding GHSA-xxxx>
- **Exact location(s)**: <file path(s) and, for in-source suppressions, the line-level comment that references this doc>
- **Blast radius**: <what the gate would normally protect here; who/what is exposed while the exception stands>

## Justification

- **Reason**: <the concrete failure the gate produces at this site — error text, false-positive pattern, upstream limitation. Not "the rule is inconvenient".>
- **Alternatives considered**: <each safer alternative that was tried or evaluated, and specifically why it does not work here — e.g. refactor attempted, upstream issue link, wrapper-level fix ruled out>

## Risk control

- **Mitigation**: <the compensating control that covers the bypassed risk — another gate (Trivy, TypeScript strictness, Zod boundary validation), a test, a structural confinement (single file, single export)>
- **Detection**: <how we would notice if the risk materializes — test, scanner, monitoring>

## Removal plan

- **Removal trigger**: <what unblocks removal — vendor fix version, planned refactor, rule replacement>
- **Removal steps**: <what to delete/revert, which suites to re-run — at minimum `npm run lint` and `npm run typecheck`>
- **Review cadence**: <when the owner re-checks the trigger; defaults to the expiry date and every release audit per [../sdlc/release-checklist.md](../sdlc/release-checklist.md)>

## Sign-off

- **Architect approval**: <name, date>
- **Status**: active | superseded by <EXC-nnnn or commit> | removed on <date>
