// confirmacao-doador.js: "Pedidos" do doador (pedido atual, andamento e últimos pedidos concluídos)
import { ler } from './storage.js';
import { el, formatarKg, totalKg, dataCurta, ordenarConcluidas, descricaoMateriais } from './util.js';
import { preencherChamada } from './resultados.js';
import { MATERIAIS } from './dados.js';

const MAX_RECENTES = 3;

// Uma só forma de acompanhar: as próximas etapas, cada uma explicada. O título já diz onde o pedido está.
const ETAPAS = {
  aceito: {
    titulo: 'Aceito por um coletor',
    texto: 'Um coletor aceita o seu pedido. Quando isso acontecer, o andamento muda aqui.',
  },
  recolhido: {
    titulo: 'Material recolhido',
    texto: 'O coletor vai até o endereço e confirma o peso. Depois disso, o pedido entra nos resultados da reciclagem.',
  },
};

const ESTADOS = {
  esperando: {
    titulo: 'Pedido enviado!',
    subtitulo: 'Agora é só esperar um coletor aceitar. Você acompanha o andamento aqui.',
    faltam: ['aceito', 'recolhido'],
  },
  aceita: {
    titulo: 'Um coletor aceitou o seu pedido!',
    subtitulo: 'Ele vai ao endereço recolher o material. Você acompanha o andamento aqui.',
    faltam: ['recolhido'],
  },
  concluida: {
    titulo: 'Material recolhido!',
    subtitulo: 'Obrigado por reciclar. O seu pedido já entrou nos resultados da reciclagem.',
    faltam: [],
  },
};

const porId = (id) => document.getElementById(id);

function mostrarPedido(pedido, coletas) {
  const status = coletas.find((c) => c.id === pedido.id)?.status;
  const estado = ESTADOS[status] ?? ESTADOS.esperando;

  porId('titulo').textContent = estado.titulo;
  porId('subtitulo').textContent = estado.subtitulo;
  porId('t-pedido').textContent = status === 'concluida' ? 'O seu pedido foi recolhido' : 'O seu pedido já foi enviado para a coleta';

  const primeira = pedido.bairro
    ? [el('strong', {}, pedido.bairro), ` · ${pedido.cidade} - ${pedido.uf}`]
    : [el('strong', {}, `${pedido.cidade} - ${pedido.uf}`)];
  porId('pedido-local').replaceChildren(...primeira);
  porId('pedido-endereco').textContent = `${pedido.logradouro ? `${pedido.logradouro}, ` : ''}${pedido.numero}`;
  porId('pedido-materiais').replaceChildren(
    ...pedido.materiais.map((m) => el('li', {}, `${MATERIAIS[m.id]} ${formatarKg(m.kg)}`)),
  );
  porId('pedido-total').textContent = formatarKg(totalKg(pedido.materiais));

  porId('andamento').replaceChildren(...estado.faltam.map((chave, i) => el('li', i === 0 ? { 'aria-current': 'step' } : {},
    el('div', {}, el('strong', {}, ETAPAS[chave].titulo), el('span', {}, ETAPAS[chave].texto)))));
  porId('secao-etapas').hidden = estado.faltam.length === 0;
}

// Últimos pedidos concluídos: só os do próprio doador. A data identifica o pedido (o endereço costuma ser o mesmo)
function mostrarConcluidos(coletas, concluidas) {
  const meus = new Set(coletas.filter((c) => c.origem === 'doador').map((c) => c.id));
  const feitos = ordenarConcluidas(concluidas.filter((h) => meus.has(h.id)));
  porId('lista-feitas').replaceChildren(...feitos.slice(0, MAX_RECENTES).map((item) => el('li', {},
    el('strong', {}, `Recolhido em ${dataCurta(item.data)}`), ' ',
    el('small', {}, descricaoMateriais(item.materiais)), ' ',
    el('span', { class: 'kg-pedido' }, formatarKg(totalKg(item.materiais))))));
  porId('sem-feitos').hidden = feitos.length > 0;
}

function atualizarPagina() {
  const { pedidoDoador: pedido, coletas, concluidas } = ler();
  const semPedido = !pedido;
  porId('dados-pedido').hidden = semPedido;
  porId('sem-pedido').hidden = !semPedido;
  if (semPedido) {
    porId('titulo').textContent = 'Você ainda não tem pedidos';
    porId('subtitulo').textContent = 'Avise quando tiver material e acompanhe o andamento aqui.';
    porId('t-pedido').textContent = 'Seu pedido';
  } else {
    mostrarPedido(pedido, coletas);
  }
  mostrarConcluidos(coletas, concluidas);
}

atualizarPagina();
preencherChamada((escopo, rotulo) => (escopo ? `Veja o que o bairro ${escopo} já recicla` : `Veja o que ${rotulo} já recicla`));

// O coletor pode aceitar ou concluir em outra aba, ou a página voltar do cache ao usar "Voltar":
// nesses casos o script não roda de novo, então relemos o estado.
window.addEventListener('storage', (e) => { if (e.key === 'ciclolocal:v1') atualizarPagina(); });
window.addEventListener('pageshow', (e) => { if (e.persisted) atualizarPagina(); });
document.addEventListener('visibilitychange', () => { if (!document.hidden) atualizarPagina(); });