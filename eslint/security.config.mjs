/**
 * Security rules from eslint-plugin-security.
 *
 * `detect-object-injection` is intentionally off: it flags every computed
 * property access and produces near-100% false positives in typed code.
 * Object-injection risk is instead controlled by TypeScript strictness
 * (noPropertyAccessFromIndexSignature, noUncheckedIndexedAccess) and the
 * Zod-validated boundaries. Documented in docs/exceptions/README.md.
 */

import securityPlugin from 'eslint-plugin-security';

export default [
  {
    ...securityPlugin.configs.recommended,
    files: ['**/*.{ts,tsx,mts,mjs}'],
  },
  {
    files: ['**/*.{ts,tsx,mts,mjs}'],
    rules: {
      'security/detect-object-injection': 'off',
    },
  },
  {
    // EXC-0005: paths are confined to process.cwd()/node_modules and fixed package names.
    files: ['support/patch-brace-expansion-compat.mjs'],
    rules: {
      'security/detect-non-literal-fs-filename': 'off',
    },
  },
  {
    // EXC-0006: fixed locale/weight enumerations are confined to the repository asset roots.
    files: ['support/social-*.mjs'],
    rules: {
      'security/detect-non-literal-fs-filename': 'off',
    },
  },
];
