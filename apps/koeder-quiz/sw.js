// Minimaler Service Worker: Cache-first für eigene Ressourcen -> offline nutzbar.
const CACHE = 'kq-v8';

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll([
    './',
    './index.html',
    './app.mjs',
    './daten/fragen.json',
    './manifest.webmanifest',
    './eltern.html',
    '../../packages/kinder-ui/css/kinder.css',
    '../../packages/kinder-ui/js/komponenten.mjs',
    '../../packages/quiz-kern/src/quiz.mjs',
    '../../packages/kinder-ui/js/anzeige.mjs',
    '../../packages/kinder-ui/js/daten-karte.mjs',
    '../../packages/kinder-ui/js/hilfe-insel.mjs',
    '../../packages/quiz-kern/src/staffel.mjs',
    '../../packages/kinderschutz/src/index.mjs',
    '../../packages/kinderschutz/src/kriterien.mjs',
  ])));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((alte) => Promise.all(alte.filter((k) => k !== CACHE).map((k) => caches.delete(k)))));
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== self.location.origin) return;
  e.respondWith(caches.match(e.request).then((treffer) => treffer ?? fetch(e.request)));
});
