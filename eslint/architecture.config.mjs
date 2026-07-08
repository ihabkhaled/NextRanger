/**
 * Frontend architecture enforcement: registers the local
 * frontend-architecture plugin and supplies the one-way layer policy table
 * from rules/01-next-app-router-architecture.md.
 */

import { frontendArchitecturePlugin } from './architecture-plugin.mjs';

/**
 * One-way dependency policies. Layer ids come from
 * eslint/architecture-plugin/shared/policy-utils.mjs.
 */
const layerPolicies = [
  {
    from: 'module-components',
    forbid: [
      'module-hooks',
      'module-queries',
      'module-services',
      'module-gateway',
      'module-store',
      'app',
    ],
    message: 'Components receive computed props; behavior lives in containers/hooks.',
  },
  {
    from: 'module-hooks',
    forbid: ['module-components', 'module-containers', 'app'],
    message: 'Hooks orchestrate data and state; they never reach into the view layer.',
  },
  {
    from: 'module-queries',
    forbid: ['module-components', 'module-containers', 'app'],
    message: 'Query files bind services to the cache; they never import view code.',
  },
  {
    from: 'module-services',
    forbid: [
      'module-components',
      'module-containers',
      'module-hooks',
      'module-store',
      'module-queries',
      'app',
    ],
    message: 'Services are pure API/use-case functions; React does not exist here.',
  },
  {
    from: 'module-gateway',
    forbid: [
      'module-components',
      'module-containers',
      'module-hooks',
      'module-store',
      'module-queries',
      'app',
    ],
    message: 'Gateways speak HTTP contracts only.',
  },
  {
    from: 'module-store',
    forbid: [
      'module-components',
      'module-containers',
      'module-services',
      'module-queries',
      'module-gateway',
      'app',
    ],
    message: 'Stores hold client global state only; server data belongs to the query cache.',
  },
  {
    from: 'module-containers',
    forbid: ['module-services', 'module-gateway', 'app'],
    message: 'Containers consume hooks/queries, never services directly.',
  },
  {
    from: ['module-utils', 'module-helpers', 'module-mappers', 'module-schemas'],
    forbid: [
      'module-components',
      'module-containers',
      'module-hooks',
      'module-queries',
      'module-services',
      'module-gateway',
      'module-store',
      'app',
    ],
    message: 'Pure logic layers depend only on types/constants/enums and other pure logic.',
  },
  {
    from: 'shared',
    forbid: [
      'module-root',
      'module-api',
      'module-gateway',
      'module-services',
      'module-queries',
      'module-store',
      'module-containers',
      'module-components',
      'module-hooks',
      'module-utils',
      'module-helpers',
      'module-mappers',
      'module-schemas',
      'module-types',
      'module-enums',
      'module-constants',
      'module-test',
      'app',
    ],
    message: 'Shared code is generic; it must never know about feature modules or routes.',
  },
  {
    from: 'packages',
    forbid: [
      'module-root',
      'module-api',
      'module-gateway',
      'module-services',
      'module-queries',
      'module-store',
      'module-containers',
      'module-components',
      'module-hooks',
      'module-utils',
      'module-helpers',
      'module-mappers',
      'module-schemas',
      'module-types',
      'module-enums',
      'module-constants',
      'module-test',
      'shared',
      'app',
    ],
    message: 'Package wrappers own one vendor and expose a facade; they sit below every layer.',
  },
];

export default [
  {
    files: ['src/**/*.{ts,tsx}'],
    plugins: {
      'frontend-architecture': frontendArchitecturePlugin,
    },
    rules: {
      'frontend-architecture/no-hooks-in-components': 'error',
      'frontend-architecture/no-inline-declarations': 'error',
      'frontend-architecture/no-inline-component-logic': 'error',
      'frontend-architecture/no-restricted-layer-imports': ['error', { policies: layerPolicies }],
      'frontend-architecture/no-cross-module-deep-imports': 'error',
      'frontend-architecture/no-process-env-outside-config': [
        'error',
        {
          allowedPrefixes: [
            'src/packages/env/',
            'src/shared/config/',
            'src/tests/setup/',
            'src/tests/e2e/',
            // The CSP proxy branches on NODE_ENV before the env facade exists.
            'src/proxy.ts',
          ],
        },
      ],
      'frontend-architecture/no-direct-browser-api-outside-packages': 'error',
      'frontend-architecture/no-inline-query-keys': 'error',
      'frontend-architecture/no-raw-i18n-text': 'error',
      'frontend-architecture/no-react-in-pure-layers': 'error',
      'frontend-architecture/no-inline-classname-outside-design-system': 'error',
      'frontend-architecture/require-client-component-reason': 'error',
      'frontend-architecture/no-server-only-import-in-client': 'error',
    },
  },
];
