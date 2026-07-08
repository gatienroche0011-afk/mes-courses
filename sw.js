const CACHE = 'caddie-v21';
const ASSETS = [
  '/mes-courses/',
  '/mes-courses/index.html',
  '/mes-courses/icon.svg',
  '/mes-courses/manifest.json',
  '/mes-courses/logo-icon-v2.jpg',
  '/mes-courses/logo-header.jpg',
  '/mes-courses/logo-login.jpg',
  '/mes-courses/illustration.png',
  '/mes-courses/Intro.otf',
  '/mes-courses/GlacialIndifference-Regular.otf',
  '/mes-courses/GlacialIndifference-Bold.otf',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  if (url.hostname === 'api.github.com') return;

  e.respondWith(
    caches.match(e.request).then(cached => {
      const network = fetch(e.request).then(r => {
        if (r && r.ok) {
          caches.open(CACHE).then(c => c.put(e.request, r.clone()));
        }
        return r;
      }).catch(() => null);
      return cached || network;
    })
  );
});
