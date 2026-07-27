# Memory

Durable, reusable engineering knowledge for strict-next-ranger: decisions we made, why we made
them, and pitfalls we already paid for. Memory exists so that no human or AI agent re-litigates a
settled trade-off or re-hits a known failure mode.

## What memory is (and is not)

- Memory records **decisions and pitfalls**, with the reasoning that produced them. Every entry
  names the alternative that was rejected and the concrete file(s) that embody the decision.
- Memory is **not** a rulebook. Normative MUST/never language lives in [rules/](../rules/README.md).
  When a memory entry is promoted to a hard rule, the rule file is the enforcement surface and the
  memory entry keeps the rationale.
- Memory never contains secrets, credentials, tokens, or customer data. Secret handling is covered
  by [rules/11-security.md](../rules/11-security.md) and the Trivy gate (`npm run security:scan`).
- Formal, numbered architecture decisions live in
  [architecture/adrs/](../architecture/adrs/README.md). Memory holds the wider set of smaller,
  package-level and tooling-level decisions that do not warrant an ADR each.

## How agents MUST consult memory

1. Before proposing a dependency change, read
   [package-decisions.md](./package-decisions.md) — the alternative you are about to suggest was
   probably already evaluated.
2. Before debugging a toolchain or type error, scan [known-pitfalls.md](./known-pitfalls.md) —
   most "mysterious" failures in this repo are already documented with their fix.
3. Before changing test thresholds, security posture, performance defaults, i18n behavior,
   accessibility patterns, or design tokens, read the matching decision file below and either
   comply or write a new dated entry explaining the supersession.
4. When you learn something durable during a task (a new pitfall, a new trade-off), append it to
   the matching file in the same change — memory is maintained, not archaeological.

## Files

| File                                                             | Contents                                                                       |
| ---------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| [known-pitfalls.md](./known-pitfalls.md)                         | Real failures hit while building this repo and their exact fixes.              |
| [package-decisions.md](./package-decisions.md)                   | Chosen packages vs rejected alternatives, with reasons.                        |
| [testing-strategy.md](./testing-strategy.md)                     | Why the coverage bars, MSW-everywhere, and test-type split are what they are.  |
| [security-decisions.md](./security-decisions.md)                 | CSP, session, BFF, and vulnerability-policy decisions.                         |
| [performance-decisions.md](./performance-decisions.md)           | Server-first rendering, memoization stance, virtualization and cache defaults. |
| [i18n-rtl-decisions.md](./i18n-rtl-decisions.md)                 | URL locales, 14-catalog contract, RTL proof locales, logical properties.       |
| [accessibility-decisions.md](./accessibility-decisions.md)       | Lint preset, axe fail bar, skip link, toggle and focus patterns.               |
| [ui-design-system-decisions.md](./ui-design-system-decisions.md) | Token architecture, variants-as-constants, primitive inventory.                |

## Entry format

Each entry states: **Decision** (one sentence), **Rejected alternative(s)**, **Why**, and
**Where it lives** (real file paths). Pitfall entries state: **Symptom**, **Cause**, **Fix**,
**Where encoded**. Keep entries short enough to be read before every relevant task.
