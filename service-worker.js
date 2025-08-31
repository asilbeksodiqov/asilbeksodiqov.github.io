const CACHE_NAME = 'portfolio-v1';
const urlsToCache = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './avatar.png',
  './certificate-dev.jpg',
  './certificate-english.jpg',
  './certificate-law.jpg'
];

// Install: fayllarni keshga saqlash
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

// Fetch: keshdan foydalanish
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        return response || fetch(event.request);
      })
  );
});