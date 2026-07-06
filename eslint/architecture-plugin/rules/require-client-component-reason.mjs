/**
 * Rule: frontend-architecture/require-client-component-reason
 *
 * Server Components are the default. Every `'use client'` boundary must
 * justify itself with a specific reason comment on the line directly below
 * the directive:
 *
 *   'use client';
 *   // client-boundary-reason: uses interactive form state through a container hook.
 *
 * Generic reasons ("needed", "required", "client") are rejected.
 */

const REASON_MARKER = 'client-boundary-reason:';
const MIN_REASON_LENGTH = 15;
const GENERIC_REASONS = new Set(['needed', 'required', 'client', 'interactivity', 'hooks']);

export default {
  meta: {
    type: 'problem',
    docs: {
      description:
        "Every 'use client' directive requires a specific client-boundary-reason comment on the next line.",
    },
    schema: [],
    messages: {
      missingReason:
        "'use client' requires a '// client-boundary-reason: <specific reason>' comment on the next line.",
      genericReason:
        'The client-boundary-reason must be specific (what interactivity forces this boundary?), not a generic word.',
    },
  },
  create(context) {
    return {
      Program(node) {
        const directive = node.body.find(
          (statement) =>
            statement.type === 'ExpressionStatement' &&
            statement.expression.type === 'Literal' &&
            statement.expression.value === 'use client',
        );

        if (!directive) {
          return;
        }

        const directiveLine = directive.loc.end.line;
        const comment = context.sourceCode
          .getAllComments()
          .find((candidate) => candidate.loc.start.line === directiveLine + 1);

        if (!comment || !comment.value.includes(REASON_MARKER)) {
          context.report({ node: directive, messageId: 'missingReason' });

          return;
        }

        const reason = comment.value.split(REASON_MARKER)[1]?.trim() ?? '';

        if (reason.length < MIN_REASON_LENGTH || GENERIC_REASONS.has(reason.toLowerCase())) {
          context.report({ node: directive, messageId: 'genericReason' });
        }
      },
    };
  },
};
