// LEXAI Mòbil — Service Worker
// Cache de l'aplicació (shell) perquè funcioni sense connexió un cop carregada.
// Les dades (previsions importades) viuen a localStorage, no aquí.

const CACHE_NAME = 'lexai-mobil-v49';
const APP_SHELL = [
  './',
  './index.html',
  './styles.css?v=186',
  './app.js?v=186',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  'https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.4.1/papaparse.min.js',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = event.request.url;

  // Les peticions a GitHub (dades dinàmiques: previsions, pomodoros
  // pendents, previsions noves...) MAI s'han de servir de la cache -- si
  // no, un cop es cacheja la primera resposta, "Actualitzar des de
  // GitHub" tornava sempre la mateixa versió antiga per sempre, encara
  // que hi hagués dades noves al repositori.
  if (url.includes('raw.githubusercontent.com') || url.includes('api.github.com')) {
    event.respondWith(fetch(event.request));
    return;
  }

  // Cache-first per a la resta (l'"shell" de l'app): si el tenim al
  // cache, servim d'allà; si no, anem a la xarxa i el guardem per la
  // propera vegada (útil per l'actualització silenciosa).
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request)
        .then((resp) => {
          if (resp && resp.status === 200 && event.request.method === 'GET') {
            const respClone = resp.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, respClone));
          }
          return resp;
        })
        .catch(() => cached);
    })
  );
});
