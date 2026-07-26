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
  });

  it('rejects warning-level ESLint configuration', () => {
    expect(packageManifest.scripts['lint']).toContain('--max-warnings=0');
    expect(packageManifest.scripts['lint']).toContain('lint:severity');
    expect(packageManifest.scripts['lint:fix']).toContain('--max-warnings=0');
    expect(packageManifest.scripts['lint:fix']).toContain('lint:severity');
  });
});
