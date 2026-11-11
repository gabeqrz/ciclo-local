// dashboard.js
import { ler, atualizar } from './storage.js';
import { el, formatarKg, rotuloCidade } from './util.js';
import { resultados } from './resultados.js';
import { obterLocal, abrirTrocaDeCidade } from './local.js';
import { montarFiltroBairro } from './filtro-bairro.js';

const MAX_BAIRROS = 5;
let mostrarTodosBairros = false;

const textoCidade = document.getElementById('cidade-atual');
const avisoLocal = document.getElementById('aviso-local');
const escopo = document.getElementById('escopo');
const semDados = document.getElementById('sem-dados');
const metaTexto = document.getElementById('meta-texto');
const barraMeta = document.getElementById('barra-meta');
const numeros = document.getElementById('numeros');
const listaMateriais = document.getElementById('lista-materiais');
const colunas = document.getElementById('colunas-mes');
const listaBairros = document.getElementById('lista-bairros');
const botaoBairros = document.getElementById('ver-bairros');

const largura = (valor, maximo) => `${Math.max(2, Math.round((valor / maximo) * 100))}%`;
const linhaBarra = (nome, kg, maximo, destaque = false) => el('li',
  { style: `--pct: ${largura(kg, maximo)}`, class: destaque ? 'destaque' : null },
  el('span', {}, nome),
  el('span', { class: 'trilho', 'aria-hidden': 'true' }),
  el('b', {}, formatarKg(kg)));

function montarFiltro(r) {
  montarFiltroBairro({
    grupo: document.getElementById('filtro-bairro'),
    painel: document.getElementById('outro-bairro'),
    bairros: r ? r.bairros.map((b) => b.nome) : [],
    selecionado: r ? r.escopo : null,
    aoEscolher: (bairro) => {
      atualizar((e) => { e.local.bairro = bairro; });
      renderizar();
    },
  });
}

function renderizar() {
  const { local } = ler();
  const rotulo = rotuloCidade(local);
  const r = resultados(rotulo, local.bairro);

  textoCidade.textContent = rotulo;
  semDados.hidden = Boolean(r);
  semDados.textContent = `Ainda não temos dados de exemplo para ${rotulo}. No modo demonstração, só São Paulo - SP tem resultados.`;
  document.querySelectorAll('[data-resultado]').forEach((secao) => { secao.hidden = !r; });
  montarFiltro(r);
  if (!r) { escopo.textContent = ''; return; }

  escopo.textContent = r.escopo
    ? `Mostrando só o bairro ${r.escopo} de ${rotulo}`
    : `Mostrando todos os bairros de ${rotulo}`;

  metaTexto.replaceChildren(el('strong', {}, formatarKg(r.mes)), ` de ${formatarKg(r.meta)} (${r.pct}%)`);
  barraMeta.max = r.meta;
  barraMeta.value = Math.min(r.mes, r.meta);

  const itens = [
    ['recolhidos até agora', formatarKg(r.total)],
    ['coletas feitas', String(r.coletas)],
    ['pessoas participando', String(r.pessoas)],
    ['pedidos esperando', String(r.pedidos)],
    ['de poluição (CO₂) que deixou de ir para o ar (valor estimado)', formatarKg(r.co2)],
  ];
  numeros.replaceChildren(...itens.map(([rotuloItem, valor]) => el('div', {}, el('dt', {}, rotuloItem), el('dd', {}, valor))));

  listaMateriais.replaceChildren(...r.materiais.map((m) => linhaBarra(m.nome, m.kg, r.materiais[0].kg || 1)));

  const maiorMes = Math.max(...r.meses.map((m) => m.kg)) || 1;
  colunas.replaceChildren(...r.meses.map((m) => el('li', { style: `--pct: ${largura(m.kg, maiorMes)}` },
    el('span', { class: 'mes' }, m.nome),
    el('b', {}, String(m.kg)),
    el('span', { class: 'coluna', 'aria-hidden': 'true' }))));

  // ranking: 5 primeiros; "Ver todos" expande o restante (demonstração)
  const exibidos = mostrarTodosBairros ? r.bairros : r.bairros.slice(0, MAX_BAIRROS);
  listaBairros.replaceChildren(...exibidos.map((b) => linhaBarra(b.nome, b.kg, r.bairros[0].kg || 1, b.nome === r.escopo)));
  botaoBairros.hidden = r.bairros.length <= MAX_BAIRROS;
  botaoBairros.textContent = mostrarTodosBairros
    ? `Mostrar só os ${MAX_BAIRROS} primeiros`
    : `Ver todos os bairros (${r.bairros.length})`;
}

botaoBairros.addEventListener('click', () => { mostrarTodosBairros = !mostrarTodosBairros; renderizar(); });
document.getElementById('trocar-cidade').addEventListener('click', () => {
  abrirTrocaDeCidade(() => { avisoLocal.textContent = ''; renderizar(); });
});
document.getElementById('baixar-pdf').addEventListener('click', () => window.print());

renderizar();
obterLocal({ aoAviso: (mensagem) => { avisoLocal.textContent = mensagem; } }).then(renderizar);