/* Krakendork - Service Worker para PWA */
const CACHE = 'krakendork-v1';
const ASSETS = ['index.html', 'css/main.css', 'css/animations.css', 'js/engine.js', 'js/sprites.js', 'js/ui.js', 'js/game.js', 'js/main.js', 'js/storage.js', 'js/audio.js', 'js/visibility.js', 'js/input.js'];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  if (e.request.url.startsWith(self.location.origin) && !e.request.url.includes('chrome-extension')) {
    e.respondWith(
      caches.match(e.request).then((r) => r || fetch(e.request))
    );
  }
});
