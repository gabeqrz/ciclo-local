// coletor.js: comportamentos de perfil-coletor.html e confirmacao-coletor.html

/* ===== perfil-coletor.html: "Outro bairro" ===== */
const chipMais = document.querySelector('.chip-mais');
const painelBairro = document.getElementById('outro-bairro');
if (chipMais && painelBairro) {
  chipMais.addEventListener('click', () => {
    const abrir = chipMais.getAttribute('aria-expanded') !== 'true';
    chipMais.setAttribute('aria-expanded', String(abrir));
    painelBairro.hidden = !abrir;
    if (abrir) painelBairro.querySelector('select').focus();
  });
}

/* ===== perfil-coletor.html: aceitar vários pedidos de uma vez ===== */
const barraAceite = document.getElementById('barra-aceite');
if (barraAceite) {
  const resumo = document.getElementById('resumo-selecao');
  const caixas = document.querySelectorAll('input[name="pedido"]');
  const atualizarSelecao = () => {
    const marcadas = [...caixas].filter((caixa) => caixa.checked);
    const kg = marcadas.reduce((soma, caixa) => soma + Number(caixa.dataset.kg), 0);
    barraAceite.hidden = marcadas.length === 0;
    resumo.textContent = `${marcadas.length} ${marcadas.length === 1 ? 'pedido' : 'pedidos'} · ${kg.toLocaleString('pt-BR')} kg`;
  };
  caixas.forEach((caixa) => caixa.addEventListener('change', atualizarSelecao));
}

/* ===== confirmacao-coletor.html ===== */
const secaoAberta = document.querySelector('[aria-labelledby="t-aberto"]');
const secaoFeitas = document.querySelector('[aria-labelledby="t-feitas"]');
if (secaoAberta && secaoFeitas) {
  const MAX_VISIVEIS = 3; // concluídas na lista; as demais ficam para o histórico
  const MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
  const listaFeitas = secaoFeitas.querySelector('ul');
  const nAbertas = document.getElementById('n-abertas');
  const nFeitas = document.getElementById('n-concluidas');
  const semAbertas = document.getElementById('sem-abertas');
  const aviso = document.getElementById('aviso');
  const dialogo = document.getElementById('dialogo-desistir');
  let cartaoDesistindo = null;

  const atualizarAbertas = () => {
    const total = secaoAberta.querySelectorAll('article').length;
    nAbertas.textContent = total;
    semAbertas.hidden = total > 0;
  };
  const avisar = (mensagem) => { aviso.textContent = mensagem; aviso.focus(); };
  const dataDeHoje = () => {
    const d = new Date();
    const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    return { iso, curta: `${d.getDate()} ${MESES[d.getMonth()]}` };
  };

  // "Marcar como concluída": o cartão sai de "Em aberto" e entra no topo de "Concluídas"
  secaoAberta.addEventListener('submit', (evento) => {
    evento.preventDefault();
    const form = evento.target;
    const cartao = form.closest('article');
    const bairro = cartao.querySelector('h3').textContent;
    const materiais = [...form.querySelectorAll('select')]
      .map((select) => `${form.querySelector(`label[for="${select.id}"]`).textContent.trim()} ${select.selectedOptions[0].textContent}`)
      .join(' · ');
    const hoje = dataDeHoje();

    const item = document.createElement('li');
    const nome = document.createElement('strong');
    const detalhes = document.createElement('small');
    const data = document.createElement('time');
    nome.textContent = bairro;
    detalhes.textContent = materiais;
    data.dateTime = hoje.iso;
    data.textContent = hoje.curta;
    item.append(nome, ' ', detalhes, ' ', data);
    listaFeitas.prepend(item);
    while (listaFeitas.children.length > MAX_VISIVEIS) listaFeitas.lastElementChild.remove();

    nFeitas.textContent = Number(nFeitas.textContent) + 1;
    cartao.remove();
    atualizarAbertas();
    avisar(`Coleta em ${bairro} concluída. Ela entrou na lista de concluídas.`);
  });

  // "Cancelar": restaura os pesos (reset do formulário) e fecha o painel
  secaoAberta.addEventListener('reset', (evento) => {
    const painel = evento.target.closest('details');
    painel.open = false;
    painel.querySelector('summary').focus();
  });

  // "Desistir da coleta": pede confirmação e devolve o pedido à lista
  secaoAberta.addEventListener('click', (evento) => {
    const botao = evento.target.closest('.desistir');
    if (!botao) return;
    cartaoDesistindo = botao.closest('article');
    dialogo.showModal();
  });
  document.getElementById('cancela-desistir').addEventListener('click', () => dialogo.close());
  document.getElementById('confirma-desistir').addEventListener('click', () => {
    const bairro = cartaoDesistindo.querySelector('h3').textContent;
    cartaoDesistindo.remove();
    cartaoDesistindo = null;
    dialogo.close();
    atualizarAbertas();
    avisar(`Você desistiu da coleta em ${bairro}. O pedido voltou para a lista de pedidos esperando você.`);
  });
}