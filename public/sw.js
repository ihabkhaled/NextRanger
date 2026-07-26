/* global self, caches, URL, fetch, Response */
const CACHE_PREFIX = 'next-ranger-offline-';
const CACHE_NAME = `${CACHE_PREFIX}v1`;
const LOCALES = [
  'en',
  'ar',
  'fr',
  'it',
  'de',
  'hi',
  'fa',
  'th',
  'ja',
  'zh',
  'es',
  'pt',
  'ko',
  'tr',
];
const PUBLIC_PATHS = ['', '/about', '/features', '/faq', '/contact', '/offline'];
const OFFLINE_URLS = LOCALES.map((locale) => `/${locale}/offline`);
const PRECACHE_URLS = [...OFFLINE_URLS, '/icons/icon-192.png', '/icons/icon-512.png'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME)
            .map((key) => caches.delete(key)),
        ),
      ),
  );
  self.clients.claim();
});

function isExcluded(request, url) {
  return (
    request.method !== 'GET' ||
    url.origin !== self.location.origin ||
    url.pathname.startsWith('/api/') ||
    url.pathname.startsWith('/_next/') ||
    !isPublicNavigationPath(url.pathname) ||
    request.headers.has('RSC') ||
    request.headers.has('Next-Router-Prefetch') ||
    request.headers.get('purpose') === 'prefetch' ||
    (request.headers.get('accept') || '').includes('text/x-component')
  );
}

function isPublicNavigationPath(pathname) {
  const segments = pathname.split('/').filter(Boolean);
  const locale = segments.shift();
  if (!LOCALES.includes(locale)) return false;
  return PUBLIC_PATHS.includes(segments.length === 0 ? '' : `/${segments.join('/')}`);
}

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  if (isExcluded(event.request, url) || event.request.mode !== 'navigate') return;
  event.respondWith(
    fetch(event.request).catch(async () => {
      const locale = LOCALES.includes(url.pathname.split('/')[1])
        ? url.pathname.split('/')[1]
        : 'en';
      return (await caches.match(`/${locale}/offline`)) || Response.error();
    }),
  );
});
