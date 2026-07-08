/**
 * Source-path classification helpers shared by every frontend-architecture rule.
 *
 * All helpers operate on POSIX-normalized, project-relative paths so the rules
 * behave identically on Windows and Unix and inside any checkout location.
 */

const SRC_MARKER = '/src/';

/** Normalize a filesystem path to POSIX separators. */
export function toPosixPath(filePath) {
  return String(filePath).replaceAll('\\', '/');
}

/**
 * Return the project-relative source path starting at `src/`, or null when the
 * file lives outside `src/` (configs, eslint plugin files, scripts...).
 */
export function getSourcePath(filename) {
  const posix = toPosixPath(filename);
  const index = posix.lastIndexOf(SRC_MARKER);

  if (index === -1) {
    return posix.startsWith('src/') ? posix : null;
  }

  return `src/${posix.slice(index + SRC_MARKER.length)}`;
}

/** File-kind checks based on canonical suffixes. */
export function isComponentFile(sourcePath) {
  return /\.component\.tsx$/.test(sourcePath ?? '');
}

export function isContainerFile(sourcePath) {
  return /\.container\.tsx$/.test(sourcePath ?? '');
}

export function isServiceFile(sourcePath) {
  return /\.service\.ts$/.test(sourcePath ?? '');
}

export function isGatewayFile(sourcePath) {
  return /\.gateway\.ts$/.test(sourcePath ?? '');
}

export function isQueryFile(sourcePath) {
  return /\.(?:queries|mutations|invalidate)\.ts$/.test(sourcePath ?? '');
}

export function isUtilsFile(sourcePath) {
  return /\.util\.ts$/.test(sourcePath ?? '');
}

export function isHelpersFile(sourcePath) {
  return /\.helper\.ts$/.test(sourcePath ?? '');
}

export function isMappersFile(sourcePath) {
  return /\.mapper\.ts$/.test(sourcePath ?? '');
}

export function isPureLogicFile(sourcePath) {
  return isUtilsFile(sourcePath) || isHelpersFile(sourcePath) || isMappersFile(sourcePath);
}

export function isQueryKeysFile(sourcePath) {
  return /query-keys\.ts$/.test(sourcePath ?? '');
}

export function isHookImplementationFile(sourcePath) {
  return /\.hook\.tsx?$/.test(sourcePath ?? '');
}

export function isRouteHandlerFile(sourcePath) {
  return /\/app\/.*\/route\.ts$/.test(sourcePath ?? '');
}

export function isConstantsFile(sourcePath) {
  return /\.constants\.ts$/.test(sourcePath ?? '');
}

export function isVariantsFile(sourcePath) {
  return /\.variants\.ts$/.test(sourcePath ?? '');
}

export function isAppRouteFile(sourcePath) {
  if (!sourcePath) {
    return false;
  }

  if (
    isConstantsFile(sourcePath) ||
    isVariantsFile(sourcePath) ||
    sourcePath.endsWith('.d.ts') ||
    isTestFile(sourcePath)
  ) {
    return false;
  }

  return /^src\/app\/.+\.ts$/.test(sourcePath);
}

export function isTestFile(sourcePath) {
  if (!sourcePath) {
    return false;
  }

  return (
    /\.test\.tsx?$/.test(sourcePath) ||
    /\/test\//.test(sourcePath) ||
    sourcePath.startsWith('src/tests/') ||
    /\.(?:e2e|a11y|visual)\.ts$/.test(sourcePath)
  );
}

/** Feature-module helpers. */
export function getModuleName(sourcePath) {
  const match = /^src\/modules\/([^/]+)\//.exec(sourcePath ?? '');

  return match ? match[1] : null;
}

/** Check whether a source path is inside one of the given directory prefixes. */
export function isUnderAny(sourcePath, prefixes) {
  const path = sourcePath ?? '';

  return prefixes.some((prefix) => path === prefix || path.startsWith(`${prefix}`));
}

/**
 * Resolve an import specifier to a project source path (`src/...`) when it
 * targets project code, or null for bare third-party packages.
 *
 * Handles the app alias families `@/*`, `@app/*`, `@modules/*`, `@shared/*`,
 * `@packages/*`, `@tests/*`, plus relative specifiers resolved against the
 * importing file location.
 */
export function resolveImportToSourcePath(importPath, importerFilename) {
  const specifier = String(importPath);

  if (specifier.startsWith('@/')) {
    return `src/${specifier.slice(2)}`;
  }

  const aliasMatch = /^@(app|modules|shared|packages|tests)\/(.+)$/.exec(specifier);

  if (aliasMatch) {
    return `src/${aliasMatch[1]}/${aliasMatch[2]}`;
  }

  if (specifier.startsWith('.')) {
    const importerSource = getSourcePath(importerFilename);

    if (!importerSource) {
      return null;
    }

    const importerDir = importerSource.split('/').slice(0, -1);
    const segments = specifier.split('/');
    const resolved = [...importerDir];

    for (const segment of segments) {
      if (segment === '.' || segment === '') {
        continue;
      }

      if (segment === '..') {
        resolved.pop();
      } else {
        resolved.push(segment);
      }
    }

    return resolved.join('/');
  }

  return null;
}

/** True when the import specifier targets a bare npm package (not project code). */
export function isBarePackageImport(importPath) {
  const specifier = String(importPath);

  return (
    !specifier.startsWith('.') &&
    !specifier.startsWith('@/') &&
    !/^@(?:app|modules|shared|packages|tests)\//.test(specifier)
  );
}

/** Extract the npm package name from a bare specifier (`@scope/pkg/sub` -> `@scope/pkg`). */
export function getPackageName(importPath) {
  const specifier = String(importPath);

  if (specifier.startsWith('@')) {
    const [scope, name] = specifier.split('/');

    return name ? `${scope}/${name}` : specifier;
  }

  const [name] = specifier.split('/');

  return name ?? specifier;
}
