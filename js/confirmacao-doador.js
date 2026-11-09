// confirmacao-doador.js
import { ler } from './storage.js';
import { el, formatarKg, totalKg } from './util.js';
import { MATERIAIS } from './dados.js';
import { preencherChamada } from './resultados.js';

const { pedidoDoador: pedido, coletas } = ler();
const secao = document.getElementById('secao-pedido');

if (!pedido) {
  secao.replaceChildren(
    el('h2', { id: 't-pedido' }, 'Seu pedido'),
    el('p', {}, 'Você ainda não avisou que tem material. ', el('a', { href: './perfil-doador.html' }, 'Avisar que tenho material')),
  );
} else {
  const primeira = pedido.bairro
    ? [el('strong', {}, pedido.bairro), ` · ${pedido.cidade} - ${pedido.uf}`]
    : [el('strong', {}, `${pedido.cidade} - ${pedido.uf}`)];
  document.getElementById('pedido-local').replaceChildren(...primeira);
  document.getElementById('pedido-endereco').textContent = `${pedido.logradouro ? `${pedido.logradouro}, ` : ''}${pedido.numero}`;
  document.getElementById('pedido-materiais').replaceChildren(
    ...pedido.materiais.map((m) => el('li', {}, `${MATERIAIS[m.id]} ${formatarKg(m.kg)}`)),
    el('li', {}, `Total ${formatarKg(totalKg(pedido.materiais))}`),
  );

  // andamento: acompanha o que o coletor fez com este pedido
  const status = coletas.find((c) => c.id === pedido.id)?.status;
  const feitas = status === 'concluida' ? 3 : status === 'aceita' ? 2 : 1;
  document.querySelectorAll('#andamento li').forEach((etapa, i) => {
    etapa.classList.toggle('feito', i < feitas);
    if (i === feitas) etapa.setAttribute('aria-current', 'step');
    else etapa.removeAttribute('aria-current');
  });
}

preencherChamada((escopo, rotulo) => (escopo ? `Veja o que o bairro ${escopo} já recicla` : `Veja o que ${rotulo} já recicla`));