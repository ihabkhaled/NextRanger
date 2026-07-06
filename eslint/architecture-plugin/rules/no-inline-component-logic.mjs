/**
 * Rule: frontend-architecture/no-inline-component-logic
 *
 * `*.component.tsx` files render already-computed props. Any behavior —
 * handlers, list transforms, date/format logic, config objects, nested
 * branching — belongs in hooks, helpers, mappers, or constants.
 */

import { getSourcePath, isComponentFile, toPosixPath } from '../shared/source-utils.mjs';

const TRANSFORM_METHODS = new Set(['map', 'filter', 'reduce', 'sort', 'flatMap', 'forEach']);

function isInsideJsxAttribute(node) {
  let current = node.parent;

  while (current) {
    if (current.type === 'JSXAttribute') {
      return true;
    }

    if (current.type === 'JSXElement' || current.type === 'JSXFragment') {
      return false;
    }

    current = current.parent;
  }

  return false;
}

function isInsideJsxTree(node) {
  let current = node.parent;

  while (current) {
    if (['JSXElement', 'JSXFragment', 'JSXAttribute'].includes(current.type)) {
      return true;
    }

    current = current.parent;
  }

  return false;
}

export default {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Component files must not contain handlers, transforms, config literals, nested ternaries, or date/format/regex logic.',
    },
    schema: [],
    messages: {
      inlineFunction:
        'Components must not define functions. Pass handlers down from the container as props.',
      inlineHandler:
        'JSX props must not receive inline functions. Pass a prepared handler prop from the container.',
      inlineTransform:
        "Do not call '.{{method}}()' inside JSX. Transform data in a hook/helper/mapper and pass the result as a prop.",
      nestedTernary:
        'Nested ternaries are forbidden in components. Compute the branch in a helper and pass a simple prop.',
      inlineComputation:
        'Do not use {{what}} inside JSX. Compute this in a helper/mapper and pass it as a prop.',
      inlineConfigObject:
        'JSX props must not receive inline object/array literals. Move the value to a constants/ file or compute it upstream.',
    },
  },
  create(context) {
    const sourcePath = getSourcePath(toPosixPath(context.filename));

    if (!isComponentFile(sourcePath)) {
      return {};
    }

    return {
      FunctionDeclaration(node) {
        if (node.parent.type !== 'Program' && node.parent.type !== 'ExportNamedDeclaration') {
          context.report({ node, messageId: 'inlineFunction' });
        }
      },
      'JSXAttribute > JSXExpressionContainer > ArrowFunctionExpression'(node) {
        context.report({ node, messageId: 'inlineHandler' });
      },
      'JSXAttribute > JSXExpressionContainer > FunctionExpression'(node) {
        context.report({ node, messageId: 'inlineHandler' });
      },
      CallExpression(node) {
        if (
          isInsideJsxTree(node) &&
          node.callee.type === 'MemberExpression' &&
          node.callee.property.type === 'Identifier' &&
          TRANSFORM_METHODS.has(node.callee.property.name)
        ) {
          context.report({
            node,
            messageId: 'inlineTransform',
            data: { method: node.callee.property.name },
          });
        }
      },
      ConditionalExpression(node) {
        if (
          node.parent.type === 'ConditionalExpression' ||
          node.consequent.type === 'ConditionalExpression' ||
          node.alternate.type === 'ConditionalExpression'
        ) {
          context.report({ node, messageId: 'nestedTernary' });
        }
      },
      NewExpression(node) {
        if (node.callee.type === 'Identifier' && node.callee.name === 'Date') {
          context.report({ node, messageId: 'inlineComputation', data: { what: 'new Date()' } });
        }
      },
      MemberExpression(node) {
        if (node.object.type === 'Identifier' && node.object.name === 'Intl') {
          context.report({ node, messageId: 'inlineComputation', data: { what: 'Intl.*' } });
        }
      },
      Literal(node) {
        if (node.regex && isInsideJsxTree(node)) {
          context.report({
            node,
            messageId: 'inlineComputation',
            data: { what: 'a regex literal' },
          });
        }
      },
      ObjectExpression(node) {
        if (isInsideJsxAttribute(node)) {
          context.report({ node, messageId: 'inlineConfigObject' });
        }
      },
      ArrayExpression(node) {
        if (isInsideJsxAttribute(node)) {
          context.report({ node, messageId: 'inlineConfigObject' });
        }
      },
    };
  },
};
