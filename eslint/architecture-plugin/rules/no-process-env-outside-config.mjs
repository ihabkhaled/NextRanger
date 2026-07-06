/**
 * Rule: frontend-architecture/no-process-env-outside-config
 *
 * Raw `process.env` access is only allowed inside the validated env facade
 * (`src/packages/env/`), shared config, and build/test configuration files.
 * Everything else consumes the parsed `publicEnv` / `serverEnv` objects, so a
 * missing or malformed variable fails fast at startup instead of surfacing as
 * `undefined` deep inside a feature.
 */

import { getSourcePath, isUnderAny, toPosixPath } from '../shared/source-utils.mjs';

const DEFAULT_ALLOWED_PREFIXES = [
  'src/packages/env/',
  'src/shared/config/',
  'src/tests/setup/',
  'src/tests/e2e/',
];

export default {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Raw process.env access is only allowed inside the env facade and configuration files.',
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
      rawEnv:
        'Do not read process.env here. Import publicEnv/serverEnv from @/packages/env so values are validated once at the boundary.',
    },
  },
  create(context) {
    const options = context.options[0] ?? {};
    const allowedPrefixes = options.allowedPrefixes ?? DEFAULT_ALLOWED_PREFIXES;
    const posixFilename = toPosixPath(context.filename);
    const sourcePath = getSourcePath(posixFilename);

    if (!sourcePath) {
      return {};
    }

    if (isUnderAny(sourcePath, allowedPrefixes)) {
      return {};
    }

    return {
      MemberExpression(node) {
        if (
          node.object.type === 'Identifier' &&
          node.object.name === 'process' &&
          ((node.property.type === 'Identifier' && node.property.name === 'env') ||
            (node.property.type === 'Literal' && node.property.value === 'env'))
        ) {
          context.report({ node, messageId: 'rawEnv' });
        }
      },
    };
  },
};
