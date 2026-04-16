const CACHE_NAME = 'cv-pwa-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/products.html',
  '/about.html',
  '/contact.html',
  '/styles.css',
  '/script.js',
  '/admin.js',
  '/manifest.json',
  '/assets/icon-192.png',
  '/assets/icon-512.png'
];

// Instalación: precache de recursos esenciales
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

// Activación: limpieza de cachés antiguos
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
});

// Estrategia Offline-First: responde con caché y actualiza en segundo plano
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then(cached => {
      const fetchPromise = fetch(event.request)
        .then(networkResp => {
          if (networkResp.ok) {
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, networkResp.clone()));
          }
          return networkResp;
        })
        .catch(() => cached);
      return cached || fetchPromise;
    })
  );
});
