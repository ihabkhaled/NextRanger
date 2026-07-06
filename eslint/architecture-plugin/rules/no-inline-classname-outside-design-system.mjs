/**
 * Rule: frontend-architecture/no-inline-classname-outside-design-system
 *
 * Raw `className="..."` string literals are only allowed inside design-system
 * primitives and dedicated style/variant files. Everywhere else, class
 * bundles come from imported variants/constants so visual language stays
 * consistent and reviewable in one place.
 */

import { getSourcePath, isTestFile, isUnderAny, toPosixPath } from '../shared/source-utils.mjs';

const DEFAULT_ALLOWED_PREFIXES = [
  'src/shared/components/primitives/',
  'src/packages/ui-primitives/',
];

function isStyleFile(sourcePath) {
  return /\.(?:styles|variants)\.ts$/.test(sourcePath ?? '');
}

export default {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Raw className strings are only allowed in design-system primitives and *.styles.ts / *.variants.ts files.',
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
      rawClassName:
        'Raw className strings are forbidden here. Import a variant/constant from the design system or a *.variants.ts file.',
    },
  },
  create(context) {
    const options = context.options[0] ?? {};
    const allowedPrefixes = options.allowedPrefixes ?? DEFAULT_ALLOWED_PREFIXES;
    const sourcePath = getSourcePath(toPosixPath(context.filename));

    if (
      !sourcePath ||
      isTestFile(sourcePath) ||
      isStyleFile(sourcePath) ||
      isUnderAny(sourcePath, allowedPrefixes)
    ) {
      return {};
    }

    return {
      JSXAttribute(node) {
        if (node.name.type !== 'JSXIdentifier' || node.name.name !== 'className') {
          return;
        }

        if (node.value && node.value.type === 'Literal' && typeof node.value.value === 'string') {
          context.report({ node: node.value, messageId: 'rawClassName' });

          return;
        }

        if (
          node.value &&
          node.value.type === 'JSXExpressionContainer' &&
          node.value.expression.type === 'TemplateLiteral'
        ) {
          context.report({ node: node.value, messageId: 'rawClassName' });
        }
      },
    };
  },
};
