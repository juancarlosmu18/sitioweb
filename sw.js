// sw.js - Service Worker simplificado y actualizado

const CACHE_NAME = 'cv-pwa-v7'; // Súbele la versión

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
  '/apple-touch-icon.png',
  '/ofertas.html',
  '/offers.js',
  '/offers-db.js',
  '/db.js',
  '/product-module.js',
  '/product.html',
  '/android-chrome-192x192.png',
  '/icon-512.png',
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

// Fetch: Network First para offers-data.json (fuente pública de ofertas),
// Cache First para el resto de recursos de la PWA.
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);
  const isOffersData = url.pathname.endsWith('/offers-data.json');

  if (isOffersData) {
    // Network First: intenta obtener la versión más reciente. Si hay red,
    // actualiza la caché con la respuesta fresca. Si no hay red, cae de
    // vuelta a la copia cacheada (si existe) para soporte offline.
    event.respondWith(
      fetch(event.request).then(networkResponse => {
        if (networkResponse && networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseClone));
        }
        return networkResponse;
      }).catch(() => {
        return caches.match(event.request).then(cachedResponse => {
          return cachedResponse || Response.error();
        });
      })
    );
    return;
  }

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