// dados.js: dados de exemplo do modo demonstração (edite à vontade)
export const MATERIAIS = {
  cobre: 'Cobre',
  aluminio: 'Alumínio',
  pet: 'PET',
  outros_plasticos: 'Outros plásticos',
  papel_branco: 'Papel branco',
  papelao: 'Papelão',
  vidro: 'Vidro',
};

// Resultados acumulados por cidade. O último item de "meses" é o mês atual.
export const CIDADES = {
  'São Paulo - SP': {
    total: 1424, mes: 352, meta: 500, coletas: 24, pessoas: 9,
    materiais: { papelao: 453.5, pet: 284, vidro: 226.5, outros_plasticos: 204, papel_branco: 170, aluminio: 68, cobre: 18 },
    meses: [
      { nome: 'jun', kg: 142 }, { nome: 'jul', kg: 176 }, { nome: 'ago', kg: 211 },
      { nome: 'set', kg: 246 }, { nome: 'out', kg: 299 }, { nome: 'nov', kg: 352 },
    ],
    // a soma dos bairros é igual ao total da cidade
    bairros: [
      { nome: 'Sé', kg: 420 }, { nome: 'Liberdade', kg: 340 }, { nome: 'Bela Vista', kg: 270 },
      { nome: 'Consolação', kg: 190 }, { nome: 'República', kg: 120 }, { nome: 'Bom Retiro', kg: 60 },
      { nome: 'Cambuci', kg: 24 },
    ],
  },
};