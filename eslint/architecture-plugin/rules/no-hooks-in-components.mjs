/**
 * Rule: frontend-architecture/no-hooks-in-components
 *
 * `*.component.tsx` files are TSX-only. They must never call React hooks or
 * custom hooks, and must never import from hooks/queries/store/services/gateway
 * layers. Behavior belongs in containers and hook files.
 */

import { isHookName, REACT_BUILTIN_HOOKS } from '../shared/ast-utils.mjs';
import { getSourcePath, isComponentFile, toPosixPath } from '../shared/source-utils.mjs';

const FORBIDDEN_IMPORT_SEGMENTS = [
  '/hooks/',
  '.hook',
  '/queries/',
  '/store/',
  '/services/',
  '/gateway/',
];

export default {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Presentational *.component.tsx files must stay TSX-only: no React hooks, no custom hooks, no hooks/queries/store/services/gateway imports.',
    },
    schema: [],
    messages: {
      hookCall:
        "Component files must not call hooks ('{{name}}'). Move behavior into a container or a hooks/ file.",
      hookImport:
        "Component files must not import '{{source}}'. Components receive already-computed props from containers.",
    },
  },
  create(context) {
    const sourcePath = getSourcePath(toPosixPath(context.filename));

    if (!isComponentFile(sourcePath)) {
      return {};
    }

    return {
      CallExpression(node) {
        if (node.callee.type === 'Identifier' && isHookName(node.callee.name)) {
          context.report({ node, messageId: 'hookCall', data: { name: node.callee.name } });
        }

        if (
          node.callee.type === 'MemberExpression' &&
          node.callee.property.type === 'Identifier' &&
          (isHookName(node.callee.property.name) ||
            REACT_BUILTIN_HOOKS.has(node.callee.property.name))
        ) {
          context.report({
            node,
            messageId: 'hookCall',
            data: { name: node.callee.property.name },
          });
        }
      },
      ImportDeclaration(node) {
        const source = String(node.source.value);

        if (FORBIDDEN_IMPORT_SEGMENTS.some((segment) => source.includes(segment))) {
          context.report({ node, messageId: 'hookImport', data: { source } });

          return;
        }

        if (source === 'react') {
          for (const specifier of node.specifiers) {
            if (
              specifier.type === 'ImportSpecifier' &&
              specifier.imported.type === 'Identifier' &&
              REACT_BUILTIN_HOOKS.has(specifier.imported.name)
            ) {
              context.report({ node: specifier, messageId: 'hookImport', data: { source } });
            }
          }
        }
      },
    };
  },
};
