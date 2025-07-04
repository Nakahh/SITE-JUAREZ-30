const CACHE_NAME = "siqueira-campos-v2";
const STATIC_CACHE_NAME = "static-v2";
const DYNAMIC_CACHE_NAME = "dynamic-v2";

// Cache static assets
const STATIC_ASSETS = [
  "/",
  "/manifest.json",
  "/logo siqueira campos imoveis.png",
  "/placeholder-property.svg",
  "/hero-bg.svg",
];

// Cache strategies
const CACHE_STRATEGIES = {
  images: "cache-first",
  api: "network-first",
  pages: "stale-while-revalidate",
};

// Install service worker
self.addEventListener("install", (event) => {
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE_NAME).then((cache) => {
        return cache.addAll(STATIC_ASSETS);
      }),
      caches.open(DYNAMIC_CACHE_NAME),
    ]),
  );
  self.skipWaiting();
});

// Activate service worker
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (
            cacheName !== STATIC_CACHE_NAME &&
            cacheName !== DYNAMIC_CACHE_NAME
          ) {
            return caches.delete(cacheName);
          }
        }),
      );
    }),
  );
  self.clients.claim();
});

// Fetch event handler
self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Only handle GET requests
  if (request.method !== "GET") {
    return;
  }

  // Skip non-http requests
  if (!url.protocol.startsWith("http")) {
    return;
  }

  // Skip external domains except for allowed ones
  if (url.origin !== self.location.origin) {
    return;
  }

  // Handle different types of requests
  if (url.pathname.startsWith("/api/")) {
    // API requests - network first
    event.respondWith(networkFirst(request));
  } else if (url.pathname.match(/\.(png|jpg|jpeg|gif|svg|webp)$/)) {
    // Images - cache first
    event.respondWith(cacheFirst(request));
  } else {
    // Pages - stale while revalidate
    event.respondWith(staleWhileRevalidate(request));
  }
});

// Cache strategies implementation
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    const cache = await caches.open(DYNAMIC_CACHE_NAME);
    const cachedResponse = await cache.match(request);
    return cachedResponse || new Response("Offline", { status: 503 });
  }
}

async function cacheFirst(request) {
  const cache = await caches.open(STATIC_CACHE_NAME);
  const cachedResponse = await cache.match(request);

  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    // Return placeholder for failed image requests
    return new Response(
      '<svg width="300" height="200" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#f3f4f6"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" font-family="Arial, sans-serif" font-size="14" fill="#6b7280">Imagem não disponível</text></svg>',
      { headers: { "Content-Type": "image/svg+xml" } },
    );
  }
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(DYNAMIC_CACHE_NAME);
  const cachedResponse = await cache.match(request);

  // Always try to update cache in background
  const networkPromise = fetch(request).then((networkResponse) => {
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  });

  // Return cached version immediately if available
  if (cachedResponse) {
    return cachedResponse;
  }

  // If no cache, wait for network
  try {
    return await networkPromise;
  } catch (error) {
    return new Response("Offline", { status: 503 });
  }
}
