/**
 * SonarJS code-quality rules: cognitive complexity caps, duplicated branch
 * detection, and bug-prone construct checks.
 */

import sonarjs from 'eslint-plugin-sonarjs';

export default [
  {
    ...sonarjs.configs.recommended,
    files: ['**/*.{ts,tsx,mts,mjs}'],
  },
  {
    files: ['**/*.{ts,tsx,mts,mjs}'],
    rules: {
      'sonarjs/cognitive-complexity': ['error', 15],
      'sonarjs/no-duplicate-string': 'off',
      // Cannot distinguish i18n keys / test ids / field ids that mention
      // "password" from real credentials. Secret detection is owned by the
      // Trivy secret scanner gate (npm run security:scan) and CI.
      'sonarjs/no-hardcoded-passwords': 'off',
    },
  },
];
