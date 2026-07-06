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
];
