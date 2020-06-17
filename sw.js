const CACHE_NAME = 'static-cache-uwu';
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
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME).then(function(cache) {
            return cache.addAll(FILES_TO_CACHE);
        })
    );
    caches.keys().then(function(names) {
        for (let name of names){
            if (name != CACHE_NAME){
                caches.delete(name);
            };
        }
    });
});
