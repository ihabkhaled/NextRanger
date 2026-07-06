/**
 * Unicorn rules: recommended preset with project-fit adjustments.
 *
 * - prevent-abbreviations: off — props/params/ref/env are idiomatic React.
 * - no-null: off — React APIs (refs, JSX) use null deliberately.
 * - filename-case: kebab-case matches the architecture file conventions.
 */

import unicornPlugin from 'eslint-plugin-unicorn';

export default [
  {
    ...unicornPlugin.configs.recommended,
    files: ['**/*.{ts,tsx,mts,mjs}'],
  },
  {
    files: ['**/*.{ts,tsx,mts,mjs}'],
    rules: {
      'unicorn/prevent-abbreviations': 'off',
      'unicorn/no-null': 'off',
      // APIs like vi.stubGlobal require an explicit undefined argument; keep
      // the rule for useless returns/variables only.
      'unicorn/no-useless-undefined': ['error', { checkArguments: false }],
      'unicorn/filename-case': ['error', { case: 'kebabCase' }],
      'unicorn/no-array-reduce': 'error',
      'unicorn/prefer-module': 'error',
    },
  },
  {
    files: ['**/*.cjs'],
    rules: {
      'unicorn/prefer-module': 'off',
    },
  },
];
