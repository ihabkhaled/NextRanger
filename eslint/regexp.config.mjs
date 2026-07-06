/**
 * Regular expression correctness and safety (ReDoS-prone patterns, useless
 * constructs, confusing character classes).
 */

import regexpPlugin from 'eslint-plugin-regexp';

export default [
  {
    ...regexpPlugin.configs['flat/recommended'],
    files: ['**/*.{ts,tsx,mts,mjs}'],
  },
];
