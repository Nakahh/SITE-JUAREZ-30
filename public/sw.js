const CACHE_NAME = "siqueira-campos-v1";
const STATIC_CACHE_NAME = "static-v1";
const DYNAMIC_CACHE_NAME = "dynamic-v1";

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

// Fetch strategy
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== "GET") return;

  // Skip chrome-extension requests
  if (url.protocol === "chrome-extension:") return;

  // Handle different types of requests
  if (request.destination === "image") {
    event.respondWith(handleImageRequest(request));
  } else if (url.pathname.startsWith("/api/")) {
    event.respondWith(handleApiRequest(request));
  } else if (url.pathname.startsWith("/_next/static/")) {
    event.respondWith(handleStaticAssets(request));
  } else {
    event.respondWith(handlePageRequest(request));
  }
});

// Image caching strategy (cache-first)
async function handleImageRequest(request) {
  try {
    const cache = await caches.open(DYNAMIC_CACHE_NAME);
    const cachedResponse = await cache.match(request);

    if (cachedResponse) {
      return cachedResponse;
    }

    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    // Return placeholder image on error
    return new Response(
      '<svg width="300" height="200" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#f3f4f6"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" font-family="Arial, sans-serif" font-size="14" fill="#6b7280">Imagem não disponível</text></svg>',
      { headers: { "Content-Type": "image/svg+xml" } },
    );
  }
}

// API caching strategy (network-first)
async function handleApiRequest(request) {
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

    if (cachedResponse) {
      return cachedResponse;
    }

    // Return error response
    return new Response(
      JSON.stringify({ error: "Network error, data not available offline" }),
      {
        status: 503,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}

// Static assets caching (cache-first)
async function handleStaticAssets(request) {
  try {
    const cache = await caches.open(STATIC_CACHE_NAME);
    const cachedResponse = await cache.match(request);

    if (cachedResponse) {
      return cachedResponse;
    }

    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    return new Response("Asset not available offline", { status: 503 });
  }
}

// Page caching strategy (stale-while-revalidate)
async function handlePageRequest(request) {
  try {
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

    // Otherwise wait for network
    return await networkPromise;
  } catch (error) {
    const cache = await caches.open(DYNAMIC_CACHE_NAME);
    const cachedResponse = await cache.match(request);

    if (cachedResponse) {
      return cachedResponse;
    }

    // Return offline page
    return new Response(
      "<!DOCTYPE html><html><head><title>Offline</title></head><body><h1>Você está offline</h1><p>Esta página não está disponível offline.</p></body></html>",
      { headers: { "Content-Type": "text/html" } },
    );
  }
}

// Background sync for analytics
self.addEventListener("sync", (event) => {
  if (event.tag === "analytics-sync") {
    event.waitUntil(syncAnalytics());
  }
});

async function syncAnalytics() {
  // Sync any pending analytics data when back online
  try {
    const cache = await caches.open("analytics-cache");
    const requests = await cache.keys();

    for (const request of requests) {
      try {
        await fetch(request);
        await cache.delete(request);
      } catch (error) {
        console.log("Failed to sync analytics:", error);
      }
    }
  } catch (error) {
    console.log("Analytics sync failed:", error);
  }
}
