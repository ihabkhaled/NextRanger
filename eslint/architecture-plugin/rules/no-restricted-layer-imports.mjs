/**
 * Rule: frontend-architecture/no-restricted-layer-imports
 *
 * Config-driven one-way dependency enforcement between architecture layers.
 * The policy table lives in eslint/architecture.config.mjs so the rule itself
 * stays generic and reusable.
 */

import {
  classifySourcePath,
  classifyContextFile,
  findViolatedPolicy,
} from '../shared/policy-utils.mjs';
import { resolveImportToSourcePath, isTestFile } from '../shared/source-utils.mjs';

export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'Enforce one-way dependencies between architecture layers.',
    },
    schema: [
      {
        type: 'object',
        properties: {
          policies: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                from: {
                  anyOf: [{ type: 'string' }, { type: 'array', items: { type: 'string' } }],
                },
                forbid: { type: 'array', items: { type: 'string' } },
                allowIn: { type: 'array', items: { type: 'string' } },
                sameModuleOnly: { type: 'boolean' },
                message: { type: 'string' },
              },
              required: ['from', 'forbid'],
              additionalProperties: false,
            },
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      restricted: "Layer '{{fromLayer}}' must not import layer '{{toLayer}}'. {{explanation}}",
    },
  },
  create(context) {
    const options = context.options[0] ?? {};
    const policies = options.policies ?? [];
    const importer = classifyContextFile(context);

    if (!importer.sourcePath || isTestFile(importer.sourcePath) || policies.length === 0) {
      return {};
    }

    return {
      ImportDeclaration(node) {
        const resolved = resolveImportToSourcePath(String(node.source.value), context.filename);

        if (!resolved) {
          return;
        }

        if (node.importKind === 'type') {
          return;
        }

        const imported = classifySourcePath(resolved);
        const violated = findViolatedPolicy({ policies, importer, imported });

        if (violated) {
          context.report({
            node,
            messageId: 'restricted',
            data: {
              fromLayer: importer.layer,
              toLayer: imported.layer,
              explanation: violated.message ?? 'See rules/01-next-app-router-architecture.md.',
            },
          });
        }
      },
    };
  },
};
