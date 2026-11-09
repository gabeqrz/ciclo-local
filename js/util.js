// util.js: funções pequenas usadas por várias páginas

// Cria um elemento: el('p', { class: 'aviso' }, 'texto', outroElemento)
export function el(tag, props = {}, ...filhos) {
  const no = document.createElement(tag);
  for (const [chave, valor] of Object.entries(props)) {
    if (valor === null || valor === undefined || valor === false) continue;
    no.setAttribute(chave, valor === true ? '' : valor);
  }
  no.append(...filhos);
  return no;
}

export const somar = (lista, fn) => lista.reduce((soma, item) => soma + fn(item), 0);
export const totalKg = (materiais) => somar(materiais, (m) => m.kg);
export const formatarKg = (kg) => `${(Math.round(kg * 10) / 10).toLocaleString('pt-BR')} kg`;
export const rotuloCidade = (local) => `${local.cidade} - ${local.uf}`;

const MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
export function hojeISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
export function dataCurta(iso) {
  const [, mes, dia] = iso.split('-');
  return `${Number(dia)} ${MESES[Number(mes) - 1]}`;
}