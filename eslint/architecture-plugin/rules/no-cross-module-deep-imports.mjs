/**
 * Rule: frontend-architecture/no-cross-module-deep-imports
 *
 * A feature module is a black box. Other code may import it only through its
 * public surface `@/modules/<feature>` (the module index.ts). Deep imports
 * into another module's internals are forbidden. Inside the same module,
 * relative imports are the canonical style.
 */

import {
  getModuleName,
  getSourcePath,
  resolveImportToSourcePath,
  toPosixPath,
} from '../shared/source-utils.mjs';

export default {
  meta: {
    type: 'problem',
    docs: {
      description:
        "Modules may only be imported through their public surface '@/modules/<feature>'.",
    },
    schema: [],
    messages: {
      deepImport:
        "Deep import into module '{{module}}' internals is forbidden. Import from '@/modules/{{module}}' — its index.ts decides what is public.",
    },
  },
  create(context) {
    const importerSource = getSourcePath(toPosixPath(context.filename));

    if (!importerSource) {
      return {};
    }

    const importerModule = getModuleName(importerSource);

    return {
      ImportDeclaration(node) {
        const resolved = resolveImportToSourcePath(String(node.source.value), context.filename);

        if (!resolved) {
          return;
        }

        const targetModule = getModuleName(`${resolved}/`);

        if (!targetModule || targetModule === importerModule) {
          return;
        }

        const moduleRoot = `src/modules/${targetModule}`;
        const isPublicSurface = [moduleRoot, `${moduleRoot}/`, `${moduleRoot}/index`].includes(
          resolved,
        );

        if (!isPublicSurface) {
          context.report({ node, messageId: 'deepImport', data: { module: targetModule } });
        }
      },
    };
  },
};
