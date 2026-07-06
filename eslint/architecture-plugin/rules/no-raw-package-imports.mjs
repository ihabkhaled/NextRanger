/**
 * Rule: frontend-architecture/no-raw-package-imports
 *
 * Every third-party vendor has exactly one owning wrapper under
 * `src/packages/<owner>/`. App code consumes the app-owned facade, never the
 * vendor directly. The ownership map lives in
 * eslint/package-boundaries.config.mjs.
 */

import {
  getPackageName,
  getSourcePath,
  isBarePackageImport,
  isTestFile,
  isUnderAny,
  toPosixPath,
} from '../shared/source-utils.mjs';

export default {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Third-party packages may only be imported inside their owning src/packages/<owner>/ wrapper.',
    },
    schema: [
      {
        type: 'object',
        properties: {
          boundaries: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                package: { type: 'string' },
                matchSubpaths: { type: 'boolean' },
                owners: { type: 'array', items: { type: 'string' } },
                allowInTests: { type: 'boolean' },
              },
              required: ['package', 'owners'],
              additionalProperties: false,
            },
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      rawImport:
        "Import '{{package}}' only inside its owner wrapper ({{owners}}). Use the app-owned facade instead — see context/package-boundaries.md.",
    },
  },
  create(context) {
    const options = context.options[0] ?? {};
    const boundaries = options.boundaries ?? [];
    const sourcePath = getSourcePath(toPosixPath(context.filename));

    if (!sourcePath || boundaries.length === 0) {
      return {};
    }

    const inTestFile = isTestFile(sourcePath);

    return {
      ImportDeclaration(node) {
        const specifier = String(node.source.value);

        if (!isBarePackageImport(specifier)) {
          return;
        }

        const packageName = getPackageName(specifier);

        for (const boundary of boundaries) {
          const matches =
            boundary.matchSubpaths === false
              ? specifier === boundary.package
              : packageName === boundary.package;

          if (!matches) {
            continue;
          }

          if (inTestFile && boundary.allowInTests === true) {
            return;
          }

          if (isUnderAny(sourcePath, boundary.owners)) {
            return;
          }

          context.report({
            node,
            messageId: 'rawImport',
            data: {
              package: packageName,
              owners: boundary.owners.join(', '),
            },
          });

          return;
        }
      },
    };
  },
};
