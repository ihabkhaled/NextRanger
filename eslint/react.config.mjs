/**
 * React rules: recommended + JSX runtime presets, with prop-types disabled
 * (TypeScript owns prop contracts).
 */

import react from 'eslint-plugin-react';

const reactFiles = ['**/*.tsx'];

export default [
  {
    ...react.configs.flat.recommended,
    files: reactFiles,
  },
  {
    ...react.configs.flat['jsx-runtime'],
    files: reactFiles,
  },
  {
    files: reactFiles,
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      'react/prop-types': 'off',
      'react/jsx-no-useless-fragment': 'error',
      'react/self-closing-comp': 'error',
      'react/jsx-boolean-value': ['error', 'never'],
      'react/no-array-index-key': 'error',
      'react/jsx-no-leaked-render': 'error',
    },
  },
];
