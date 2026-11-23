// historico-pedidos.js: todos os pedidos do doador (em andamento e concluídos)
import { ler } from './storage.js';
import { el, formatarKg, totalKg, dataCurta, ordenarConcluidas, descricaoMateriais } from './util.js';

const SITUACAO = {
  esperando: ['Aguardando um coletor', 'etiqueta'],
  aceita: ['Aceito por um coletor', 'etiqueta etiqueta-aceita'],
};
const porId = (id) => document.getElementById(id);

function renderizar() {
  const { coletas, concluidas } = ler();
  const meus = coletas.filter((c) => c.origem === 'doador');
  const ids = new Set(meus.map((c) => c.id));
  const feitos = ordenarConcluidas(concluidas.filter((h) => ids.has(h.id)));
  const andamento = meus.filter((c) => c.status !== 'concluida').sort((a, b) => b.id.localeCompare(a.id));

  porId('n-concluidos').textContent = feitos.length;
  porId('kg-recolhidos').textContent = formatarKg(feitos.reduce((s, h) => s + totalKg(h.materiais), 0));
  porId('n-andamento').textContent = andamento.length;

  porId('sem-pedidos').hidden = meus.length > 0;
  porId('secao-andamento').hidden = andamento.length === 0;
  porId('secao-feitos').hidden = feitos.length === 0;

  porId('lista-andamento').replaceChildren(...andamento.map((c) => {
    const [texto, classe] = SITUACAO[c.status] ?? SITUACAO.esperando;
    return el('article', {},
      el('p', { class: classe }, texto),
      el('h3', {}, descricaoMateriais(c.materiais)),
      el('p', {}, 'Total: ', el('strong', {}, formatarKg(totalKg(c.materiais)))),
      el('p', {}, 'Retirada em: ', el('strong', {}, c.endereco)));
  }));

  porId('lista-feitas').replaceChildren(...feitos.map((item) => el('li', {},
    el('strong', {}, `Recolhido em ${dataCurta(item.data)}`), ' ',
    el('small', {}, descricaoMateriais(item.materiais)), ' ',
    el('span', { class: 'kg-pedido' }, formatarKg(totalKg(item.materiais))))));
}

renderizar();
window.addEventListener('storage', (e) => { if (e.key === 'ciclolocal:v1') renderizar(); });
window.addEventListener('pageshow', (e) => { if (e.persisted) renderizar(); });
document.addEventListener('visibilitychange', () => { if (!document.hidden) renderizar(); });