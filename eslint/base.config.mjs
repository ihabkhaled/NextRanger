/**
 * Base JavaScript rules for every linted file, plus language options for the
 * few CommonJS config files (commitlint, lint-staged).
 */

import js from '@eslint/js';

export default [
  {
    ...js.configs.recommended,
    files: ['**/*.{js,mjs,cjs,ts,tsx,mts}'],
  },
  {
    files: ['**/*.{js,mjs,cjs,ts,tsx,mts}'],
    linterOptions: {
      reportUnusedDisableDirectives: 'error',
    },
    rules: {
      // Console output goes through the logger facade (src/packages/logger).
      'no-console': 'error',
      eqeqeq: ['error', 'always'],
      'no-var': 'error',
      'prefer-const': 'error',
      'object-shorthand': ['error', 'always'],
    },
  },
  {
    files: ['**/*.cjs'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: {
        module: 'writable',
        require: 'readonly',
        __dirname: 'readonly',
        process: 'readonly',
      },
    },
  },
  {
    // The logger wrapper is the single owner of console output.
    files: ['src/packages/logger/**'],
    rules: {
      'no-console': 'off',
    },
  },
];
