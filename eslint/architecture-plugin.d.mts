/**
 * Type declarations for the local frontend-architecture ESLint plugin so the
 * rule test harness (src/tests/unit/eslint-architecture-rules.test.ts) can
 * import it under `allowJs: false`.
 */

import type { ESLint } from 'eslint';

export declare const frontendArchitecturePlugin: ESLint.Plugin;
