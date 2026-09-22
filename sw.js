/* =========================================================
   BIRP — Service Worker
   Enables PWA installation and offline fallback.
   Strategy: Cache-first for static assets,
             network-first for HTML pages.
   ========================================================= */

const CACHE_NAME = 'birp-v1';

// Static assets to pre-cache on install
const PRECACHE_URLS = [
  '/Big-Ideas-Project/',
  '/Big-Ideas-Project/index.html',
  '/Big-Ideas-Project/deals.html',
  '/Big-Ideas-Project/about.html',
  '/Big-Ideas-Project/stores.html',
  '/Big-Ideas-Project/store-dashboard.html',
  '/Big-Ideas-Project/terms.html',
  '/Big-Ideas-Project/404.html',
  '/Big-Ideas-Project/css/main.css',
  '/Big-Ideas-Project/css/animations.css',
  '/Big-Ideas-Project/js/main.js'
];

// ── INSTALL: pre-cache core files ──
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      // Cache what we can — don't fail install if some assets are unavailable
      return Promise.allSettled(
        PRECACHE_URLS.map(url =>
          cache.add(url).catch(() => {
            // Silently skip assets that fail (e.g. external fonts)
          })
        )
      );
    }).then(() => self.skipWaiting())
  );
});

// ── ACTIVATE: clean up old caches ──
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

// ── FETCH: network-first for HTML, cache-first for everything else ──
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle same-origin requests (skip Unsplash CDN, Google Fonts etc.)
  if (url.origin !== self.location.origin) return;

  const isHTML = request.headers.get('Accept')?.includes('text/html');

  if (isHTML) {
    // Network-first: always try to fetch fresh HTML, fall back to cache
    event.respondWith(
      fetch(request)
        .then(response => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
          return response;
        })
        .catch(() =>
          caches.match(request).then(cached =>
            cached || caches.match('/Big-Ideas-Project/404.html')
          )
        )
    );
  } else {
    // Cache-first: serve from cache if available, otherwise fetch and cache
    event.respondWith(
      caches.match(request).then(cached => {
        if (cached) return cached;
        return fetch(request).then(response => {
          if (!response || response.status !== 200 || response.type === 'opaque') {
            return response;
          }
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
          return response;
        });
      })
    );
  }
});
