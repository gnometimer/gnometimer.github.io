const CACHE_NAME = 'static-cache';
const FILES_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/scripts/app.js',
  '/scripts/install.js',
  '/scripts/jscolor.js',
  '/styles/inline.css',
  '/images/install.svg',
  '/images/colorswitch.svg',
  '/images/favicon.ico',
  '/images/icons/icon-32.png',
  '/images/icons/icon-128.png',
  '/images/icons/icon-144.png',
  '/images/icons/icon-152.png',
  '/images/icons/icon-192.png',
  '/images/icons/icon-256.png',
  '/images/icons/icon-512.png'
];

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
        // Cache hit - return response
        if (response) {
          return response;
        }

        return fetch(event.request).then(
          function(response) {
            // Check if we received a valid response
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            var responseToCache = response.clone();
            caches.open(CACHE_NAME).then(function(cache) {
                cache.put(event.request, responseToCache);
              });
            return response;
          }
        );
      })
    );
});
self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME).then(function(cache) {
            return cache.addAll(FILES_TO_CACHE);
        })
    );
});
