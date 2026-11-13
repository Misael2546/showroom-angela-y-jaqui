// PWA offline shell. Data is stored in this browser's localStorage, NOT in this cache.
const CACHE = 'angela-jaqui-luxury-v4.1.3';
const SHELL = ['./','./index.html','./styles.css','./luxury.css','./app.js','./features-v4.js','./qr.js','./catalogo.html','./catalogo.js','./catalogo.css','./catalogo-luxury.css','./catalogo.json','./assets/showroom-banner.webp','./manifest.webmanifest','./icons/icon-192.png','./icons/icon-512.png','./icons/icon-maskable-512.png'];
self.addEventListener('install', e => e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())));
self.addEventListener('activate', e => e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== CACHE).map(x => caches.delete(x)))).then(() => self.clients.claim())));
// Red primero: siempre la versión más nueva; sin conexión, se usa la copia guardada.
self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET' || new URL(r.url).origin !== self.location.origin) return;
  e.respondWith(fetch(r).then(res => {
    if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(r, copy)); }
    return res;
  }).catch(async () => (await caches.match(r)) || (r.mode === 'navigate' && new URL(r.url).pathname.endsWith('/') ? caches.match('./index.html') : Response.error())));
});
