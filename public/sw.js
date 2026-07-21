// Service worker do 365 DDS.
// Estratégia: cache-first. No install, baixa a lista de arquivos gerada
// pelo build (precache-manifest.json) e guarda tudo — app shell inteiro
// e o conteúdo dos DDS (embutido nos chunks JS). Depois disso o app abre
// 100% offline.

const CACHE_PREFIX = "dds365-";

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const res = await fetch("/precache-manifest.json", { cache: "no-store" });
      const { version, urls } = await res.json();
      const cache = await caches.open(CACHE_PREFIX + version);
      await cache.addAll(urls);
      await self.skipWaiting();
    })(),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      let currentKey = null;
      try {
        const res = await fetch("/precache-manifest.json", { cache: "no-store" });
        const { version } = await res.json();
        currentKey = CACHE_PREFIX + version;
      } catch {
        // Sem rede na ativação: mantém os caches existentes como estão.
      }
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((key) => key.startsWith(CACHE_PREFIX) && key !== currentKey)
          .map((key) => caches.delete(key)),
      );
      await self.clients.claim();
    })(),
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    (async () => {
      const cached = await caches.match(event.request, { ignoreSearch: true });
      if (cached) return cached;

      try {
        return await fetch(event.request);
      } catch (err) {
        const fallback = await caches.match("/", { ignoreSearch: true });
        if (fallback) return fallback;
        throw err;
      }
    })(),
  );
});
