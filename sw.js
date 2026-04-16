// sw.js - Service Worker simplificado y actualizado

const CACHE_NAME = 'cv-pwa-v3'; // Súbele la versión

const ASSETS = [
  '/',
  '/index.html',
  '/products.html',
  '/about.html',
  '/contact.html',
  '/styles.css',
  '/script.js',
  '/admin.js',
  '/products-module.js',
  '/manifest.json',
  '/favicon.ico',
  '/favicon-32x32.png',
  '/apple-touch-icon.png'
];

// Instalación: cachear solo archivos esenciales y forzar actualización
self.addEventListener('install', event => {
  self.skipWaiting(); // <--- ESTO FUERZA A QUE NO ESPERE
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Service Worker: Cacheando archivos esenciales...');
      return cache.addAll(ASSETS);
    })
  );
});

// Activación: borrar cachés antiguos y tomar el control
self.addEventListener('activate', event => {
  event.waitUntil(clients.claim()); // <--- TOMA EL CONTROL INMEDIATO DE LA PÁGINA
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
});

// Fetch: estrategia Cache First, luego Network
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then(networkResponse => {
        // Guardar en caché las respuestas exitosas
        if (networkResponse && networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseClone);
          });
        }
        return networkResponse;
      }).catch(() => {
        // Si no hay internet, devolver caché si existe
        return caches.match(event.request);
      });
    })
  );
});