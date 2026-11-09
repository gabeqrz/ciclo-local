// resultados.js: cálculo dos resultados (usado no dashboard e nas confirmações)
import { CIDADES, MATERIAIS } from './dados.js';
import { ler } from './storage.js';
import { co2Evitado } from './esg.js';
import { formatarKg, somar, totalKg, rotuloCidade } from './util.js';

const arred = (n) => Math.round(n * 10) / 10;

// rotulo: 'São Paulo - SP'. bairro: nome ou null (cidade inteira). Devolve null se não há dados da cidade.
export function resultados(rotulo, bairro = null) {
  const cidade = CIDADES[rotulo];
  if (!cidade) return null;
  const estado = ler();

  // coletas concluídas durante a demonstração entram nos números
  const extrasCidade = estado.concluidas.filter((c) => c.extra && c.cidade === rotulo);
  const bairros = cidade.bairros
    .map((b) => ({ nome: b.nome, kg: arred(b.kg + somar(extrasCidade.filter((c) => c.bairro === b.nome), (c) => totalKg(c.materiais))) }))
    .sort((a, b) => b.kg - a.kg);

  const base = cidade.bairros.find((b) => b.nome === bairro);
  const fator = base ? base.kg / cidade.total : 1; // fatia do bairro no total da cidade
  const escopo = base ? base.nome : null;
  const extras = escopo ? extrasCidade.filter((c) => c.bairro === escopo) : extrasCidade;
  const kgExtra = somar(extras, (c) => totalKg(c.materiais));

  const total = arred(cidade.total * fator + kgExtra);
  const mes = arred(cidade.mes * fator + kgExtra);
  const meta = Math.round(cidade.meta * fator);
  const pendentes = estado.coletas.filter((c) => c.status === 'esperando' && c.cidade === rotulo && (!escopo || c.bairro === escopo)).length;

  const resultado = {
    escopo, total, mes, meta,
    pct: Math.min(100, Math.round((mes / meta) * 100)),
    coletas: Math.max(1, Math.round(cidade.coletas * fator)) + extras.length,
    pessoas: Math.max(1, Math.round(cidade.pessoas * fator)),
    pedidos: pendentes,
    materiais: Object.entries(cidade.materiais)
      .map(([id, kg]) => ({
        id, nome: MATERIAIS[id],
        kg: arred(kg * fator + somar(extras.flatMap((c) => c.materiais.filter((m) => m.id === id)), (m) => m.kg)),
      }))
      .sort((a, b) => b.kg - a.kg),
    meses: cidade.meses.map((m, i, lista) => ({ nome: m.nome, kg: i === lista.length - 1 ? Math.round(mes) : Math.round(m.kg * fator) })),
    bairros,
  };
  resultado.co2 = Math.round(co2Evitado(resultado.materiais));
  return resultado;
}

// Preenche o cartão escuro "meta do bairro" das páginas de confirmação.
// montarTitulo(escopo, rotulo) devolve o texto do título.
export function preencherChamada(montarTitulo) {
  const { local } = ler();
  const rotulo = rotuloCidade(local);
  const r = resultados(rotulo, local.bairro);
  const secao = document.getElementById('chamada');
  secao.hidden = !r;
  if (!r) return;
  document.getElementById('t-cta').textContent = montarTitulo(r.escopo, rotulo);
  document.getElementById('meta-rotulo').textContent = `${formatarKg(r.mes)} este mês · meta de ${formatarKg(r.meta)}`;
  const barra = document.getElementById('meta-bairro');
  barra.max = r.meta;
  barra.value = Math.min(r.mes, r.meta);
  barra.textContent = `${r.pct}%`;
}