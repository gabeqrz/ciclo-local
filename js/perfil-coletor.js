// perfil-coletor.js: perfil-coletor.html
import { ler, atualizar } from './storage.js';
import { el, formatarKg, totalKg, rotuloCidade } from './util.js';
import { linhaMaterial } from './util.js';
import { obterLocal, abrirTrocaDeCidade } from './local.js';
import { montarFiltroBairro } from './filtro-bairro.js';
import { resultados } from './resultados.js';

const textoCidade = document.getElementById('cidade-atual');
const avisoLocal = document.getElementById('aviso-local');
const lista = document.getElementById('lista-pedidos');
const vazio = document.getElementById('sem-pedidos');
const barra = document.getElementById('barra-aceite');
const resumo = document.getElementById('resumo-aceites');
const aceitasAgora = new Set(); // pedidos aceitos nesta visita à página

function cartao(coleta) {
  const aceita = aceitasAgora.has(coleta.id);
  const botao = el('button', {
    type: 'button',
    class: aceita ? 'botao botao-sec' : 'botao',
    'data-id': coleta.id,
    'aria-label': `${aceita ? 'Desfazer o aceite da' : 'Aceitar'} coleta em ${coleta.bairro}`,
  }, aceita ? 'Coleta aceita · Desfazer' : 'Aceitar coleta');
  return el('article', { 'aria-labelledby': `p-${coleta.id}` },
    el('h3', { id: `p-${coleta.id}` }, coleta.bairro),
    el('ul', { class: 'materiais' }, ...coleta.materiais.map((m) => el('li', {}, linhaMaterial(m))),
    el('p', {}, 'Total: ', el('strong', {}, formatarKg(totalKg(coleta.materiais)))),
    botao));
}

function renderizar() {
  const { local, coletas } = ler();
  const rotulo = rotuloCidade(local);
  const visiveis = coletas.filter((c) => c.cidade === rotulo
    && (!local.bairro || c.bairro === local.bairro)
    && (c.status === 'esperando' || aceitasAgora.has(c.id)));
  lista.replaceChildren(...visiveis.map(cartao));
  vazio.hidden = visiveis.length > 0;
  vazio.textContent = `Nenhum pedido esperando em ${local.bairro || rotulo} agora.`;

  const aceitas = coletas.filter((c) => aceitasAgora.has(c.id) && c.status === 'aceita');
  barra.hidden = aceitas.length === 0;
  resumo.textContent = `${aceitas.length} ${aceitas.length === 1 ? 'coleta aceita' : 'coletas aceitas'} · ${formatarKg(aceitas.reduce((s, c) => s + totalKg(c.materiais), 0))}`;
}

function montarFiltro() {
  const { local } = ler();
  const r = resultados(rotuloCidade(local));
  montarFiltroBairro({
    grupo: document.getElementById('filtro-bairro'),
    painel: document.getElementById('outro-bairro'),
    bairros: r ? r.bairros.map((b) => b.nome) : [],
    selecionado: local.bairro,
    aoEscolher: (bairro) => {
      atualizar((e) => { e.local.bairro = bairro; });
      montarFiltro();
      renderizar();
    },
  });
}

// Aceitar / desfazer
lista.addEventListener('click', (evento) => {
  const botao = evento.target.closest('button[data-id]');
  if (!botao) return;
  const id = botao.dataset.id;
  const desfazer = aceitasAgora.has(id);
  atualizar((e) => {
    const coleta = e.coletas.find((c) => c.id === id);
    if (!coleta) return;
    if (desfazer) { coleta.status = 'esperando'; delete coleta.aceitaEm; }
    else { coleta.status = 'aceita'; coleta.aceitaEm = Date.now(); }
  });
  if (desfazer) aceitasAgora.delete(id); else aceitasAgora.add(id);
  renderizar();
  lista.querySelector(`[data-id='${id}']`)?.focus();
});

document.getElementById('trocar-cidade').addEventListener('click', () => {
  abrirTrocaDeCidade(() => {
    textoCidade.textContent = rotuloCidade(ler().local);
    avisoLocal.textContent = '';
    montarFiltro();
    renderizar();
  });
});

// Primeiro mostra o que já se sabe e depois confirma a cidade pela geolocalização
textoCidade.textContent = rotuloCidade(ler().local);
montarFiltro();
renderizar();
obterLocal({ aoAviso: (mensagem) => { avisoLocal.textContent = mensagem; } }).then((local) => {
  textoCidade.textContent = rotuloCidade(local);
  montarFiltro();
  renderizar();
});