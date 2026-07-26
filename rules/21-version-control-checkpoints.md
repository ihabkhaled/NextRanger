# 21 — Version-control checkpoints

> Authority: normative. Hooks enforce mechanical safety; reviewers enforce
> coherent scope and prompt publication.

## Mandatory

- MUST split behavior, design, tests, and documentation into the smallest
  coherent commits that can be understood and reverted independently.
- MUST run the focused deterministic gate for that concern immediately before
  committing it.
- MUST use a conventional commit message that describes the shipped concern.
- MUST inspect the staged diff and stage only files owned by that concern.
- MUST push each green checkpoint to the explicitly authorized branch instead
  of accumulating one high-risk final publication.

## Forbidden

- NEVER commit or push a known-red branch.
- NEVER bypass pre-commit, commit-message, or pre-push hooks.
- NEVER mix unrelated concerns because they happened in one work session.
- NEVER defer all publication to a final mega-commit when a coherent green
  checkpoint is available.

## Enforcement

`.husky/pre-commit`, `.husky/commit-msg`, and `.husky/pre-push` enforce the
mechanical gates. Commit cohesion and timely checkpoint publication remain
explicit review items because Git cannot infer intent.

## Definition of done

- [ ] The staged diff has one purpose and no unrelated files.
- [ ] Its focused deterministic gate passed immediately before commit.
- [ ] Hooks ran without bypass.
- [ ] The conventional commit was pushed successfully.

Related: [19 — Release gates](19-release-gates.md) ·
[20 — Review checklist](20-review-checklist.md) ·
[Release checklist](../docs/sdlc/release-checklist.md)
