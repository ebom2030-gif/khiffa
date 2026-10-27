// إشعارات OneSignal (لازم تكون أول سطر في الـ service worker)
try { importScripts('https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.sw.js'); } catch (e) {}
// خفّة — offline shell. Bump VERSION on every release so phones pick up the new files.
const VERSION = 'khiffa-v28';
const IMG = 'khiffa-img';
const SHELL = ['./', 'index.html', 'config.js', 'data.js', 'app.js', 'theme.js', 'search.js', 'dashboard.js', 'reports.js', 'features.js', 'skin.js', 'photos.js', 'reminders.js', 'ux.js', 'ux2.js', 'inbody.js', 'print.js', 'accounts.js', 'logos.js', 'install.js', 'community.js', 'food-entry.js', 'coaching.js', 'responsive.js', 'notifications.js', 'manifest.webmanifest', 'icon.svg', 'icon-180.png', 'icon-192.png', 'icon-512.png', 'apple-touch-icon.png'].map(file => file.endsWith('.js') ? file + '?v=28' : file);
self.addEventListener('install', e => { e.waitUntil(caches.open(VERSION).then(c => c.addAll(SHELL)));  });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION && k !== IMG).map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method === 'GET' && (url.hostname === 'images.unsplash.com' || url.hostname === 'cdn.jsdelivr.net')) { // photos + 3D icons: cache first = instant + offline
    e.respondWith(caches.open(IMG).then(c => c.match(e.request).then(hit => hit || fetch(e.request).then(r => { c.put(e.request, r.clone()); return r; }))));
    return;
  }
  if (e.request.method !== 'GET' || url.origin !== location.origin) return; // API + fonts go to network
  // network first, fall back to cache (so updates show up as soon as they're online)
  // network first (updates show right away), but if the network is slow (>2.5s) serve the saved copy
  const net = fetch(e.request).then(r => { const copy = r.clone(); caches.open(VERSION).then(c => c.put(e.request, copy)); return r; });
  const slow = new Promise(res => setTimeout(res, 2500)).then(() => caches.match(e.request)).then(r => r || net);
  e.respondWith(Promise.race([net.catch(() => slow), slow]).catch(() => caches.match(e.request).then(r => r || caches.match('index.html'))));
});

self.addEventListener('message', e => { if(e.data && e.data.type === 'KHIFFA_ACTIVATE') self.skipWaiting(); });
