// util.js: funções pequenas usadas por várias páginas

import { MATERIAIS } from './dados.js';

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

// { id: 'pet', kg: 2 } -> "PET: 2 kg"
export const linhaMaterial = (m) => `${MATERIAIS[m.id] ?? m.id}: ${formatarKg(m.kg)}`;
// lista -> "PET: 2 kg · Papelão: 5 kg"
export const descricaoMateriais = (materiais) => materiais.map(linhaMaterial).join(' · ');
// mais recentes primeiro; na mesma data, a última registrada vem antes
export const ordenarConcluidas = (lista) => lista
  .map((item, i) => ({ item, i }))
  .sort((a, b) => b.item.data.localeCompare(a.item.data) || b.i - a.i)
  .map(({ item }) => item);
const MESES_LONGOS = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
export const rotuloMes = (iso) => { const [ano, mes] = iso.split('-'); return `${MESES_LONGOS[Number(mes) - 1]} de ${ano}`; };


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