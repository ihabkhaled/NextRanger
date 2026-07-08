import path from 'node:path';

import { ESLint } from 'eslint';
import tseslint from 'typescript-eslint';
import { describe, expect, it } from 'vitest';

import { frontendArchitecturePlugin } from '../../../eslint/architecture-plugin.mjs';

const repoRoot = path.resolve(import.meta.dirname, '../../..');
const fixturesRoot = path.join(repoRoot, 'eslint/architecture-plugin/__fixtures__/invalid');

/**
 * Lints the deliberate-violation fixtures with ONLY the custom plugin rules
 * (syntax-level parsing, no type information needed) and asserts each fixture
 * triggers the rules it was written to violate.
 */
function createHarness(): ESLint {
  return new ESLint({
    cwd: repoRoot,
    ignore: false,
    overrideConfigFile: true,
    overrideConfig: [
      {
        files: ['**/*.{ts,tsx}'],
        languageOptions: {
          parser: tseslint.parser,
          parserOptions: {
            ecmaFeatures: { jsx: true },
          },
        },
        plugins: {
          'frontend-architecture': frontendArchitecturePlugin,
        },
        rules: {
          'frontend-architecture/no-hooks-in-components': 'error',
          'frontend-architecture/no-inline-declarations': 'error',
          'frontend-architecture/no-inline-component-logic': 'error',
          'frontend-architecture/no-raw-i18n-text': 'error',
          'frontend-architecture/no-inline-classname-outside-design-system': 'error',
          'frontend-architecture/no-cross-module-deep-imports': 'error',
          'frontend-architecture/no-process-env-outside-config': 'error',
          'frontend-architecture/no-direct-browser-api-outside-packages': 'error',
          'frontend-architecture/no-inline-query-keys': 'error',
          'frontend-architecture/no-react-in-pure-layers': 'error',
          'frontend-architecture/require-client-component-reason': 'error',
          'frontend-architecture/no-server-only-import-in-client': 'error',
          'frontend-architecture/no-raw-package-imports': [
            'error',
            { boundaries: [{ package: 'axios', owners: ['src/packages/axios/'] }] },
          ],
          'frontend-architecture/no-restricted-layer-imports': [
            'error',
            {
              policies: [
                {
                  from: 'module-services',
                  forbid: ['module-components'],
                  message: 'Services never import view code.',
                },
              ],
            },
          ],
        },
      },
    ],
  });
}

async function ruleIdsFor(relativeFixturePath: string): Promise<Set<string>> {
  const harness = createHarness();
  const results = await harness.lintFiles([path.join(fixturesRoot, relativeFixturePath)]);
  const ruleIds = new Set<string>();

  for (const result of results) {
    for (const message of result.messages) {
      if (message.ruleId) {
        ruleIds.add(message.ruleId);
      }

      // A parsing error would silently hide rule findings — fail loudly.
      expect(message.fatal ?? false).toBe(false);
    }
  }

  return ruleIds;
}

describe('frontend-architecture rules against deliberate violations', () => {
  it('flags the component fixture for hooks, inline declarations, logic, copy, and classes', async () => {
    const ruleIds = await ruleIdsFor('src/modules/demo/components/bad-article-card.component.tsx');

    expect(ruleIds).toContain('frontend-architecture/no-hooks-in-components');
    expect(ruleIds).toContain('frontend-architecture/no-inline-declarations');
    expect(ruleIds).toContain('frontend-architecture/no-inline-component-logic');
    expect(ruleIds).toContain('frontend-architecture/no-raw-i18n-text');
    expect(ruleIds).toContain('frontend-architecture/no-inline-classname-outside-design-system');
  });

  it('flags the service fixture for raw vendors, deep imports, env, browser APIs, and layering', async () => {
    const ruleIds = await ruleIdsFor('src/modules/demo/services/bad-article.service.ts');

    expect(ruleIds).toContain('frontend-architecture/no-raw-package-imports');
    expect(ruleIds).toContain('frontend-architecture/no-cross-module-deep-imports');
    expect(ruleIds).toContain('frontend-architecture/no-process-env-outside-config');
    expect(ruleIds).toContain('frontend-architecture/no-direct-browser-api-outside-packages');
    expect(ruleIds).toContain('frontend-architecture/no-inline-declarations');
    expect(ruleIds).toContain('frontend-architecture/no-restricted-layer-imports');
  });

  it('flags the client-page fixture for missing boundary reason, server imports, and inline keys', async () => {
    const ruleIds = await ruleIdsFor('src/app/bad-client-page.tsx');

    expect(ruleIds).toContain('frontend-architecture/require-client-component-reason');
    expect(ruleIds).toContain('frontend-architecture/no-server-only-import-in-client');
    expect(ruleIds).toContain('frontend-architecture/no-inline-query-keys');
  });

  it('flags the React-in-service fixture for importing react into a pure layer', async () => {
    const ruleIds = await ruleIdsFor('src/modules/demo/services/bad-article-with-react.service.ts');

    expect(ruleIds).toContain('frontend-architecture/no-react-in-pure-layers');
  });

  it('flags the app route helper fixture for inline constants and local functions', async () => {
    const ruleIds = await ruleIdsFor('src/app/bad-gateway-handler.ts');

    expect(ruleIds).toContain('frontend-architecture/no-inline-declarations');
  });
});
