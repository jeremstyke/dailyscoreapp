// Daily Score service worker: makes the web version installable and opens instantly.
// The page is always fetched fresh from the network first (the cached copy is only used offline).
const CACHE = 'ds-v3';
const SHELL = ['/', '/icon-192.png', '/icon-512.png', '/logo-96.png'];
self.addEventListener('install', (e) => { e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener('activate', (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', (e) => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin || u.pathname.endsWith('.apk')) return;
  // the game page itself skips the phone's HTTP cache, so a new version shows up at the next opening
  const fresh = e.request.mode === 'navigate' || u.pathname === '/' || u.pathname.endsWith('.html');
  e.respondWith(fetch(e.request, fresh ? { cache: 'no-cache' } : undefined).then((r) => { const copy = r.clone(); caches.open(CACHE).then((c) => c.put(e.request, copy)); return r; }).catch(() => caches.match(e.request, { ignoreSearch: true })));
});

// Phone notifications: the server sends an empty push, the text is fetched here, then shown.
const API = 'https://pote-ia-bot-en-production.up.railway.app';
self.addEventListener('push', (e) => {
  e.waitUntil((async () => {
    let d = {};
    try {
      const sub = await self.registration.pushManager.getSubscription();
      const r = await fetch(API + '/ds/push/last', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ endpoint: sub && sub.endpoint }) });
      d = await r.json();
    } catch (err) {}
    await self.registration.showNotification(d.title || 'Daily Score ⚽', { body: d.body || '', icon: '/icon-192.png', badge: '/icon-192.png', tag: 'ds-' + (d.at || Date.now()), data: { url: d.url || '/' } });
  })());
});
// a tap on the notification opens the game at the right place
self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  const url = (e.notification.data && e.notification.data.url) || '/';
  e.waitUntil(clients.matchAll({ type: 'window', includeUncontrolled: true }).then((ws) => {
    for (const w of ws) if ('navigate' in w) { w.focus(); return w.navigate(url); }
    return clients.openWindow(url);
  }));
});
