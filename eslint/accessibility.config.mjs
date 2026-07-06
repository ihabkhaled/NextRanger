/**
 * Accessibility rules: jsx-a11y strict preset on all JSX files.
 */

import jsxA11y from 'eslint-plugin-jsx-a11y';

export default [
  {
    ...jsxA11y.flatConfigs.strict,
    files: ['**/*.tsx'],
  },
];
