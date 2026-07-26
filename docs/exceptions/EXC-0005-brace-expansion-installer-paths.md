# EXC-0005 — brace-expansion installer paths

- **Owner:** Toolchain maintainers.
- **Expiry:** Re-review on every ESLint, minimatch, or brace-expansion upgrade; remove when all consumers accept the patched exports directly.
- **Where:** support/patch-brace-expansion-compat.mjs; the file-scoped exception is in eslint/security.config.mjs.
- **Rule:** security/detect-non-literal-fs-filename.
- **Reason:** npm may nest the affected package at different depths. The installer must discover each node_modules/brace-expansion directory and patch its known CommonJS and ESM entries; literal paths would silently miss copies after a dependency-tree change.
- **Safer alternative considered:** a global npm override alone resolves the vulnerability but breaks legacy minimatch consumers because brace-expansion 5 changed its callable CommonJS and default ESM exports. A local-file npm override creates non-portable links relative to each transitive consumer. Upgrading every minimatch consumer also changes APIs used by current ESLint plugins.
- **Mitigation:** traversal starts only at process.cwd()/node_modules, visits package directories only, matches the fixed package name, requires exact version 5.0.8, verifies exact CommonJS and ESM source markers before writing, and fails installation when either package shape changes. Full lint and security gates run after installation.
