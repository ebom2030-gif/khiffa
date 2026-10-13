// خفّة — offline shell. Bump VERSION on every release so phones pick up the new files.
const VERSION = 'khiffa-v12';
const IMG = 'khiffa-img';
const SHELL = ['./', 'index.html', 'config.js', 'data.js', 'app.js', 'theme.js', 'search.js', 'dashboard.js', 'reports.js', 'features.js', 'skin.js', 'photos.js', 'install.js', 'manifest.webmanifest', 'icon.svg', 'icon-180.png', 'icon-192.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(VERSION).then(c => c.addAll(SHELL))); self.skipWaiting(); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION && k !== IMG).map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method === 'GET' && url.hostname === 'images.unsplash.com') { // photos: cache first so they show offline
    e.respondWith(caches.open(IMG).then(c => c.match(e.request).then(hit => hit || fetch(e.request).then(r => { c.put(e.request, r.clone()); return r; }))));
    return;
  }
  if (e.request.method !== 'GET' || url.origin !== location.origin) return; // API + fonts go to network
  // network first, fall back to cache (so updates show up as soon as they're online)
  e.respondWith(fetch(e.request).then(r => { const copy = r.clone(); caches.open(VERSION).then(c => c.put(e.request, copy)); return r; })
    .catch(() => caches.match(e.request).then(r => r || caches.match('index.html'))));
});
