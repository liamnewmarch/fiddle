const CACHE_VERSION = '3.1.0';

const CACHE_FILES = [
  '',
  'css/bundle.css',
  'img/icon-192.png',
  'js/bundle.js',
  'index.html',
];

const STRATEGY = {
  async addFiles() {
    const cache = await caches.open(CACHE_VERSION);
    return cache.addAll(CACHE_FILES);
  },

  async deleteStale() {
    const staleCaches = (key) => key !== CACHE_VERSION;
    const deleteCaches = (key) => caches.delete(key);
    const keys = await caches.keys();
    return Promise.all(keys.filter(staleCaches).map(deleteCaches));
  },

  async respondFromCache(event) {
    const response = await caches.match(event.request);
    return response || fetch(event.request);
  },
};

self.addEventListener('activate', (event) => {
  const deleted = STRATEGY.deleteStale();
  event.waitUntil(deleted);
});

self.addEventListener('install', (event) => {
  const added = STRATEGY.addFiles();
  event.waitUntil(added);
  self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  const response = STRATEGY.respondFromCache(event);
  event.respondWith(response);
});
