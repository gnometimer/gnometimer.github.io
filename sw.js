const CACHE_NAME = 'static-cache-:)';
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
//   '/images/icons/apple-splash-1125-2436.jpg',
//   '/images/icons/apple-splash-1136-640.jpg',
//   '/images/icons/apple-splash-1242-2208.jpg',
//   '/images/icons/apple-splash-1242-2688.jpg',
//   '/images/icons/apple-splash-1334-750.jpg',
//   '/images/icons/apple-splash-1536-2048.jpg',
//   '/images/icons/apple-splash-1668-2224.jpg',
//   '/images/icons/apple-splash-1668-2388.jpg',
//   '/images/icons/apple-splash-1792-828.jpg',
//   '/images/icons/apple-splash-2048-1536.jpg',
//   '/images/icons/apple-splash-2048-2732.jpg',
//   '/images/icons/apple-splash-2208-1242.jpg',
//   '/images/icons/apple-splash-2224-1668.jpg',
//   '/images/icons/apple-splash-2388-1668.jpg',
//   '/images/icons/apple-splash-2436-1125.jpg',
//   '/images/icons/apple-splash-2688-1242.jpg',
//   '/images/icons/apple-splash-2732-2048.jpg',
//   '/images/icons/apple-splash-640-1136.jpg',
//   '/images/icons/apple-splash-750-1334.jpg',
//   '/images/icons/apple-splash-828-1792.jpg',
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
    caches.keys().then(function(names) {
        for (let name of names){
            if (name != CACHE_NAME){
                caches.delete(name);
            };
        }
    });
});
