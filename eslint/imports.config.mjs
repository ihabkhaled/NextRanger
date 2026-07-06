/**
 * Import hygiene: import-x ordering/duplication rules plus autofixable
 * unused-import removal. Module resolution correctness is owned by
 * TypeScript (typecheck gate), so resolver-dependent rules stay off.
 */

import importX from 'eslint-plugin-import-x';
import unusedImports from 'eslint-plugin-unused-imports';

export default [
  {
    files: ['**/*.{ts,tsx,mts,mjs}'],
    plugins: {
      'import-x': importX,
      'unused-imports': unusedImports,
    },
    rules: {
      'import-x/first': 'error',
      'import-x/newline-after-import': 'error',
      'import-x/no-duplicates': 'error',
      'import-x/no-self-import': 'error',
      'import-x/no-useless-path-segments': 'error',
      'import-x/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          pathGroups: [
            {
              pattern: '@{app,modules,shared,packages,tests}/**',
              group: 'internal',
            },
            {
              pattern: '@/**',
              group: 'internal',
            },
          ],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'error',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],
    },
  },
];
