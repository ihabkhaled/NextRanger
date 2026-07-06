/**
 * React hooks correctness. Rules are registered explicitly (not via preset)
 * so severities stay deterministic across plugin major versions:
 * exhaustive-deps is an error here, not a warning.
 */

import reactHooks from 'eslint-plugin-react-hooks';

export default [
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      'react-hooks': reactHooks,
    },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'error',
    },
  },
];
