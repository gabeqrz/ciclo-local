// esg.js: indicadores ambientais (CO₂ evitado)

// kg de CO₂ evitados por kg reciclado, por material.
// DEMONSTRAÇÃO: todos os materiais usam o mesmo fator, calibrado para manter os números do mockup
// (3.341 kg de CO₂ para 1.424 kg reciclados). Trocar por fatores por material (EPA WARM v16)
// depois de conferidos na fonte.
const FATOR_DEMO = 3341 / 1424;
export const FATORES_CO2 = {
  cobre: 4.95, aluminio: 7.94, pet: 1.15, outros_plasticos: 1.03,
  papel_branco: 3.15, papelao: 3.46, vidro: 0.31,
};

// materiais: [{ id, kg }]. Devolve kg de CO₂ evitados.
export const co2Evitado = (materiais) => materiais.reduce((s, m) => s + m.kg * (FATORES_CO2[m.id] ?? 0), 0);