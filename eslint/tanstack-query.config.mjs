/**
 * TanStack Query correctness rules (exhaustive query deps, stable query
 * client, no rest destructuring of query results).
 */

import tanstackQuery from '@tanstack/eslint-plugin-query';

export default tanstackQuery.configs['flat/recommended'].map((config) => ({
  ...config,
  files: ['**/*.{ts,tsx}'],
}));
