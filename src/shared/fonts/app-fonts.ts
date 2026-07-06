import { Inter } from 'next/font/google';

/**
 * Owner of next/font. Fonts load with `display: swap` and expose a CSS
 * variable consumed by the Tailwind theme.
 */
export const interFont = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});
