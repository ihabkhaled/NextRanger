/**
 * Rule: frontend-architecture/no-inline-declarations
 *
 * Layered implementation files (components, containers, hooks, services,
 * gateways, queries, mutations, utils, helpers, mappers, route handlers, and
 * other App Router implementation files under src/app/.../*.ts) must not declare
 * module-level types, interfaces, enums, or non-function constants. Those
 * declarations live in the types/, enums/, and constants/ layers so they can be
 * shared, tested, and reviewed in one place.
 *
 * Component files are additionally forbidden from declaring anything inside
 * the component body: a component receives props and returns TSX.
 *
 * Hooks, utils, helpers, mappers, and App Router route helpers must not keep
 * local helper functions inline: a non-exported module-level function or an
 * inline parameter/return type literal is a declaration that belongs in its own
 * typed file.
 */

import { isFunctionValue } from '../shared/ast-utils.mjs';
import {
  getSourcePath,
  isAppRouteFile,
  isComponentFile,
  isContainerFile,
  isGatewayFile,
  isHookImplementationFile,
  isPureLogicFile,
  isQueryFile,
  isRouteHandlerFile,
  isServiceFile,
  isTestFile,
  toPosixPath,
} from '../shared/source-utils.mjs';

const APPROVED_CONST_NAMES = new Set(['LOG_PREFIX']);

function isTargetFile(sourcePath) {
  return (
    isComponentFile(sourcePath) ||
    isContainerFile(sourcePath) ||
    isHookImplementationFile(sourcePath) ||
    isServiceFile(sourcePath) ||
    isGatewayFile(sourcePath) ||
    isQueryFile(sourcePath) ||
    isPureLogicFile(sourcePath) ||
    isRouteHandlerFile(sourcePath) ||
    isAppRouteFile(sourcePath)
  );
}

function isExportedFunction(node) {
  return (
    node.parent.type === 'ExportNamedDeclaration' ||
    (node.parent.type === 'ExportDefaultDeclaration' && node.parent.declaration === node)
  );
}

function isHookFunction(node) {
  return node.id && node.id.type === 'Identifier' && /^use[A-Z0-9]/.test(node.id.name);
}

export default {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Implementation layers must not declare inline types/interfaces/enums/constants or local helper functions; move declarations to types/, enums/, constants/, or helper files.',
    },
    schema: [],
    messages: {
      inlineType:
        'Move this {{kind}} into the types/ (or enums/) layer. Implementation files must not declare shapes inline.',
      inlineConst:
        "Move module-level constant '{{name}}' into a constants/ file. Implementation files must not embed configuration values.",
      inlineTypeLiteral:
        'Move this inline type/interface literal into the types/ layer as a named type. Function signatures in implementation files must import their shapes.',
      localHelperFunction:
        "Move this local function '{{name}}' into a dedicated utils/, helpers/, or mappers/ file. Implementation files must not embed private helpers.",
      componentBodyDeclaration:
        'Component bodies must not declare variables or functions. Compute values in the container/hook and pass them as props.',
    },
  },
  create(context) {
    const sourcePath = getSourcePath(toPosixPath(context.filename));

    if (!sourcePath || isTestFile(sourcePath) || !isTargetFile(sourcePath)) {
      return {};
    }

    const componentFile = isComponentFile(sourcePath);
    const hookFile = isHookImplementationFile(sourcePath);
    const pureLogicFile = isPureLogicFile(sourcePath);
    const routeHandlerFile = isRouteHandlerFile(sourcePath);
    const appRouteFile = isAppRouteFile(sourcePath);

    function checkModuleLevelConst(node) {
      if (node.kind !== 'const') {
        return;
      }

      for (const declaration of node.declarations) {
        if (isFunctionValue(declaration.init)) {
          continue;
        }

        if (declaration.init && declaration.init.type === 'CallExpression') {
          continue;
        }

        const name = declaration.id.type === 'Identifier' ? declaration.id.name : '(pattern)';

        if (APPROVED_CONST_NAMES.has(name)) {
          continue;
        }

        context.report({ node: declaration, messageId: 'inlineConst', data: { name } });
      }
    }

    function checkLocalFunction(node) {
      if (!node.id || node.id.type !== 'Identifier') {
        return;
      }

      const name = node.id.name;

      if (componentFile) {
        // Only the exported component function is allowed in a component file.
        if (!isExportedFunction(node)) {
          context.report({ node, messageId: 'localHelperFunction', data: { name } });
        }

        return;
      }

      if (hookFile) {
        // Only the exported hook function is allowed in a hook file.
        if (!isExportedFunction(node) || !isHookFunction(node)) {
          context.report({ node, messageId: 'localHelperFunction', data: { name } });
        }

        return;
      }

      if (pureLogicFile && !isExportedFunction(node)) {
        // Pure logic files must export every function so tests can call it.
        context.report({ node, messageId: 'localHelperFunction', data: { name } });
        return;
      }

      if (appRouteFile && !routeHandlerFile && !isExportedFunction(node)) {
        // App Router implementation files (route helpers, middleware proxies, etc.)
        // must export every function so the route handler can delegate to them.
        context.report({ node, messageId: 'localHelperFunction', data: { name } });
      }
    }

    return {
      TSEnumDeclaration(node) {
        context.report({ node, messageId: 'inlineType', data: { kind: 'enum' } });
      },
      'Program > TSInterfaceDeclaration'(node) {
        context.report({ node, messageId: 'inlineType', data: { kind: 'interface' } });
      },
      'Program > ExportNamedDeclaration > TSInterfaceDeclaration'(node) {
        context.report({ node, messageId: 'inlineType', data: { kind: 'interface' } });
      },
      'Program > TSTypeAliasDeclaration'(node) {
        context.report({ node, messageId: 'inlineType', data: { kind: 'type alias' } });
      },
      'Program > ExportNamedDeclaration > TSTypeAliasDeclaration'(node) {
        context.report({ node, messageId: 'inlineType', data: { kind: 'type alias' } });
      },
      'Program > VariableDeclaration'(node) {
        checkModuleLevelConst(node);
      },
      'Program > ExportNamedDeclaration > VariableDeclaration'(node) {
        checkModuleLevelConst(node);
      },
      'Program > FunctionDeclaration'(node) {
        checkLocalFunction(node);
      },
      'Program > ExportNamedDeclaration > FunctionDeclaration'(node) {
        checkLocalFunction(node);
      },
      TSTypeLiteral(node) {
        // Route handlers receive framework-defined context shapes from Next.js;
        // requiring a named type for every handler signature would be noise.
        if (routeHandlerFile) {
          return;
        }

        // Allow type literals inside proper type declarations (type aliases,
        // interfaces, enum-like objects). Everything else is an inline shape.
        let current = node.parent;

        while (current) {
          if (
            current.type === 'TSTypeAliasDeclaration' ||
            current.type === 'TSInterfaceDeclaration' ||
            current.type === 'TSEnumDeclaration' ||
            (current.type === 'VariableDeclarator' && current.init)
          ) {
            return;
          }

          current = current.parent;
        }

        context.report({ node, messageId: 'inlineTypeLiteral' });
      },
      ...(componentFile
        ? {
            'FunctionDeclaration BlockStatement > VariableDeclaration'(node) {
              context.report({ node, messageId: 'componentBodyDeclaration' });
            },
            'ArrowFunctionExpression BlockStatement > VariableDeclaration'(node) {
              context.report({ node, messageId: 'componentBodyDeclaration' });
            },
            'FunctionExpression BlockStatement > VariableDeclaration'(node) {
              context.report({ node, messageId: 'componentBodyDeclaration' });
            },
          }
        : {}),
    };
  },
};
