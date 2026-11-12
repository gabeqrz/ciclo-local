// historico-coletas.js: historico-coletas.html
import { ler } from './storage.js';
import { el, formatarKg, totalKg, dataCurta, rotuloMes, descricaoMateriais, ordenarConcluidas } from './util.js';
import { co2Evitado } from './esg.js';

const POR_PAGINA = 10;

const filtroMes = document.getElementById('filtro-mes');
const filtroBairro = document.getElementById('filtro-bairro-hist');
const resumo = document.getElementById('resumo-historico');
const status = document.getElementById('status-historico');
const lista = document.getElementById('lista-historico');
const vazio = document.getElementById('sem-historico');
const botaoMais = document.getElementById('mais-historico');

const todas = ordenarConcluidas(ler().concluidas);
let limite = POR_PAGINA;

// Opções dos filtros: só o que existe no histórico
const meses = [...new Set(todas.map((c) => c.data.slice(0, 7)))]; // já em ordem decrescente
const bairros = [...new Set(todas.map((c) => c.bairro))].sort((a, b) => a.localeCompare(b, 'pt-BR'));
filtroMes.replaceChildren(new Option('Todos os meses', ''), ...meses.map((m) => new Option(rotuloMes(m), m)));
filtroBairro.replaceChildren(new Option('Todos os bairros', ''), ...bairros.map((b) => new Option(b, b)));

const filtradas = () => todas.filter((c) => (!filtroMes.value || c.data.startsWith(filtroMes.value))
  && (!filtroBairro.value || c.bairro === filtroBairro.value));

const cartaoNumero = (rotulo, valor) => el('li', {}, el('b', {}, valor), el('span', {}, rotulo));

const itemEntrega = (c) => el('li', {},
  el('strong', {}, c.bairro), ' ',
  el('small', {}, descricaoMateriais(c.materiais)), ' ',
  el('time', { datetime: c.data }, dataCurta(c.data)));

function renderizar() {
  const achadas = filtradas();
  const exibidas = achadas.slice(0, limite);

  resumo.replaceChildren(
    cartaoNumero('entregas concluídas', String(achadas.length)),
    cartaoNumero('recolhidos', formatarKg(achadas.reduce((soma, c) => soma + totalKg(c.materiais), 0))),
    cartaoNumero('de poluição (CO₂) que deixou de ir para o ar (valor estimado)',
      formatarKg(Math.round(co2Evitado(achadas.flatMap((c) => c.materiais))))));

  // agrupa por mês, mantendo a ordem (mais recentes primeiro)
  const grupos = [];
  for (const c of exibidas) {
    const mes = c.data.slice(0, 7);
    let grupo = grupos.at(-1);
    if (!grupo || grupo.mes !== mes) { grupo = { mes, itens: [] }; grupos.push(grupo); }
    grupo.itens.push(c);
  }
  lista.replaceChildren(...grupos.flatMap((g) => [
    el('h3', {}, rotuloMes(g.mes)),
    el('ul', { class: 'entregas' }, ...g.itens.map(itemEntrega)),
  ]));

  status.textContent = achadas.length
    ? `Mostrando ${exibidas.length} de ${achadas.length} ${achadas.length === 1 ? 'entrega' : 'entregas'}`
    : '';
  vazio.hidden = achadas.length > 0;
  vazio.textContent = todas.length === 0
    ? 'Você ainda não concluiu nenhuma coleta. Aceite um pedido e marque como concluído para ele aparecer aqui.'
    : 'Nenhuma entrega encontrada com esses filtros.';
  botaoMais.hidden = exibidas.length >= achadas.length;
  botaoMais.textContent = `Mostrar mais (${achadas.length - exibidas.length} restantes)`;
}

[filtroMes, filtroBairro].forEach((campo) => campo.addEventListener('change', () => {
  limite = POR_PAGINA;
  renderizar();
}));

botaoMais.addEventListener('click', () => {
  limite += POR_PAGINA;
  renderizar();
  if (botaoMais.hidden) status.focus(); // o botão sumiu: o foco vai para o aviso
});

renderizar();
