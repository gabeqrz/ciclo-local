// confirmacao-doador.js: "Pedidos" do doador (pedido, andamento e últimas entregas concluídas)
import { ler } from './storage.js';
import { el, formatarKg, totalKg, dataCurta, ordenarConcluidas, descricaoMateriais } from './util.js';
import { preencherChamada } from './resultados.js';
import { MATERIAIS } from './dados.js';

const MAX_RECENTES = 3;

// Só os passos que ainda faltam: o que já aconteceu está no título e na situação
const ESTADOS = {
  esperando: {
    titulo: 'Pedido enviado!',
    subtitulo: 'Agora é só esperar um coletor aceitar. Você acompanha o andamento aqui.',
    situacao: 'Aguardando um coletor aceitar.',
    faltam: ['Aceito por um coletor', 'Material recolhido'],
  },
  aceita: {
    titulo: 'Um coletor aceitou o seu pedido!',
    subtitulo: 'Ele vai ao endereço recolher o material. Você acompanha o andamento aqui.',
    situacao: 'Aceito por um coletor. Falta recolher o material.',
    faltam: ['Material recolhido'],
  },
  concluida: {
    titulo: 'Material recolhido!',
    subtitulo: 'Obrigado por reciclar. O seu pedido já entrou nos resultados da reciclagem.',
    situacao: 'Concluído: material recolhido.',
    faltam: [],
  },
};

const { pedidoDoador: pedido, coletas, concluidas } = ler();
const secao = document.getElementById('secao-pedido');

if (!pedido) {
  document.getElementById('titulo').textContent = 'Você ainda não tem pedidos';
  document.getElementById('subtitulo').textContent = 'Avise quando tiver material e acompanhe o andamento aqui.';
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
  );
  document.getElementById('pedido-total').textContent = formatarKg(totalKg(pedido.materiais));

  // andamento: acompanha o que o coletor fez com este pedido
  const status = coletas.find((c) => c.id === pedido.id)?.status;
  const estado = ESTADOS[status] ?? ESTADOS.esperando;
  document.getElementById('titulo').textContent = estado.titulo;
  document.getElementById('subtitulo').textContent = estado.subtitulo;
  if (status === 'concluida') document.getElementById('t-pedido').textContent = 'O seu pedido foi recolhido';
  document.getElementById('situacao').replaceChildren(el('strong', {}, estado.situacao));

  const lista = document.getElementById('andamento');
  lista.replaceChildren(...estado.faltam.map((etapa, i) => el('li', i === 0 ? { 'aria-current': 'step' } : {}, etapa)));
  lista.hidden = estado.faltam.length === 0;
  document.getElementById('nota-andamento').hidden = estado.faltam.length === 0;
}

// Últimas entregas concluídas (as mais recentes primeiro)
const todas = ordenarConcluidas(concluidas);
document.getElementById('lista-feitas').replaceChildren(...todas.slice(0, MAX_RECENTES).map((item) => el('li', {},
  el('strong', {}, item.bairro), ' ',
  el('small', {}, descricaoMateriais(item.materiais)), ' ',
  el('time', { datetime: item.data }, dataCurta(item.data)))));
document.getElementById('total-concluidas').textContent = `${todas.length} ${todas.length === 1 ? 'entrega concluída' : 'entregas concluídas'} no total`;

preencherChamada((escopo, rotulo) => (escopo ? `Veja o que o bairro ${escopo} já recicla` : `Veja o que ${rotulo} já recicla`));