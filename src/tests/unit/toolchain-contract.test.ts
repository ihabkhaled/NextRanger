import { readFileSync } from 'node:fs';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

interface PackageManifest {
  readonly devDependencies: Readonly<Record<string, string>>;
  readonly scripts: Readonly<Record<string, string>>;
}

const repoRoot = path.resolve(import.meta.dirname, '../../..');
const packageManifest = JSON.parse(
  readFileSync(path.join(repoRoot, 'package.json'), 'utf8'),
) as PackageManifest;
const prePushHook = readFileSync(path.join(repoRoot, '.husky/pre-push'), 'utf8');
const ciWorkflow = readFileSync(path.join(repoRoot, '.github/workflows/ci.yml'), 'utf8');

describe('toolchain contract', () => {
  it('pins the stable TypeScript 7 compiler and the TypeScript 6 compatibility API', () => {
    expect(packageManifest.devDependencies['@typescript/native']).toBe('npm:typescript@^7.0.2');
    expect(packageManifest.devDependencies['typescript']).toBe(
      'npm:@typescript/typescript6@^6.0.2',
    );
  });

  it('runs TypeScript 7 in primary typecheck and build gates', () => {
    expect(packageManifest.scripts['typecheck']).toContain('compiler:versions');
    expect(packageManifest.scripts['typecheck:app']).toContain(
      'node_modules/@typescript/native/bin/tsc',
    );
    expect(packageManifest.scripts['build']).toContain('typecheck:app');
  });

  it('keeps the TypeScript 6 API check explicit', () => {
    expect(packageManifest.scripts['typecheck:compat']).toContain(
      'node_modules/typescript/bin/tsc6',
    );
    expect(packageManifest.scripts['typecheck']).toContain('typecheck:compat');
  });

  it('routes local pushes and CI through the same complete quality gate', () => {
    expect(packageManifest.scripts['gate:push']).toContain('format:check');
    expect(packageManifest.scripts['gate:push']).toContain('quality');
    expect(packageManifest.scripts['gate:push']).toContain('security:audit');
    expect(packageManifest.scripts['quality']).toContain('quality:dead-code');
    expect(packageManifest.scripts['quality']).toContain('quality:circular');
    expect(prePushHook).toContain('npm run gate:push');
    expect(ciWorkflow).toContain('npm run gate:push');
  });

  it('rejects warning-level ESLint configuration', () => {
    expect(packageManifest.scripts['lint']).toContain('--max-warnings=0');
    expect(packageManifest.scripts['lint']).toContain('lint:severity');
    expect(packageManifest.scripts['lint:fix']).toContain('--max-warnings=0');
    expect(packageManifest.scripts['lint:fix']).toContain('lint:severity');
  });
});
