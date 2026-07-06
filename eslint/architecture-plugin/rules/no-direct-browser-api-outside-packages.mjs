/**
 * Rule: frontend-architecture/no-direct-browser-api-outside-packages
 *
 * Direct access to browser globals (window, document, localStorage,
 * sessionStorage, navigator, matchMedia, crypto) is only allowed inside the
 * owning wrappers `src/packages/browser/` and `src/packages/storage/`. App
 * code consumes the safe facades, which handle SSR absence, availability
 * checks, and JSON (de)serialization in one reviewed place.
 *
 * Uses scope analysis: only unresolved (truly global) references are
 * reported, so local variables named `document` etc. do not false-positive.
 */

import { getSourcePath, isTestFile, isUnderAny, toPosixPath } from '../shared/source-utils.mjs';

const BROWSER_GLOBALS = new Set([
  'window',
  'document',
  'localStorage',
  'sessionStorage',
  'navigator',
  'matchMedia',
  'crypto',
]);

const DEFAULT_ALLOWED_PREFIXES = ['src/packages/browser/', 'src/packages/storage/', 'src/proxy.ts'];

export default {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Browser globals may only be touched inside src/packages/browser and src/packages/storage wrappers.',
    },
    schema: [
      {
        type: 'object',
        properties: {
          allowedPrefixes: { type: 'array', items: { type: 'string' } },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      rawBrowserApi:
        "Do not access '{{name}}' directly. Use the safe facade from @/packages/browser or @/packages/storage (SSR-safe, reviewed in one place).",
    },
  },
  create(context) {
    const options = context.options[0] ?? {};
    const allowedPrefixes = options.allowedPrefixes ?? DEFAULT_ALLOWED_PREFIXES;
    const sourcePath = getSourcePath(toPosixPath(context.filename));

    if (!sourcePath || isTestFile(sourcePath) || isUnderAny(sourcePath, allowedPrefixes)) {
      return {};
    }

    return {
      'Program:exit'(node) {
        const scope = context.sourceCode.getScope(node);
        const globalScope = scope.type === 'global' ? scope : (scope.upper ?? scope);

        for (const reference of globalScope.through) {
          const name = reference.identifier.name;

          if (BROWSER_GLOBALS.has(name)) {
            context.report({
              node: reference.identifier,
              messageId: 'rawBrowserApi',
              data: { name },
            });
          }
        }
      },
    };
  },
};
