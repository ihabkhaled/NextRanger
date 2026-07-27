import { readFileSync } from 'node:fs';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

interface PackageManifest {
  readonly allowScripts: Readonly<Record<string, boolean>>;
  readonly devDependencies: Readonly<Record<string, string>>;
  readonly engines: {
    readonly node: string;
    readonly npm: string;
  };
  readonly overrides: Readonly<Record<string, unknown>>;
  readonly packageManager: string;
  readonly scripts: Readonly<Record<string, string>>;
}

interface NcuConfig {
  readonly reject: readonly string[];
}

const repoRoot = path.resolve(import.meta.dirname, '../../..');
const packageManifestSource = readFileSync(path.join(repoRoot, 'package.json'), 'utf8');
const packageManifest = JSON.parse(packageManifestSource) as PackageManifest;
const ncuConfig = JSON.parse(readFileSync(path.join(repoRoot, '.ncurc.json'), 'utf8')) as NcuConfig;
const nodeVersion = readFileSync(path.join(repoRoot, '.node-version'), 'utf8').trim();
const nvmVersion = readFileSync(path.join(repoRoot, '.nvmrc'), 'utf8').trim();
const npmConfig = readFileSync(path.join(repoRoot, '.npmrc'), 'utf8');
const commitMessageHook = readFileSync(path.join(repoRoot, '.husky/commit-msg'), 'utf8');
const prePushHook = readFileSync(path.join(repoRoot, '.husky/pre-push'), 'utf8');
const ciWorkflow = readFileSync(path.join(repoRoot, '.github/workflows/ci.yml'), 'utf8');
const e2eWorkflow = readFileSync(path.join(repoRoot, '.github/workflows/e2e.yml'), 'utf8');
const securityWorkflow = readFileSync(
  path.join(repoRoot, '.github/workflows/security.yml'),
  'utf8',
);
const sortPackageNames = (left: string, right: string): number => left.localeCompare(right);

describe('toolchain contract', () => {
  it('pins the stable TypeScript 7 compiler and the TypeScript 6 compatibility API', () => {
    expect(packageManifest.devDependencies['@typescript/native']).toBe('npm:typescript@^7.0.2');
    expect(packageManifest.devDependencies['typescript']).toBe(
      'npm:@typescript/typescript6@^6.0.2',
    );
  });

  it('pins one warning-free Node and npm toolchain locally and in every workflow', () => {
    expect(packageManifestSource.match(/"allowScripts"/gu) ?? []).toHaveLength(1);
    expect(packageManifest.engines).toEqual({
      node: '>=24.15.0 <25',
      npm: '>=12.0.1 <13',
    });
    expect(packageManifest.packageManager).toBe('npm@12.0.1');
    expect(nodeVersion).toBe('24.18.0');
    expect(nvmVersion).toBe(nodeVersion);
    for (const workflow of [ciWorkflow, e2eWorkflow, securityWorkflow]) {
      expect(workflow).toContain('node-version: 24.18.0');
      expect(workflow).toContain('corepack npm ci');
    }
    expect(prePushHook).toContain('corepack npm run gate:push');
    expect(commitMessageHook).toContain('corepack npm run commitlint');
    expect(packageManifest.scripts['commitlint']).toBe('commitlint');
    expect(packageManifest.scripts['gate:push']).not.toMatch(/(^|&& )npm /u);
    expect(packageManifest.scripts['security:audit']).toMatch(/^corepack npm /u);
    expect(packageManifest.allowScripts).toEqual({
      '@parcel/watcher@2.5.6': true,
      '@swc/core@1.15.43': true,
      msw: false,
      'unrs-resolver@1.12.2': true,
    });
    expect(packageManifest.overrides['@swc/helpers']).toBe('0.5.23');
    expect(npmConfig).toContain('engine-strict=true');
    expect(npmConfig).toContain('strict-allow-scripts=true');
  });

  it('fails dependency drift checks while documenting peer-blocked ESLint majors', () => {
    expect(packageManifest.scripts['deps:check']).toContain('--errorLevel 2');
    expect(packageManifest.scripts['deps:check:all']).toBe('npm-check-updates --reject "/(?!)"');
    expect(ncuConfig.reject.toSorted(sortPackageNames)).toEqual(
      ['@eslint/js', 'eslint', 'eslint-plugin-unicorn'].toSorted(sortPackageNames),
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

  it('keeps visual baseline updates explicit and makes CI compare-only', () => {
    expect(packageManifest.scripts['test:e2e:baseline']).toContain('--update-snapshots=all');
    expect(e2eWorkflow).not.toContain('--update-snapshots');
    expect(e2eWorkflow).toContain('corepack npm exec -- playwright install --with-deps chromium');
    expect(e2eWorkflow).toContain(
      'corepack npm exec -- playwright test src/tests/e2e src/tests/accessibility',
    );
    expect(e2eWorkflow).toContain('npm run test:visual');
  });

  it('rejects warning-level ESLint configuration', () => {
    expect(packageManifest.scripts['lint']).toContain('--max-warnings=0');
    expect(packageManifest.scripts['lint']).toContain('lint:severity');
    expect(packageManifest.scripts['lint:fix']).toContain('--max-warnings=0');
    expect(packageManifest.scripts['lint:fix']).toContain('lint:severity');
  });
});
