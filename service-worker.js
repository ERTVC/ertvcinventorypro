// A more robust service worker for offline functionality.
const CACHE_NAME = 'ertvc-inventory-pro-v2';

// Comprehensive list of assets to cache on installation.
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  // Note: The browser will cache these automatically upon first load due to the fetch handler below.
  // We list them here for pre-caching, which makes the first offline load faster.
  'https://cdn.tailwindcss.com?plugins=typography',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css',
  'https://unpkg.com/@babel/standalone/babel.min.js',
  'https://esm.sh/react@18.3.1',
  'https://esm.sh/react@18.3.1/jsx-runtime',
  'https://esm.sh/react-dom@18.3.1/client',
  'https://esm.sh/recharts@2.12.7',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.8.2/jspdf.plugin.autotable.min.js',
  'https://cdn.sheetjs.com/xlsx-latest/package/dist/xlsx.full.min.js',
  'https://cdn.jsdelivr.net/npm/mammoth@1.6.0/mammoth.browser.min.js',
  'https://esm.sh/@google/genai'
];

// Install the service worker and pre-cache essential assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache and caching initial assets');
        return cache.addAll(urlsToCache).catch(err => {
          // This catch is important. If any of the URLs fail, addAll fails completely.
          // This helps debug which URL might be causing an issue.
          console.error('Failed to cache initial assets:', err);
        });
      })
  );
});

// Activate event: clean up old caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch event: Serve content using a stale-while-revalidate strategy.
self.addEventListener('fetch', event => {
  // We only want to cache GET requests.
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.open(CACHE_NAME).then(cache => {
      return cache.match(event.request).then(response => {
        // Return cached response immediately if found (stale).
        const cachedResponse = response;

        const fetchPromise = fetch(event.request).then(networkResponse => {
          // If the fetch is successful, update the cache (revalidate).
          if (networkResponse && networkResponse.status === 200) {
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        }).catch(error => {
            console.error('Fetch failed; returning offline page instead.', error);
            // If fetch fails (e.g., offline) and there's no cached response,
            // you could return a fallback offline page here if you had one.
            // For now, we just let the browser show its offline error if nothing is cached.
        });

        // Return the cached response if it exists, otherwise wait for the network.
        return cachedResponse || fetchPromise;
      });
    })
  );
});