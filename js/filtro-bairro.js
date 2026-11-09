// filtro-bairro.js: chips de bairro + "Outro bairro"
import { el } from './util.js';

// grupo: <div role="group">; painel: <div id="outro-bairro" hidden>; bairros: nomes em ordem de relevância
export function montarFiltroBairro({ grupo, painel, bairros, selecionado, aoEscolher, quantidade = 3 }) {
  const principais = bairros.slice(0, quantidade);
  const visiveis = selecionado && !principais.includes(selecionado) ? [...principais, selecionado] : principais;
  const resto = bairros.filter((nome) => !visiveis.includes(nome));

  const chip = (texto, valor) => {
    const botao = el('button', { type: 'button', 'aria-pressed': String(valor === (selecionado ?? null)) }, texto);
    botao.addEventListener('click', () => aoEscolher(valor));
    return botao;
  };

  grupo.replaceChildren(chip('Todos', null), ...visiveis.map((nome) => chip(nome, nome)));
  painel.replaceChildren();
  painel.hidden = true;
  if (resto.length === 0) return;

  const mais = el('button', { type: 'button', class: 'chip-mais', 'aria-expanded': 'false', 'aria-controls': painel.id }, 'Outro bairro');
  const seletor = el('select', { id: `${painel.id}-sel` }, new Option('Selecione', ''), ...resto.map((nome) => new Option(nome, nome)));
  painel.append(el('label', { for: seletor.id }, 'Escolha o bairro'), seletor);
  grupo.append(mais);

  mais.addEventListener('click', () => {
    const abrir = mais.getAttribute('aria-expanded') !== 'true';
    mais.setAttribute('aria-expanded', String(abrir));
    painel.hidden = !abrir;
    if (abrir) seletor.focus();
  });
  seletor.addEventListener('change', () => { if (seletor.value) aoEscolher(seletor.value); });
}