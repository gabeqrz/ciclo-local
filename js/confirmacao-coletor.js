// confirmacao-coletor.js
import { ler, atualizar } from './storage.js';
import { el, formatarKg, totalKg, hojeISO, dataCurta } from './util.js';
import { MATERIAIS } from './dados.js';
import { preencherChamada } from './resultados.js';
import { linhaMaterial } from './util.js';
import { descricaoMateriais } from './util.js'; 
import { ordenarConcluidas } from './util.js';

const MAX_RECENTES = 5;
const PESOS = [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 6, 7, 8, 9, 10];

const titulo = document.getElementById('titulo');
const subtitulo = document.getElementById('subtitulo');
const nAbertas = document.getElementById('n-abertas');
const aviso = document.getElementById('aviso');
const semAbertas = document.getElementById('sem-abertas');
const listaAbertas = document.getElementById('lista-abertas');
const listaFeitas = document.getElementById('lista-feitas');
const totalFeitas = document.getElementById('total-concluidas');
const dialogo = document.getElementById('dialogo-desistir');

let idDesistindo = null;

// "Nova" = aceita depois da última vez que esta página foi aberta
const inicial = ler();
const novas = new Set(inicial.coletas
  .filter((c) => c.status === 'aceita' && c.aceitaEm > inicial.ultimaVisitaAceitas)
  .map((c) => c.id));
atualizar((e) => { e.ultimaVisitaAceitas = Date.now(); });

const pesosDo = (form) => [...form.querySelectorAll('select')].map((s) => ({ id: s.name, kg: Number(s.value) }));
function avisar(mensagem) { aviso.textContent = mensagem; aviso.focus(); }

// Título no singular ou no plural, conforme as coletas aceitas no passo anterior
function definirTitulo() {
  const quantas = novas.size || inicial.coletas.filter((c) => c.status === 'aceita').length;
  if (quantas === 0) {
    titulo.textContent = 'Nenhuma coleta aceita';
    subtitulo.textContent = 'Aceite pedidos para vê-los aqui.';
    return;
  }
  const plural = quantas > 1;
  titulo.textContent = plural ? 'Coletas aceitas!' : 'Coleta aceita!';
  subtitulo.textContent = plural
    ? 'Retire o material em cada endereço e depois marque cada coleta como concluída.'
    : 'Retire o material no endereço e depois marque a coleta como concluída.';
}

function cartaoAberto(coleta) {
  const nova = novas.has(coleta.id);
  const selects = coleta.materiais.map((m) => {
    const id = `kg-${coleta.id}-${m.id}`;
    // 3º argumento = valor combinado (volta para ele no "Cancelar"); 4º = selecionado
    const select = el('select', { id, name: m.id }, ...PESOS.map((p) => new Option(formatarKg(p), p, p === m.kg, p === m.kg)));
    return el('div', {}, el('label', { for: id }, MATERIAIS[m.id]), select);
  });
  const total = el('output', {}, formatarKg(totalKg(coleta.materiais)));
  const form = el('form', {},
    el('fieldset', {},
      el('legend', {}, 'Quanto você recolheu?'),
      el('p', {}, 'Ajuste o peso de cada material se for diferente do combinado.'),
      ...selects),
    el('p', {}, 'Total recolhido: ', total),
    el('button', { type: 'submit' }, 'Marcar como concluída'),
    el('button', { type: 'reset' }, 'Cancelar'));

  form.addEventListener('change', () => { total.textContent = formatarKg(totalKg(pesosDo(form))); });
  form.addEventListener('reset', () => {
    setTimeout(() => { total.textContent = formatarKg(totalKg(pesosDo(form))); }, 0);
    const painel = form.closest('details');
    painel.open = false;
    painel.querySelector('summary').focus();
  });
  form.addEventListener('submit', (evento) => { evento.preventDefault(); concluir(coleta, pesosDo(form)); });

  return el('article', { 'data-id': coleta.id },
    el('p', { class: nova ? 'etiqueta' : 'etiqueta etiqueta-aceita' }, nova ? 'Nova' : 'Aguardando coleta'),
    el('h3', {}, coleta.bairro),
    el('p', {}, 'Retirar em: ', el('strong', {}, coleta.endereco)),
    el('ul', { class: 'materiais' }, ...coleta.materiais.map((m) => el('li', {}, `${MATERIAIS[m.id]} ${formatarKg(m.kg)}`))),
    el('details', {}, el('summary', {}, 'Coleta feita'), form),
    el('button', { type: 'button', class: 'desistir' }, 'Desistir da coleta'));
}

function renderizarConcluidas() {
  // mais recentes primeiro (na mesma data, a última registrada vem antes)
  const todas = ordenarConcluidas(ler().concluidas);
  const exibidas = todas.slice(0, MAX_RECENTES);
  listaFeitas.replaceChildren(...exibidas.map((item) => el('li', {},
    el('strong', {}, item.bairro), ' ',
    el('small', {}, descricaoMateriais(item.materiais)), ' ',
    el('time', { datetime: item.data }, dataCurta(item.data)))));
  totalFeitas.textContent = `${todas.length} ${todas.length === 1 ? 'entrega concluída' : 'entregas concluídas'} no total`;
}

function renderizar() {
  const abertas = ler().coletas
    .filter((c) => c.status === 'aceita')
    .sort((a, b) => (novas.has(b.id) - novas.has(a.id)) || b.aceitaEm - a.aceitaEm);
  listaAbertas.replaceChildren(...abertas.map(cartaoAberto));
  nAbertas.textContent = abertas.length;
  semAbertas.hidden = abertas.length > 0;
  renderizarConcluidas();
  preencherChamada((escopo, rotulo) => (escopo
    ? `Suas coletas concluídas contam na meta do bairro ${escopo}`
    : `Suas coletas concluídas contam na meta de ${rotulo}`));
}

function concluir(coleta, materiais) {
  atualizar((e) => {
    const c = e.coletas.find((x) => x.id === coleta.id);
    if (!c) return;
    c.status = 'concluida';
    e.concluidas.push({ id: c.id, cidade: c.cidade, bairro: c.bairro, materiais, data: hojeISO(), extra: true });
  });
  novas.delete(coleta.id);
  renderizar();
  avisar(`Coleta em ${coleta.bairro} concluída. Ela entrou nas últimas entregas.`);
}

// Desistir da coleta (com confirmação)
listaAbertas.addEventListener('click', (evento) => {
  const botao = evento.target.closest('.desistir');
  if (!botao) return;
  idDesistindo = botao.closest('article').dataset.id;
  dialogo.showModal();
});
document.getElementById('cancela-desistir').addEventListener('click', () => dialogo.close());
document.getElementById('confirma-desistir').addEventListener('click', () => {
  let bairro = '';
  atualizar((e) => {
    const c = e.coletas.find((x) => x.id === idDesistindo);
    if (!c) return;
    bairro = c.bairro;
    c.status = 'esperando';
    delete c.aceitaEm;
  });
  novas.delete(idDesistindo);
  idDesistindo = null;
  dialogo.close();
  renderizar();
  avisar(`Você desistiu da coleta em ${bairro}. O pedido voltou para a lista de pedidos esperando você.`);
});


definirTitulo();
renderizar();