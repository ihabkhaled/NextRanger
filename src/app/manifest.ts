import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Strict Next Ranger',
    short_name: 'Next Ranger',
    description: 'A strict, multilingual Next.js foundation for production teams.',
    start_url: '/en',
    scope: '/',
    display: 'standalone',
    background_color: '#0b1020',
    theme_color: '#6d5dfc',
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
