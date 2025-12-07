// service-worker.js
const CACHE_NAME = 'military-life-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/homejs/main.js',
  '/homejs/config.js',
  '/homejs/serviceCalculator.js',
  '/homejs/dateTimer.js',
  '/homejs/scroll.js',
  '/homejs/slider.js',
  '/homejs/toast.js',
  '/homejs/music.js',
  '/homejs/musicData.js',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});