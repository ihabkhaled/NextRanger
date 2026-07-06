/**
 * Rule: frontend-architecture/no-inline-query-keys
 *
 * TanStack Query keys are cache addresses. Inline array literals fragment the
 * cache and break invalidation. Keys must come from a `*query-keys.ts`
 * builder file (e.g. `articleQueryKeys.list(params)`).
 */

import {
  getSourcePath,
  isQueryKeysFile,
  isTestFile,
  toPosixPath,
} from '../shared/source-utils.mjs';

const QUERY_KEY_PROPERTIES = new Set(['queryKey', 'mutationKey']);

export default {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Query and mutation keys must come from query-key builder files, never inline array literals.',
    },
    schema: [],
    messages: {
      inlineKey:
        "Inline {{property}} arrays are forbidden. Use a builder from the module's *query-keys.ts file so invalidation stays exact.",
    },
  },
  create(context) {
    const sourcePath = getSourcePath(toPosixPath(context.filename));

    if (!sourcePath || isQueryKeysFile(sourcePath) || isTestFile(sourcePath)) {
      return {};
    }

    return {
      Property(node) {
        if (
          node.key.type === 'Identifier' &&
          QUERY_KEY_PROPERTIES.has(node.key.name) &&
          node.value.type === 'ArrayExpression'
        ) {
          context.report({
            node: node.value,
            messageId: 'inlineKey',
            data: { property: node.key.name },
          });
        }
      },
    };
  },
};
