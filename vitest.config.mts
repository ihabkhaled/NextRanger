import path from 'node:path';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

const srcDir = path.resolve(import.meta.dirname, 'src');

export default defineConfig({
  plugins: [react()],
  resolve: {
    tsconfigPaths: true,
    // Explicit aliases (in addition to tsconfig paths) so vi.mock specifiers
    // using @/ resolve identically to source imports.
    alias: {
      '@app': path.join(srcDir, 'app'),
      '@modules': path.join(srcDir, 'modules'),
      '@shared': path.join(srcDir, 'shared'),
      '@packages': path.join(srcDir, 'packages'),
      '@tests': path.join(srcDir, 'tests'),
      '@': srcDir,
    },
  },
  test: {
    environment: 'jsdom',
    globals: false,
    setupFiles: ['./src/tests/setup/vitest.setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    exclude: [
      '**/node_modules/**',
      'src/tests/e2e/**',
      'src/tests/accessibility/**',
      'src/tests/visual/**',
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      include: ['src/modules/**', 'src/shared/**', 'src/packages/**'],
      exclude: [
        '**/*.test.ts',
        '**/*.test.tsx',
        '**/test/**',
        '**/types/**',
        '**/*.types.ts',
        '**/index.ts',
      ],
      thresholds: {
        lines: 95,
        statements: 95,
        functions: 95,
        branches: 95,
        'src/**/{utils,helpers,mappers,schemas}/**/*.ts': {
          lines: 100,
          statements: 100,
          functions: 100,
          branches: 100,
        },
        'src/**/queries/*query-keys*.ts': {
          lines: 100,
          statements: 100,
          functions: 100,
          branches: 100,
        },
      },
    },
  },
});
