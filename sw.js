/* SomniaVibes Founder Edition Service Worker */
const CACHE_VERSION = 'somniavibes-founder-v3';
const APP_SHELL = ['./','./index.html','./manifest.json','./sw.js','./README_START_HERE.txt'];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_VERSION).then(cache => Promise.all(APP_SHELL.map(asset => fetch(new Request(asset,{cache:'reload'})).then(r => r.ok ? cache.put(asset,r) : null).catch(()=>null)))).then(()=>self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE_VERSION).map(key => caches.delete(key)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).then(response => { const copy=response.clone(); caches.open(CACHE_VERSION).then(cache=>cache.put('./index.html',copy)); return response; }).catch(()=>caches.match('./index.html').then(cached=>cached||caches.match('./'))));
    return;
  }
  event.respondWith(caches.match(request).then(cached => cached || fetch(request).then(response => { if (response && response.ok) { const copy=response.clone(); caches.open(CACHE_VERSION).then(cache=>cache.put(request,copy)); } return response; })));
});
