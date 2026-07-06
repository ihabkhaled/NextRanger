/**
 * Rule: frontend-architecture/no-raw-i18n-text
 *
 * User-facing copy must flow through i18n message keys. Component files must
 * not contain raw text in JSX or user-facing string props — every visible
 * string is a translated message passed down as a prop or resolved via the
 * i18n facade.
 */

import {
  getSourcePath,
  isComponentFile,
  isTestFile,
  toPosixPath,
} from '../shared/source-utils.mjs';

/** Attributes whose string values are never user-facing copy. */
const NON_COPY_ATTRIBUTES = new Set([
  'className',
  'id',
  'name',
  'type',
  'htmlFor',
  'href',
  'rel',
  'target',
  'src',
  'srcSet',
  'sizes',
  'width',
  'height',
  'loading',
  'decoding',
  'dir',
  'lang',
  'role',
  'autoComplete',
  'inputMode',
  'method',
  'action',
  'form',
  'key',
  'tabIndex',
  'download',
  'referrerPolicy',
  'crossOrigin',
  'fetchPriority',
  'defaultValue',
  'value',
  'charSet',
  'content',
  'as',
  'variant',
  'size',
  'tone',
  'align',
  'justify',
  'gap',
  'direction',
  'wrap',
  'testId',
]);

function hasLetters(text) {
  return /\p{L}/u.test(text);
}

export default {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Components must not contain raw user-facing text; every visible string is an i18n message resolved upstream.',
    },
    schema: [],
    messages: {
      rawText:
        'Raw user-facing text is forbidden in components. Resolve an i18n message key upstream and pass the translated string as a prop.',
      rawAttribute:
        "Raw user-facing text in the '{{attribute}}' prop is forbidden. Pass a translated message or an imported constant.",
    },
  },
  create(context) {
    const sourcePath = getSourcePath(toPosixPath(context.filename));

    if (!isComponentFile(sourcePath) || isTestFile(sourcePath)) {
      return {};
    }

    return {
      JSXText(node) {
        if (hasLetters(node.value)) {
          context.report({ node, messageId: 'rawText' });
        }
      },
      JSXAttribute(node) {
        if (node.name.type !== 'JSXIdentifier') {
          return;
        }

        const attributeName = node.name.name;

        if (NON_COPY_ATTRIBUTES.has(attributeName) || attributeName.startsWith('data-')) {
          return;
        }

        if (
          node.value &&
          node.value.type === 'Literal' &&
          typeof node.value.value === 'string' &&
          hasLetters(node.value.value)
        ) {
          context.report({
            node: node.value,
            messageId: 'rawAttribute',
            data: { attribute: attributeName },
          });
        }
      },
    };
  },
};
