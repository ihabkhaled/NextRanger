/**
 * Global ignore list. Everything else in the repository is linted.
 * The architecture-plugin fixtures are deliberate rule violations exercised
 * by the rule test-suite, so they are excluded from the normal lint run.
 */

export default [
  {
    ignores: [
      'node_modules/',
      '.next/',
      'out/',
      'build/',
      'dist/',
      'coverage/',
      'test-results/',
      'playwright-report/',
      'blob-report/',
      'next-env.d.ts',
      'eslint/architecture-plugin/__fixtures__/',
    ],
  },
];
