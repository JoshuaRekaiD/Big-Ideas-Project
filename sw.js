/* =========================================================
   BIRP — Service Worker
   ========================================================= */

const CACHE_NAME = 'birp-v4';

const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/deals.html',
  '/about.html',
  '/stores.html',
  '/store-dashboard.html',
  '/terms.html',
  '/404.html',
  '/reset-password.html',
  '/css/main.css',
  '/css/animations.css',
  '/js/main.js',
  '/js/supabase.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return Promise.allSettled(
        PRECACHE_URLS.map(url => cache.add(url).catch(() => {}))
      );
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  if (url.origin !== self.location.origin) return;

  const isHTML = request.headers.get('Accept')?.includes('text/html');

  if (isHTML) {
    event.respondWith(
      fetch(request)
        .then(response => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
          return response;
        })
        .catch(() =>
          caches.match(request).then(cached =>
            cached || caches.match('/404.html')
          )
        )
    );
  } else {
    event.respondWith(
      caches.match(request).then(cached => {
        if (cached) return cached;
        return fetch(request).then(response => {
          if (!response || response.status !== 200 || response.type === 'opaque') return response;
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
          return response;
        });
      })
    );
  }
});
