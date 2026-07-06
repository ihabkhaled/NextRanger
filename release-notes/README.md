# Release Notes

Every production release of a strict-next-ranger-based app ships with a release-notes document
in this directory. Release notes are part of the release gate: a release without a filled notes
document MUST NOT deploy (see [rules/19-release-gates.md](../rules/19-release-gates.md) and
[docs/sdlc/release-checklist.md](../docs/sdlc/release-checklist.md)).

## Format

- One file per release: `release-notes/<version>.md` (e.g. `release-notes/1.4.0.md`), created by
  copying [release-notes-template.md](release-notes-template.md).
- Versioning follows semver on the app version in `package.json`. Version bumps happen in the
  release pull request, not after.
- Commit history is conventional-commit clean (enforced by commitlint via
  `.husky/commit-msg`), so the "changes by module" section is assembled from
  `git log` between the previous release tag and the new one — scoped by module
  (`feat(articles): …`, `fix(auth): …`), then edited for human readers. Release notes describe
  user- and operator-visible change, not internal churn.
- The gate evidence table is mandatory and MUST reference actual runs: local `npm run validate`
  output and the CI runs in `.github/workflows/ci.yml`, `security.yml`, and `e2e.yml` for the
  release commit.

## Cadence

- **Feature releases:** on completion of a feature lifecycle
  ([docs/features/](../docs/features/README.md)), typically batched; each gets its own notes file.
- **Fix releases:** as needed; a one-line highlights section is acceptable, the gate evidence
  table is not optional.
- **Rollbacks:** the rolled-back version's notes are updated with a "rolled back" marker and a
  link to the filled [runbooks/rollback-template.md](../runbooks/rollback-template.md) copy;
  the re-release gets a fresh notes file.

## Authoring rules

- Written by the release owner, reviewed by the same reviewer set as the release PR.
- Known issues MUST be synchronized with support's known-issues document
  ([support/known-issues-template.md](../support/known-issues-template.md)) — the two lists
  must not contradict each other.
- Upgrade notes MUST call out any change to environment variables (compare against
  `.env.example`), storage schemas read via `readStorageJson`, cookies (e.g. `NEXT_LOCALE`),
  or gateway paths — these are the things operators and the rollback runbook depend on.
