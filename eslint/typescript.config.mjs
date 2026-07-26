/**
 * TypeScript strictness: typescript-eslint strict + stylistic type-checked
 * presets, scoped to TypeScript files, with the project rules that keep
 * `any`, non-null assertions, and ts-comments out of the codebase.
 */

import path from 'node:path';

import tseslint from 'typescript-eslint';

const typescriptFiles = ['**/*.ts', '**/*.tsx', '**/*.mts'];

const scoped = [
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
].map((config) => ({
  ...config,
  files: typescriptFiles,
}));

export default [
  ...scoped,
  {
    files: typescriptFiles,
    languageOptions: {
      parserOptions: {
        projectService: {
          allowDefaultProject: ['*.ts', '*.mts'],
          defaultProject: 'tsconfig.eslint.json',
        },
        tsconfigRootDir: path.resolve(import.meta.dirname, '..'),
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/ban-ts-comment': [
        'error',
        {
          'ts-expect-error': false,
          'ts-ignore': false,
          'ts-nocheck': false,
          'ts-check': false,
        },
      ],
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],
      '@typescript-eslint/consistent-type-exports': 'error',
      '@typescript-eslint/explicit-module-boundary-types': 'error',
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/restrict-template-expressions': ['error', { allowNumber: true }],
      '@typescript-eslint/no-misused-promises': 'error',
      '@typescript-eslint/switch-exhaustiveness-check': [
        'error',
        { considerDefaultExhaustiveForUnions: true },
      ],
      // Empty-string fallbacks (`value || 'default'`) are deliberate intent;
      // nullish coalescing stays preferred for every other type.
      '@typescript-eslint/prefer-nullish-coalescing': [
        'error',
        { ignorePrimitives: { string: true } },
      ],
      // unused-imports/no-unused-vars owns unused detection (autofixable).
      '@typescript-eslint/no-unused-vars': 'off',
      // Restrict TS enum keyword: enum-like values are `as const` objects.
      'no-restricted-syntax': [
        'error',
        {
          selector: 'TSEnumDeclaration',
          message: "TypeScript 'enum' is forbidden. Use an `as const` object in an enums/ file.",
        },
      ],
    },
  },
  {
    // Config files at the repo root are type-checked via the default project.
    files: ['*.config.ts', '*.config.mts', 'next.config.ts', 'playwright.config.ts'],
    rules: {
      '@typescript-eslint/explicit-module-boundary-types': 'off',
    },
  },
];
