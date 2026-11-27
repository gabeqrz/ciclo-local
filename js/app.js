// app.js: carregado em todas as páginas
import { reiniciar, ler, atualizar } from './storage.js';

// Para recomeçar a demonstração, digite reiniciarDemo() no Console do navegador
window.reiniciarDemo = () => {
  reiniciar();
  window.location.reload();
};

/* ----- Menu principal: uma definição só, igual em todas as páginas -----
   Início · Coletas (ou Pedidos, para quem doa) · Resultados · Sair.
   "Sair" apaga o localStorage (reiniciar) antes de voltar para a entrada. */
const pagina = location.pathname.split('/').pop() || 'index.html';
const paginaDoador = /doador|pedidos/.test(pagina);
const paginaColetor = /coletor|coletas/.test(pagina);

function perfilAtual() {
  if (paginaDoador || paginaColetor) {
    const perfil = paginaDoador ? 'doador' : 'coletor';
    if (ler().perfil !== perfil) atualizar((e) => { e.perfil = perfil; });
    return perfil;
  }
  const estado = ler();
  return estado.perfil ?? (estado.pedidoDoador ? 'doador' : 'coletor');
}

const listaMenu = document.querySelector('nav[aria-label="Menu principal"] ul');
if (listaMenu) {
  const doador = perfilAtual() === 'doador';
  const itens = [
    { href: './selecao-de-perfil.html', texto: 'Início', atual: ['selecao-de-perfil.html', 'perfil-doador.html'].includes(pagina) },
    doador
      ? { href: './confirmacao-doador.html', texto: 'Pedidos', atual: ['confirmacao-doador.html', 'historico-pedidos.html'].includes(pagina) }
      : { href: './perfil-coletor.html', texto: 'Coletas', atual: paginaColetor },
    { href: './dashboard.html', texto: 'Resultados', atual: pagina === 'dashboard.html' },
    { href: './index.html', texto: 'Sair', sair: true },
  ];
  listaMenu.replaceChildren(...itens.map(({ href, texto, atual, sair }) => {
    const link = document.createElement('a');
    link.href = href;
    link.textContent = texto;
    if (atual) link.setAttribute('aria-current', 'page');
    if (sair) link.dataset.sair = '';
    const item = document.createElement('li');
    item.append(link);
    return item;
  }));
  listaMenu.addEventListener('click', (evento) => {
    if (evento.target.closest('[data-sair]')) reiniciar();
  });
}


let eventoInstalar = null;
const botaoInstalar = document.getElementById('botao-instalar');

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  eventoInstalar = e;
  if (botaoInstalar) botaoInstalar.hidden = false;
});

botaoInstalar?.addEventListener('click', async () => {
  if (!eventoInstalar) return;
  eventoInstalar.prompt();
  await eventoInstalar.userChoice;
  eventoInstalar = null;
  botaoInstalar.hidden = true;
});

window.addEventListener('appinstalled', () => {
  if (botaoInstalar) botaoInstalar.hidden = true;
});

// VLibras (acessibilidade em Libras)
function iniciarVLibras() {
  const script = document.createElement('script');
  script.src = 'https://vlibras.gov.br/app/vlibras-plugin.js';

  script.onload = () => {
    new window.VLibras.Widget({
      rootPath: 'https://vlibras.gov.br/app',
      avatar: 'icaro',
      position: 'R',
    });

    // personalização do botão (opcional)
    let tentativas = 0;
    const esperar = setInterval(() => {
      const btn = window.VLibrasWidget && window.VLibrasWidget.initBtn;
      if (btn) {
        clearInterval(esperar);
        btn.style.border = '2px solid #F7F5F0';
        // teste aqui o deslocamento vertical, ex.: btn.style.bottom = '80px';
      } else if (++tentativas > 30) {
        clearInterval(esperar);
      }
    }, 300);
  };

  // offline ou bloqueado: o site segue normal, sem erro
  script.onerror = () => {};

  document.body.appendChild(script);
}

iniciarVLibras();