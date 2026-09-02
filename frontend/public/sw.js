// Service Worker for SwasthyaSetu PWA
const CACHE_NAME = 'swasthya-setu-v1';
const STATIC_CACHE = 'swasthya-static-v1';
const API_CACHE = 'swasthya-api-v1';

const STATIC_URLS = [
  '/',
  '/index.html',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json'
];

// Install
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(STATIC_URLS).catch(err => {
        console.log('Cache add failed:', err);
      });
    })
  );
  self.skipWaiting();
});

// Activate
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME && name !== STATIC_CACHE && name !== API_CACHE)
          .map(name => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Fetch - Network first with cache fallback
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // API requests
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then(response => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(API_CACHE).then(cache => cache.put(request, clone));
          }
          return response;
        })
        .catch(() => {
          return caches.match(request).then(response => {
            if (response) {
              return new Response(JSON.stringify({
                success: false,
                offline: true,
                message: 'You are offline. Showing cached data.'
              }), {
                headers: { 'Content-Type': 'application/json' }
              });
            }
            throw new Error('No cached data available');
          });
        })
    );
    return;
  }

  // Static resources - Cache first
  if (request.method === 'GET') {
    event.respondWith(
      caches.match(request).then(cached => {
        if (cached) return cached;
        return fetch(request).then(response => {
          if (response.ok && response.status === 200) {
            const clone = response.clone();
            caches.open(STATIC_CACHE).then(cache => cache.put(request, clone));
          }
          return response;
        }).catch(() => {
          if (request.destination === 'document') {
            return caches.match('/index.html');
          }
        });
      })
    );
  }
});

// Background sync
self.addEventListener('sync', event => {
  if (event.tag === 'sync-pending-actions') {
    event.waitUntil(syncPendingActions());
  }
});

async function syncPendingActions() {
  const cache = await caches.open(API_CACHE);
  // Process any pending offline actions
  return Promise.resolve();
}