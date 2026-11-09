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
  } catch {
    if (minha !== consultaAtual) return;
    mostrarEndereco(null);
    erro.textContent = 'Não conseguimos consultar o CEP agora. Tente de novo em instantes.';
  }
}

campoCep.addEventListener('input', () => {
  campoCep.value = mascararCep(campoCep.value);
  const digitos = soDigitos(campoCep.value);
  enderecoEncontrado = null;
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
  if (!enderecoEncontrado) return falhar('Informe um CEP válido para encontrarmos o endereço.', campoCep);
  if (!numero) return falhar('Informe o número do endereço.', campoNumero);
  if (materiais.length === 0) return falhar('Marque pelo menos um material para entregar.', caixas[0]);

  erro.textContent = '';
  const { logradouro, bairro, cidade, uf, cep } = enderecoEncontrado;
  const id = `c-${Date.now()}`;
  atualizar((e) => {
    e.pedidoDoador = { id, cep, numero, logradouro, bairro, cidade, uf, materiais };
    e.local = { cidade, uf, bairro: bairro || null, manual: true, detectado: true };
    // o pedido também aparece para os coletores
    e.coletas.push({ id, cidade: `${cidade} - ${uf}`, bairro: bairro || cidade, endereco: `${logradouro}, ${numero}`, materiais, status: 'esperando', origem: 'doador' });
  });
  window.location.href = './confirmacao-doador.html';
});