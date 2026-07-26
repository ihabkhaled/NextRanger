/**
 * Root ESLint orchestrator.
 *
 * This file only composes the split configs under eslint/ — it never defines
 * rules itself. Order matters: ignores first, prettier last.
 */

import accessibilityConfig from './eslint/accessibility.config.mjs';
import architectureConfig from './eslint/architecture.config.mjs';
import baseConfig from './eslint/base.config.mjs';
import { enforceErrorSeverity } from './eslint/error-severity.config.mjs';
import ignoresConfig from './eslint/ignores.config.mjs';
import importsConfig from './eslint/imports.config.mjs';
import nextConfig from './eslint/next.config.mjs';
import packageBoundariesConfig from './eslint/package-boundaries.config.mjs';
import prettierConfig from './eslint/prettier.config.mjs';
import promiseConfig from './eslint/promise.config.mjs';
import reactHooksConfig from './eslint/react-hooks.config.mjs';
import reactConfig from './eslint/react.config.mjs';
import regexpConfig from './eslint/regexp.config.mjs';
import securityConfig from './eslint/security.config.mjs';
import sonarConfig from './eslint/sonar.config.mjs';
import storybookConfig from './eslint/storybook.config.mjs';
import tanstackQueryConfig from './eslint/tanstack-query.config.mjs';
import testConfig from './eslint/test.config.mjs';
import typescriptConfig from './eslint/typescript.config.mjs';
import unicornConfig from './eslint/unicorn.config.mjs';

const composedConfig = [
  ...ignoresConfig,
  ...baseConfig,
  ...typescriptConfig,
  ...reactConfig,
  ...reactHooksConfig,
  ...nextConfig,
  ...tanstackQueryConfig,
  ...accessibilityConfig,
  ...importsConfig,
  ...promiseConfig,
  ...regexpConfig,
  ...securityConfig,
  ...sonarConfig,
  ...unicornConfig,
  ...architectureConfig,
  ...packageBoundariesConfig,
  ...testConfig,
  ...storybookConfig,
  ...prettierConfig,
];

export default enforceErrorSeverity(composedConfig);
