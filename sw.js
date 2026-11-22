// Service worker: keeps the app working offline. Your records are never sent anywhere.
const CACHE = 'rtt-1.0.0-263b5f9414';
const FILES = ["./","./index.html","./manifest.webmanifest","./icons/icon-192.png","./icons/icon-512.png","./icons/icon-maskable-512.png","./icons/apple-touch-icon.png"];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  if (req.mode === 'navigate') {
    // Show the saved app straight away, and refresh the copy in the background when online.
    e.respondWith(caches.match('./index.html', { ignoreSearch: true }).then(hit => {
      const net = fetch(req).then(res => { if (res.ok) caches.open(CACHE).then(c => c.put('./index.html', res.clone())); return res; }).catch(() => hit);
      return hit || net;
    }));
    return;
  }
  e.respondWith(caches.match(req, { ignoreSearch: true }).then(hit => hit || fetch(req)));
});
