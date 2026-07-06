/**
 * Promise discipline: recommended preset with the strictness the async
 * gateway/service layers rely on.
 */

import promisePlugin from 'eslint-plugin-promise';

export default [
  {
    ...promisePlugin.configs['flat/recommended'],
    files: ['**/*.{ts,tsx,mts,mjs}'],
  },
  {
    files: ['**/*.{ts,tsx,mts,mjs}'],
    rules: {
      'promise/always-return': ['error', { ignoreLastCallback: true }],
      'promise/no-nesting': 'error',
      'promise/no-return-wrap': 'error',
      'promise/param-names': 'error',
    },
  },
];
