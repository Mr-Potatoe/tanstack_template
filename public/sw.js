const CACHE_PREFIX = "tanstack-pwa-cache";
const VERSION = "v1";
const CACHE_NAME = `${CACHE_PREFIX}-${VERSION}`;
const PRECACHE_URLS = [
    "/",
    "/manifest.webmanifest",
    "/favicon.ico",
    "/icons/icon-192.png",
    "/icons/icon-512.png",
    "/icons/maskable-icon-512.png",
];

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches
        .open(CACHE_NAME)
        .then((cache) => cache.addAll(PRECACHE_URLS))
        .then(() => self.skipWaiting())
        .catch((error) => {
            console.error("[PWA] Failed to precache", error);
        }),
    );
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches
        .keys()
        .then((cacheNames) =>
            Promise.all(
                cacheNames
                .filter((name) => name.startsWith(CACHE_PREFIX) && name !== CACHE_NAME)
                .map((name) => caches.delete(name)),
            ),
        )
        .then(() => self.clients.claim()),
    );
});

self.addEventListener("fetch", (event) => {
    if (event.request.method !== "GET") {
        return;
    }

    const {
        request
    } = event;

    if (request.mode === "navigate") {
        event.respondWith(
            fetch(request)
            .then((response) => {
                return response;
            })
            .catch(async () => {
                const cache = await caches.open(CACHE_NAME);
                const offlineResponse = await cache.match("/");
                return offlineResponse || Response.error();
            })
        );
        return;
    }

    event.respondWith(
        caches.match(request).then((cachedResponse) => {
            if (cachedResponse) {
                return cachedResponse;
            }

            return fetch(request)
                .then((networkResponse) => {
                    const copy = networkResponse.clone();
                    caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
                    return networkResponse;
                })
                .catch(() => cachedResponse);
        })
    );
});