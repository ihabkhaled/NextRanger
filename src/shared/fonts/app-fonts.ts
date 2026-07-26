import { Geist, Geist_Mono } from 'next/font/google';

/**
 * Owner of next/font. Fonts load with `display: swap` and expose a CSS
 * variable consumed by the Tailwind theme.
 */
export const geistSans = Geist({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const appFontClassName = `${geistSans.variable} ${geistMono.variable}`;
