// A cada deploy que mude QUALQUER arquivo do app (HTML, CSS, JS, imagens), troque este valor.
// É a troca de um único caractere neste arquivo que faz o navegador instalar a nova versão.
// Sugestão: 'ciclolocal-AAAA-MM-DD-n' (ex.: 'ciclolocal-2026-11-16-1').
const VERSAO = 'ciclolocal-2026-11-25-1';
const ARQUIVOS = [
  // Páginas (8)
  './', './index.html', './selecao-de-perfil.html',
  './perfil-doador.html', './confirmacao-doador.html', './historico-pedidos.html',
  './perfil-coletor.html', './confirmacao-coletor.html',
  './historico-coletas.html', './dashboard.html',

  // Estilos
  './reset.css', './tokens.css', './style.css',
  './preloader.css', './print.css', './img/icones/ui-pin.svg',

  // Módulos JavaScript (16)
  './js/app.js', './js/cep.js', './js/confirmacao-coletor.js',
  './js/confirmacao-doador.js', './js/dados.js', './js/dashboard.js',
  './js/esg.js', './js/filtro-bairro.js', './js/historico-coletas.js', './js/historico-pedidos.js',
  './js/local.js', './js/perfil-coletor.js', './js/perfil-doador.js',
  './js/preloader.js', './js/resultados.js', './js/storage.js', './js/util.js',

  './manifest.webmanifest'
];

// Imagens e ícones: úteis offline, mas a falta de um deles não deve impedir a instalação
const OPCIONAIS = [
  './img/cicloLocal-simbolo.svg', './img/favicon.svg', './img/icones/ui-pin.svg',
  './img/icones/icon-192.png',
  './img/icones/icon-512.png',
  './img/icones/icon-maskable-512.png',
  './img/apple-touch-icon.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(VERSAO).then(c =>
      c.addAll(ARQUIVOS.map(u => new Request(u, { cache: 'reload' })))
    )
  );
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

e.respondWith(
  fetch(e.request, { cache: 'no-cache' })
    .then(resposta => {
      if (resposta.ok && url.origin === self.location.origin) {
        const copia = resposta.clone();
        caches.open(VERSAO).then(c => c.put(e.request, copia));
      }
      return resposta;
    })
    .catch(() =>
      caches.match(e.request).then(r =>
        r || (e.request.mode === 'navigate'
          ? caches.match('./index.html')
          : new Response('', { status: 503 }))
      )
    )
);})
