/**
 * Rule: frontend-architecture/no-server-only-import-in-client
 *
 * Files marked `'use client'` must never import server-only code: the
 * `server-only` marker package, the server env facade, Node.js built-ins,
 * route handlers, or `.server.` suffixed modules. This keeps secrets and
 * server dependencies out of client bundles by construction.
 */

import { isNodeBuiltinImport } from '../shared/ast-utils.mjs';
import { resolveImportToSourcePath, isRouteHandlerFile } from '../shared/source-utils.mjs';

const FORBIDDEN_BARE_IMPORTS = new Set(['server-only']);
const SERVER_FACADE_PATTERNS = [/^src\/packages\/env\/server/, /\.server(\.|$)/];

export default {
  meta: {
    type: 'problem',
    docs: {
      description:
        "Files with 'use client' must not import server-only modules, Node built-ins, the server env facade, or route handlers.",
    },
    schema: [],
    messages: {
      serverImport:
        "Client file imports server-only module '{{source}}'. Move the server dependency behind a route handler or a server component boundary.",
    },
  },
  create(context) {
    let isClientFile = false;

    return {
      Program(node) {
        isClientFile = node.body.some(
          (statement) =>
            statement.type === 'ExpressionStatement' &&
            statement.expression.type === 'Literal' &&
            statement.expression.value === 'use client',
        );
      },
      ImportDeclaration(node) {
        if (!isClientFile) {
          return;
        }

        const specifier = String(node.source.value);

        if (FORBIDDEN_BARE_IMPORTS.has(specifier) || isNodeBuiltinImport(specifier)) {
          context.report({ node, messageId: 'serverImport', data: { source: specifier } });

          return;
        }

        const resolved = resolveImportToSourcePath(specifier, context.filename);

        if (!resolved) {
          return;
        }

        if (
          SERVER_FACADE_PATTERNS.some((pattern) => pattern.test(resolved)) ||
          isRouteHandlerFile(`${resolved}.ts`)
        ) {
          context.report({ node, messageId: 'serverImport', data: { source: specifier } });
        }
      },
    };
  },
};
