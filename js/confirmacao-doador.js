// confirmacao-doador.js: "Pedidos" do doador (pedido atual, andamento e últimos pedidos concluídos)
import { ler } from './storage.js';
import { el, formatarKg, totalKg, dataCurta, ordenarConcluidas, descricaoMateriais } from './util.js';
import { preencherChamada } from './resultados.js';
import { MATERIAIS } from './dados.js';

const MAX_RECENTES = 3;

// Só os passos que ainda faltam: o que já aconteceu está no título e na etiqueta de situação
const ESTADOS = {
  esperando: {
    titulo: 'Pedido enviado!',
    subtitulo: 'Agora é só esperar um coletor aceitar. Você acompanha o andamento aqui.',
    situacao: 'Aguardando um coletor aceitar',
    classe: 'etiqueta',
    faltam: ['Aceito por um coletor', 'Material recolhido'],
  },
  aceita: {
    titulo: 'Um coletor aceitou o seu pedido!',
    subtitulo: 'Ele vai ao endereço recolher o material. Você acompanha o andamento aqui.',
    situacao: 'Aceito por um coletor',
    classe: 'etiqueta etiqueta-aceita',
    faltam: ['Material recolhido'],
  },
  concluida: {
    titulo: 'Material recolhido!',
    subtitulo: 'Obrigado por reciclar. O seu pedido já entrou nos resultados da reciclagem.',
    situacao: 'Material recolhido',
    classe: 'etiqueta etiqueta-aceita',
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

  const situacao = porId('situacao');
  situacao.className = estado.classe;
  situacao.textContent = estado.situacao;

  const primeira = pedido.bairro
    ? [el('strong', {}, pedido.bairro), ` · ${pedido.cidade} - ${pedido.uf}`]
    : [el('strong', {}, `${pedido.cidade} - ${pedido.uf}`)];
  porId('pedido-local').replaceChildren(...primeira);
  porId('pedido-endereco').textContent = `${pedido.logradouro ? `${pedido.logradouro}, ` : ''}${pedido.numero}`;
  porId('pedido-materiais').replaceChildren(
    ...pedido.materiais.map((m) => el('li', {}, `${MATERIAIS[m.id]} ${formatarKg(m.kg)}`)),
  );
  porId('pedido-total').textContent = formatarKg(totalKg(pedido.materiais));

  const lista = porId('andamento');
  lista.replaceChildren(...estado.faltam.map((etapa, i) => el('li', i === 0 ? { 'aria-current': 'step' } : {}, etapa)));
  lista.hidden = estado.faltam.length === 0;
  porId('nota-andamento').hidden = estado.faltam.length === 0;
}

// Últimos pedidos concluídos: só os do próprio doador (o endereço costuma ser o mesmo, então não mostra bairro)
function mostrarConcluidos(coletas, concluidas) {
  const meus = new Set(coletas.filter((c) => c.origem === 'doador').map((c) => c.id));
  const feitos = ordenarConcluidas(concluidas.filter((h) => meus.has(h.id)));
  porId('lista-feitas').replaceChildren(...feitos.slice(0, MAX_RECENTES).map((item) => el('li', {},
    el('strong', {}, formatarKg(totalKg(item.materiais))), ' ',
    el('small', {}, descricaoMateriais(item.materiais)), ' ',
    el('time', { datetime: item.data }, dataCurta(item.data)))));
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