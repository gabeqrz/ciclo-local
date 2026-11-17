// perfil-doador.js: perfil-doador.html (CEP, total e envio do pedido)
import { atualizar } from './storage.js';
import { mascararCep, soDigitos, consultarCep } from './cep.js';
import { el, formatarKg } from './util.js';

const form = document.querySelector('form');
const campoCep = document.getElementById('cep');
const campoNumero = document.getElementById('numero');
const blocoEndereco = document.getElementById('endereco');
const erro = document.getElementById('erro');
const saida = document.getElementById('total');
const caixas = [...form.querySelectorAll('input[type=checkbox]')];
const pesoDe = (caixa) => document.getElementById(`kg-${caixa.id.slice(2)}`); // m-pet -> kg-pet
const blocoManual = document.getElementById('endereco-manual');
const manual = {
  rua: document.getElementById('man-rua'),
  bairro: document.getElementById('man-bairro'),
  cidade: document.getElementById('man-cidade'),
  uf: document.getElementById('man-uf'),
};

let enderecoEncontrado = null;
let consultaAtual = 0;

/* ----- CEP: máscara e consulta ----- */
const pino = () => el('img', { src: './img/icones/ui-pin.svg', alt: '', width: 24, height: 24 });

function mostrarEndereco(e) {
  if (!e) { blocoEndereco.replaceChildren(); return; }
  const primeira = e.bairro
    ? [el('strong', {}, e.bairro), ` · ${e.cidade} - ${e.uf}`]
    : [el('strong', {}, `${e.cidade} - ${e.uf}`)];
  blocoEndereco.replaceChildren(pino(), el('p', {}, ...primeira), el('p', {}, `${e.logradouro ? `${e.logradouro} · ` : ''}Achamos pelo seu CEP`));
}

async function buscarCep(cep) {
  const minha = ++consultaAtual;
  blocoEndereco.replaceChildren(pino(), el('p', {}, 'Buscando o endereço…'));
  try {
    const encontrado = await consultarCep(cep);
    if (minha !== consultaAtual) return; // chegou uma consulta mais nova
    if (!encontrado) {
      mostrarEndereco(null);
      erro.textContent = 'Não encontramos esse CEP. Confira os números.';
      return;
    }
    enderecoEncontrado = encontrado;
    erro.textContent = '';
    mostrarEndereco(encontrado);
  } catch (falha) {
    if (minha !== consultaAtual) return;
    const aviso = falha.offline
      ? 'Você está sem internet. Digite o endereço abaixo.'
      : 'Não conseguimos consultar o CEP agora. Digite o endereço abaixo.';
    blocoEndereco.replaceChildren(el('p', {}, aviso));
    erro.textContent = '';
    blocoManual.hidden = false;
  }
}

campoCep.addEventListener('input', () => {
  campoCep.value = mascararCep(campoCep.value);
  const digitos = soDigitos(campoCep.value);
  enderecoEncontrado = null;
  blocoManual.hidden = true;
  consultaAtual += 1; // cancela a consulta em andamento
  erro.textContent = '';
  if (digitos.length === 8) buscarCep(digitos); else mostrarEndereco(null);
});

/* ----- Materiais: só os marcados entram na soma ----- */
function pesosMarcados() {
  return caixas.filter((c) => c.checked).map((c) => ({ id: c.value, kg: Number(pesoDe(c).value) }));
}

function atualizarTotal() {
  caixas.forEach((c) => { pesoDe(c).disabled = !c.checked; });
  saida.textContent = formatarKg(pesosMarcados().reduce((soma, m) => soma + m.kg, 0));
}

form.addEventListener('change', atualizarTotal);
atualizarTotal();

/* ----- Envio ----- */
function falhar(mensagem, campo) {
  erro.textContent = mensagem;
  campo.focus();
}

form.addEventListener('submit', (evento) => {
  evento.preventDefault();
  const numero = campoNumero.value.trim();
  const materiais = pesosMarcados();

  let endereco = enderecoEncontrado;
  if (!endereco && !blocoManual.hidden) {
    const rua = manual.rua.value.trim();
    const bairro = manual.bairro.value.trim();
    const cidade = manual.cidade.value.trim();
    const uf = manual.uf.value.trim().toUpperCase();
    if (!rua) return falhar('Informe a rua.', manual.rua);
    if (!bairro) return falhar('Informe o bairro.', manual.bairro);
    if (!cidade) return falhar('Informe a cidade.', manual.cidade);
    if (uf.length !== 2) return falhar('Informe a sigla do estado, como SP.', manual.uf);
    endereco = { cep: campoCep.value, logradouro: rua, bairro, cidade, uf };
  }

  if (!endereco) return falhar('Informe um CEP válido para encontrarmos o endereço.', campoCep);
  if (!numero) return falhar('Informe o número do endereço.', campoNumero);
  if (materiais.length === 0) return falhar('Marque pelo menos um material para entregar.', caixas[0]);

   erro.textContent = '';
  const { logradouro, bairro, cidade, uf, cep } = endereco;
  const id = `c-${Date.now()}`;
  atualizar((e) => {
    e.pedidoDoador = { id, cep, numero, logradouro, bairro, cidade, uf, materiais };
    e.local = { cidade, uf, bairro: bairro || null, manual: true, detectado: true };
    // o pedido também aparece para os coletores
    e.coletas.push({ id, cidade: `${cidade} - ${uf}`, bairro: bairro || cidade, endereco: `${logradouro}, ${numero}`, materiais, status: 'esperando', origem: 'doador' });
  });
  window.location.href = './confirmacao-doador.html';
});