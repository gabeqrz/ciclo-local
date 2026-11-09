// local.js: cidade do usuário (geolocalização) e troca de cidade (IBGE)
import { ler, atualizar } from './storage.js';
import { el } from './util.js';

const IBGE = 'https://servicodados.ibge.gov.br/api/v1/localidades';

async function buscarJson(url) {
  const resposta = await fetch(url);
  if (!resposta.ok) throw new Error(`Falha ${resposta.status}`);
  return resposta.json();
}

async function cidadePorCoordenadas(lat, lon) {
  const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&zoom=10&addressdetails=1&accept-language=pt-BR&lat=${lat}&lon=${lon}`;
  const { address = {} } = await buscarJson(url);
  const cidade = address.city || address.town || address.municipality || address.village;
  const uf = (address['ISO3166-2-lvl4'] || '').split('-')[1];
  if (!cidade || !uf) throw new Error('Cidade não encontrada');
  return { cidade, uf };
}

// Devolve { cidade, uf, bairro, ... }. A geolocalização é pedida uma única vez.
export async function obterLocal({ aoAviso } = {}) {
  const salvo = ler().local;
  if (salvo.manual || salvo.detectado) return salvo;
  try {
    if (!('geolocation' in navigator)) throw new Error('Sem geolocalização');
    const posicao = await new Promise((ok, erro) => {
      navigator.geolocation.getCurrentPosition(ok, erro, { timeout: 8000, maximumAge: 600000 });
    });
    const cidade = await cidadePorCoordenadas(posicao.coords.latitude, posicao.coords.longitude);
    return atualizar((e) => { e.local = { ...cidade, bairro: null, manual: false, detectado: true }; }).local;
  } catch {
    atualizar((e) => { e.local.detectado = true; });
    aoAviso?.('Não conseguimos saber onde você está. Mostrando São Paulo - SP. Use "Trocar cidade" para escolher outra.');
    return ler().local;
  }
}

// Janela com Estado e Cidade. Chama aoTrocar() depois de salvar a escolha.
export function abrirTrocaDeCidade(aoTrocar) {
  const estados = el('select', { id: 'tc-uf' }, new Option('Carregando…', ''));
  const cidades = el('select', { id: 'tc-cidade', disabled: true }, new Option('Escolha o estado primeiro', ''));
  const aviso = el('p', { class: 'aviso', role: 'status' });
  const confirmar = el('button', { type: 'button', class: 'botao' }, 'Usar esta cidade');
  const cancelar = el('button', { type: 'button' }, 'Cancelar');
  const dialogo = el('dialog', { 'aria-labelledby': 'tc-titulo' },
    el('h2', { id: 'tc-titulo' }, 'Trocar cidade'),
    el('div', {}, el('label', { for: 'tc-uf' }, 'Estado'), estados),
    el('div', {}, el('label', { for: 'tc-cidade' }, 'Cidade'), cidades),
    aviso, confirmar, cancelar);
  document.body.append(dialogo);
  dialogo.addEventListener('close', () => dialogo.remove());
  dialogo.showModal();

  async function carregarCidades(uf) {
    cidades.disabled = true;
    cidades.replaceChildren(new Option('Carregando…', ''));
    try {
      const lista = await buscarJson(`${IBGE}/estados/${uf}/municipios?orderBy=nome`);
      cidades.replaceChildren(new Option('Escolha a cidade', ''), ...lista.map((c) => new Option(c.nome, c.nome)));
      cidades.disabled = false;
    } catch {
      aviso.textContent = 'Não foi possível carregar as cidades agora. Tente de novo em instantes.';
    }
  }

  buscarJson(`${IBGE}/estados?orderBy=nome`)
    .then((lista) => {
      estados.replaceChildren(new Option('Escolha o estado', ''), ...lista.map((e) => new Option(`${e.nome} (${e.sigla})`, e.sigla)));
    })
    .catch(() => { aviso.textContent = 'Não foi possível carregar os estados agora.'; });

  estados.addEventListener('change', () => { if (estados.value) carregarCidades(estados.value); });
  cancelar.addEventListener('click', () => dialogo.close());
  confirmar.addEventListener('click', () => {
    if (!estados.value || !cidades.value) { aviso.textContent = 'Escolha o estado e a cidade.'; return; }
    atualizar((e) => { e.local = { cidade: cidades.value, uf: estados.value, bairro: null, manual: true, detectado: true }; });
    dialogo.close();
    aoTrocar();
  });
}