/**
 * Test-file rules: Vitest + Testing Library for unit/integration tests,
 * Playwright rules for e2e/accessibility/visual specs, plus the strictness
 * relaxations tests legitimately need.
 */

import vitestPlugin from '@vitest/eslint-plugin';
import playwrightPlugin from 'eslint-plugin-playwright';
import testingLibrary from 'eslint-plugin-testing-library';

const unitTestFiles = ['src/**/*.test.{ts,tsx}'];
const playwrightFiles = [
  'src/tests/e2e/**/*.ts',
  'src/tests/accessibility/**/*.ts',
  'src/tests/visual/**/*.ts',
];

export default [
  {
    files: unitTestFiles,
    plugins: {
      vitest: vitestPlugin,
    },
    rules: {
      ...vitestPlugin.configs.recommended.rules,
      'vitest/no-focused-tests': 'error',
      'vitest/no-disabled-tests': 'error',
      'vitest/expect-expect': 'error',
      'vitest/no-standalone-expect': 'error',
    },
  },
  {
    files: ['src/**/*.test.tsx'],
    plugins: {
      'testing-library': testingLibrary,
    },
    rules: {
      ...testingLibrary.configs['flat/react'].rules,
      'testing-library/no-debugging-utils': 'error',
      'testing-library/prefer-user-event': 'error',
    },
  },
  {
    files: playwrightFiles,
    plugins: {
      playwright: playwrightPlugin,
    },
    rules: {
      ...playwrightPlugin.configs['flat/recommended'].rules,
      'playwright/no-focused-test': 'error',
      'playwright/no-skipped-test': 'error',
      'playwright/no-wait-for-timeout': 'error',
      // Shared assertion helpers (e.g. axe scans) count as assertions.
      'playwright/expect-expect': [
        'error',
        { assertFunctionNames: ['expect', 'expectNoBlockingViolations'] },
      ],
    },
  },
  {
    files: [...unitTestFiles, 'src/tests/**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-magic-numbers': 'off',
      // Mock/stub callbacks are legitimately empty in tests.
      '@typescript-eslint/no-empty-function': 'off',
      // expect(spy.method) references are the standard mock-assertion shape.
      '@typescript-eslint/unbound-method': 'off',
      'sonarjs/no-duplicate-string': 'off',
    },
  },
];
