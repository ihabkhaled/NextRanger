# EXC-0006: social asset generator filesystem paths

## Scope

`support/social-asset-config.mjs`, `support/social-fonts.mjs`, and
`support/social-images.mjs`.

## Rule

`security/detect-non-literal-fs-filename`

## Reason

The generators must read and write one file per supported locale and font weight. Every path is
derived from the repository directory, the fixed `LOCALE_FONT_FAMILIES` keys, and the fixed
`FONT_WEIGHTS` values. User input never reaches a filesystem path.

## Controls

- Asset roots are resolved from `import.meta.url`, never the process working directory.
- Locale and weight segments come from closed in-repository enumerations.
- Hash manifests make unexpected or stale binary changes fail `npm run assets:social:check`.
- Generation is explicit; CI and pre-push checks are read-only.
