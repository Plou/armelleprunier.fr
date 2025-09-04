const version = '0.1'

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(version).then(function(cache) {
      return cache.addAll([
        '/',
        '/manifest.json',
        '/index.html',
        '/css/main.css',
        '/js/main.js',
        '/img/logo.png',
        'https://rsms.me/inter/inter.css',
      ]);
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      if (response) {
        return response;
      }
      return fetch(event.request);
    })
  )
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(cacheName) {
          return cacheName != version;
        }).map(function(cacheName) {
          return caches.delete(cacheName);
        })
      );
    })
  );
});
