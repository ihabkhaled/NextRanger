import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const EXPECTED_VERSION = '5.0.8';
const COMMON_JS_MARKER = '// strict-boilerplate: legacy CommonJS compatibility';
const ESM_MARKER = '// strict-boilerplate: legacy ESM compatibility';
const packageRoots = [];

function isPackageDirectory(entry) {
  return entry.isDirectory() || entry.isSymbolicLink();
}

async function visitPackage(packageRoot) {
  if (path.basename(packageRoot) === 'brace-expansion') {
    packageRoots.push(packageRoot);
  }

  await visitNodeModules(path.join(packageRoot, 'node_modules'));
}

async function visitScope(scopeRoot) {
  const scopedEntries = await readdir(scopeRoot, { withFileTypes: true });

  for (const entry of scopedEntries) {
    if (isPackageDirectory(entry)) {
      await visitPackage(path.join(scopeRoot, entry.name));
    }
  }
}

async function visitNodeModules(nodeModulesRoot) {
  let entries;

  try {
    entries = await readdir(nodeModulesRoot, { withFileTypes: true });
  } catch (error) {
    if (error?.code === 'ENOENT') return;
    throw error;
  }

  for (const entry of entries) {
    if (!isPackageDirectory(entry) || entry.name === '.bin') continue;

    const entryPath = path.join(nodeModulesRoot, entry.name);
    const visitEntry = entry.name.startsWith('@') ? visitScope : visitPackage;
    await visitEntry(entryPath);
  }
}

async function patchCommonJs(commonJsPath) {
  const source = await readFile(commonJsPath, 'utf8');

  if (source.includes(COMMON_JS_MARKER)) return;

  const expectedExport = 'exports.expand = expand;';

  if (!source.includes(expectedExport)) {
    throw new Error('Refusing to patch brace-expansion: the CommonJS export shape changed.');
  }

  const compatibilityExport = [
    '',
    COMMON_JS_MARKER,
    'const legacyExpand = exports.expand;',
    'legacyExpand.expand = exports.expand;',
    'legacyExpand.EXPANSION_MAX = exports.EXPANSION_MAX;',
    'legacyExpand.EXPANSION_MAX_LENGTH = exports.EXPANSION_MAX_LENGTH;',
    'module.exports = legacyExpand;',
    '',
  ].join('\n');

  await writeFile(commonJsPath, source + compatibilityExport, 'utf8');
}

async function patchEsm(esmPath) {
  const source = await readFile(esmPath, 'utf8');

  if (source.includes(ESM_MARKER)) return;

  const expectedExport = 'export function expand(';

  if (!source.includes(expectedExport)) {
    throw new Error('Refusing to patch brace-expansion: the ESM export shape changed.');
  }

  const defaultExport = ['', ESM_MARKER, 'export default expand;', ''].join('\n');
  await writeFile(esmPath, source + defaultExport, 'utf8');
}

async function patchPackage(packageRoot) {
  const manifestPath = path.join(packageRoot, 'package.json');
  const commonJsPath = path.join(packageRoot, 'dist', 'commonjs', 'index.js');
  const esmPath = path.join(packageRoot, 'dist', 'esm', 'index.js');
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));

  if (manifest.version !== EXPECTED_VERSION) {
    throw new Error(
      'Refusing to patch brace-expansion ' +
        manifest.version +
        '; expected ' +
        EXPECTED_VERSION +
        '.',
    );
  }

  await Promise.all([patchCommonJs(commonJsPath), patchEsm(esmPath)]);
}

await visitNodeModules(path.join(process.cwd(), 'node_modules'));

if (packageRoots.length === 0) {
  throw new Error('No installed brace-expansion packages were found.');
}

await Promise.all(packageRoots.map((packageRoot) => patchPackage(packageRoot)));

process.stdout.write(
  'brace-expansion ' +
    EXPECTED_VERSION +
    ' CJS/ESM compatibility verified for ' +
    packageRoots.length +
    ' installed copy/copies.\n',
);
