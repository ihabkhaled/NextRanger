/**
 * Layer-policy helpers: classify files/imports into architecture layers and
 * evaluate config-driven `{ from, forbid, allowIn, message }` policies.
 */

import { getModuleName, getSourcePath, toPosixPath } from './source-utils.mjs';

/**
 * Classify a project source path into an architecture layer id.
 *
 * Layer ids:
 *   app, module-api, module-gateway, module-services, module-queries,
 *   module-store, module-containers, module-components, module-hooks,
 *   module-utils, module-helpers, module-mappers, module-schemas,
 *   module-types, module-enums, module-constants, module-test, module-root,
 *   shared, packages, tests, proxy, unknown
 */
export function classifySourcePath(sourcePath) {
  if (!sourcePath || !sourcePath.startsWith('src/')) {
    return { layer: 'unknown', moduleName: null };
  }

  const path = sourcePath;

  if (path === 'src/proxy.ts') {
    return { layer: 'proxy', moduleName: null };
  }

  if (path.startsWith('src/app/')) {
    return { layer: 'app', moduleName: null };
  }

  if (path.startsWith('src/shared/')) {
    return { layer: 'shared', moduleName: null };
  }

  if (path.startsWith('src/packages/')) {
    return { layer: 'packages', moduleName: null };
  }

  if (path.startsWith('src/tests/')) {
    return { layer: 'tests', moduleName: null };
  }

  const moduleName = getModuleName(path);

  if (moduleName) {
    const rest = path.slice(`src/modules/${moduleName}/`.length);
    const [firstSegment] = rest.split('/');
    const knownLayers = new Set([
      'api',
      'gateway',
      'services',
      'queries',
      'store',
      'containers',
      'components',
      'hooks',
      'utils',
      'helpers',
      'mappers',
      'schemas',
      'types',
      'enums',
      'constants',
      'test',
    ]);

    if (firstSegment && rest.includes('/') && knownLayers.has(firstSegment)) {
      return { layer: `module-${firstSegment}`, moduleName };
    }

    return { layer: 'module-root', moduleName };
  }

  return { layer: 'unknown', moduleName: null };
}

/** Classify the importing file of an ESLint context. */
export function classifyContextFile(context) {
  const sourcePath = getSourcePath(toPosixPath(context.filename));

  return { sourcePath, ...classifySourcePath(sourcePath) };
}

/**
 * Evaluate a layer policy list against a single import edge.
 *
 * Each policy entry:
 *   from:    layer id (string) or array of layer ids the policy applies to
 *   forbid:  array of target layer ids that may not be imported
 *   sameModuleOnly: when true the policy only fires for imports within the
 *                   same feature module (used to allow cross-layer imports to
 *                   be validated per-module)
 *   allowIn: array of source-path prefixes exempt from the policy
 *   message: human-readable explanation appended to the report
 *
 * Returns the first violated policy or null.
 */
export function findViolatedPolicy({ policies, importer, imported }) {
  for (const policy of policies) {
    const fromLayers = Array.isArray(policy.from) ? policy.from : [policy.from];

    if (!fromLayers.includes(importer.layer)) {
      continue;
    }

    if (
      Array.isArray(policy.allowIn) &&
      policy.allowIn.some((prefix) => (importer.sourcePath ?? '').startsWith(prefix))
    ) {
      continue;
    }

    if (!policy.forbid.includes(imported.layer)) {
      continue;
    }

    if (
      policy.sameModuleOnly === true &&
      (importer.moduleName === null || importer.moduleName !== imported.moduleName)
    ) {
      continue;
    }

    return policy;
  }

  return null;
}
