/**
 * Package boundary map: every third-party vendor has exactly one owning
 * wrapper directory. This is the machine-readable twin of
 * context/package-boundaries.md — update both together.
 */

import { frontendArchitecturePlugin } from './architecture-plugin.mjs';

const packageBoundaries = [
  // allowInTests: unit tests of the error normalizer construct vendor
  // AxiosError instances directly (jsdom cannot produce real timeouts).
  { package: 'axios', owners: ['src/packages/axios/'], allowInTests: true },
  { package: '@tanstack/react-query', owners: ['src/packages/query/'] },
  { package: '@tanstack/react-query-devtools', owners: ['src/packages/query/'] },
  { package: 'zustand', owners: ['src/packages/zustand/'] },
  { package: 'zod', owners: ['src/packages/zod/'] },
  { package: 'dayjs', owners: ['src/packages/date/'] },
  { package: 'date-fns', owners: ['src/packages/date/'] },
  { package: 'sonner', owners: ['src/packages/toast/'] },
  { package: 'lucide-react', owners: ['src/packages/icons/'] },
  { package: 'react-hook-form', owners: ['src/packages/forms/'] },
  { package: '@hookform/resolvers', owners: ['src/packages/forms/'] },
  { package: 'react-virtuoso', owners: ['src/packages/virtuoso/'] },
  { package: 'next-intl', owners: ['src/packages/i18n/'] },
  { package: 'clsx', owners: ['src/packages/ui-primitives/'] },
  { package: 'tailwind-merge', owners: ['src/packages/ui-primitives/'] },
  { package: 'class-variance-authority', owners: ['src/packages/ui-primitives/'] },
  { package: 'msw', owners: ['src/tests/msw/'] },
  { package: 'next/link', matchSubpaths: false, owners: ['src/packages/link/'] },
  { package: 'next/image', matchSubpaths: false, owners: ['src/packages/image/'] },
  { package: 'next/navigation', matchSubpaths: false, owners: ['src/packages/navigation/'] },
  { package: 'next/font/google', matchSubpaths: false, owners: ['src/shared/fonts/'] },
  { package: 'next/font/local', matchSubpaths: false, owners: ['src/shared/fonts/'] },
];

export default [
  {
    files: ['src/**/*.{ts,tsx}'],
    plugins: {
      'frontend-architecture-boundaries': frontendArchitecturePlugin,
    },
    rules: {
      'frontend-architecture-boundaries/no-raw-package-imports': [
        'error',
        { boundaries: packageBoundaries },
      ],
    },
  },
];
