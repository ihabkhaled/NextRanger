/**
 * Prettier interop: disables every formatting rule that would conflict with
 * Prettier. Must stay the LAST entry in the root orchestrator.
 */

import prettierConfig from 'eslint-config-prettier';

export default [prettierConfig];
