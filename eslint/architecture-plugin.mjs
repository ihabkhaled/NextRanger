/**
 * Local ESLint plugin: frontend-architecture
 *
 * Enforces the architecture contract no off-the-shelf plugin can:
 * TSX-only component files, layered one-way imports, package boundaries,
 * React-free services/gateways/helpers, env/browser facades, query-key builders,
 * i18n copy discipline, and justified client boundaries.
 *
 * Rule documentation lives in docs/eslint/<rule-name>.md.
 */

import noCrossModuleDeepImports from './architecture-plugin/rules/no-cross-module-deep-imports.mjs';
import noDirectBrowserApiOutsidePackages from './architecture-plugin/rules/no-direct-browser-api-outside-packages.mjs';
import noHooksInComponents from './architecture-plugin/rules/no-hooks-in-components.mjs';
import noInlineClassnameOutsideDesignSystem from './architecture-plugin/rules/no-inline-classname-outside-design-system.mjs';
import noInlineComponentLogic from './architecture-plugin/rules/no-inline-component-logic.mjs';
import noInlineDeclarations from './architecture-plugin/rules/no-inline-declarations.mjs';
import noInlineQueryKeys from './architecture-plugin/rules/no-inline-query-keys.mjs';
import noProcessEnvOutsideConfig from './architecture-plugin/rules/no-process-env-outside-config.mjs';
import noRawI18nText from './architecture-plugin/rules/no-raw-i18n-text.mjs';
import noRawPackageImports from './architecture-plugin/rules/no-raw-package-imports.mjs';
import noReactInPureLayers from './architecture-plugin/rules/no-react-in-pure-layers.mjs';
import noRestrictedLayerImports from './architecture-plugin/rules/no-restricted-layer-imports.mjs';
import noServerOnlyImportInClient from './architecture-plugin/rules/no-server-only-import-in-client.mjs';
import requireClientComponentReason from './architecture-plugin/rules/require-client-component-reason.mjs';

export const frontendArchitecturePlugin = {
  meta: {
    name: 'frontend-architecture',
    version: '1.0.0',
  },
  rules: {
    'no-cross-module-deep-imports': noCrossModuleDeepImports,
    'no-direct-browser-api-outside-packages': noDirectBrowserApiOutsidePackages,
    'no-hooks-in-components': noHooksInComponents,
    'no-inline-classname-outside-design-system': noInlineClassnameOutsideDesignSystem,
    'no-inline-component-logic': noInlineComponentLogic,
    'no-inline-declarations': noInlineDeclarations,
    'no-inline-query-keys': noInlineQueryKeys,
    'no-process-env-outside-config': noProcessEnvOutsideConfig,
    'no-raw-i18n-text': noRawI18nText,
    'no-raw-package-imports': noRawPackageImports,
    'no-react-in-pure-layers': noReactInPureLayers,
    'no-restricted-layer-imports': noRestrictedLayerImports,
    'no-server-only-import-in-client': noServerOnlyImportInClient,
    'require-client-component-reason': requireClientComponentReason,
  },
};
