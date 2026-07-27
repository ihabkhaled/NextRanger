# Agents

Persona briefs for AI coding tools working in strict-next-ranger. Each brief defines a
specialist reviewer: its mission, when to invoke it, the exact rules/context files it MUST
read before judging anything, a review checklist, and the verdict format it MUST emit.

## How these briefs are used

- **Claude Code** loads them via [CLAUDE.md](../CLAUDE.md) / [AGENTS.md](../AGENTS.md) and
  runs a brief as a subagent persona when a task matches its "when to invoke" section.
- **Cursor** reaches them through [.cursorrules](../.cursorrules) and the rule files under
  [.cursor/rules/00-canonical-policy.mdc](../.cursor/rules/00-canonical-policy.mdc).
- **Codex** and other tools load them via [CODEX.md](../CODEX.md).
- Humans use them as PR review scripts: pick the personas whose scope the diff touches and
  walk their checklists.

A brief never replaces the rules — it tells the reviewer which rules to enforce and how to
report. The canonical policy is always [rules/00-non-negotiable-rules.md](../rules/00-non-negotiable-rules.md).

## Shared verdict vocabulary

Every agent MUST close its review with exactly one verdict:

- `APPROVE` — no findings, or style-only notes.
- `APPROVE WITH NITS` — non-blocking findings the author may fix in a follow-up.
- `REQUEST CHANGES` — at least one violation of a rule document; merge is blocked until fixed
  or a documented exception exists under [docs/exceptions/](../docs/exceptions/README.md).
- `BLOCK` — a non-negotiable rule or release gate is violated; no exception is possible.

Findings MUST be listed as `severity | file:line | rule reference | one-line defect statement`.
The release gatekeeper uses `GO` / `NO-GO` instead (see its brief).

## Roster

| Brief                                                            | Scope                                                                     |
| ---------------------------------------------------------------- | ------------------------------------------------------------------------- |
| [frontend-architect.md](frontend-architect.md)                   | Layering, module boundaries, public surfaces                              |
| [next-app-router-reviewer.md](next-app-router-reviewer.md)       | `src/app` conventions, server/client boundaries, metadata, route handlers |
| [react-performance-reviewer.md](react-performance-reviewer.md)   | Client-boundary bloat, memo discipline, virtualization, query config      |
| [frontend-security-reviewer.md](frontend-security-reviewer.md)   | CSP, env handling, cookies, dependencies, error leakage                   |
| [accessibility-reviewer.md](accessibility-reviewer.md)           | Axe results, keyboard paths, focus, semantics, forms                      |
| [frontend-test-engineer.md](frontend-test-engineer.md)           | TDD enforcement, coverage, test quality, MSW usage                        |
| [eslint-boundary-reviewer.md](eslint-boundary-reviewer.md)       | Custom-rule violations, boundary map maintenance, exception audit         |
| [frontend-release-gatekeeper.md](frontend-release-gatekeeper.md) | Runs `final-validation`, blocks on any red gate, writes release notes     |
| [i18n-rtl-reviewer.md](i18n-rtl-reviewer.md)                     | All-locale catalog parity, URL locale, direction, logical properties      |

## Invoking more than one agent

When a diff spans scopes, run each relevant agent independently and merge verdicts by
worst-case: any `BLOCK` wins, then `REQUEST CHANGES`, then `APPROVE WITH NITS`. Agents
MUST NOT soften a verdict because another agent approved.
