const VERSAO = 'ciclolocal-v4';
const ARQUIVOS = [
  './', './index.html', './selecao-de-perfil.html',
  './perfil-doador.html', './confirmacao-doador.html',
  './perfil-coletor.html', './confirmacao-coletor.html',
  './dashboard.html',
  './reset.css', './tokens.css', './style.css',
  './preloader.css', './print.css',
  './js/app.js', './js/preloader.js', './js/storage.js',
  './js/esg.js', './js/cep.js', './js/perfil-doador.js', './js/util.js',
  './img/cicloLocal-simbolo.svg', './img/favicon.svg', './img/icones/ui-pin.svg', './manifest.webmanifest',
  './img/icones/icon-192.png',
  './img/icones/icon-512.png',
  './img/icones/icon-maskable-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSAO).then(c => c.addAll(ARQUIVOS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(chaves =>
      Promise.all(chaves.filter(k => k !== VERSAO).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET') return;

  // ViaCEP: sempre rede (o cep.js já trata a falha)
  if (url.hostname === 'viacep.com.br') return;

  // Google Fonts: cache ao primeiro uso
  if (url.hostname.includes('googleapis.com') || url.hostname.includes('gstatic.com')) {
    e.respondWith(
      caches.open(VERSAO).then(async c => {
        const cache = await c.match(e.request);
        return cache || fetch(e.request).then(r => { c.put(e.request, r.clone()); return r; });
      })
    );
    return;
  }

  // Arquivos do app: cache primeiro, rede como reserva
  e.respondWith(
  caches.match(e.request)
    .then(r => r || fetch(e.request))
    .catch(() => {
      if (e.request.mode === 'navigate') return caches.match('./index.html');
      return new Response('', { status: 503 });
    })
)})