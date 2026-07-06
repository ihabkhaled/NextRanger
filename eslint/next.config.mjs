/**
 * Next.js rules: recommended + Core Web Vitals sets from the official plugin.
 */

import nextPlugin from '@next/eslint-plugin-next';

export default [
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      '@next/next': nextPlugin,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,
    },
  },
];
