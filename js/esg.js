// esg.js: indicadores ambientais (CO₂ evitado)
import { MATERIAIS } from './dados.js';

// kg de CO₂ evitados por kg reciclado, por material.
// DEMONSTRAÇÃO: todos os materiais usam o mesmo fator, calibrado para manter os números do mockup
// (3.341 kg de CO₂ para 1.424 kg reciclados). Trocar por fatores por material (EPA WARM v16)
// depois de conferidos na fonte.
const FATOR_DEMO = 3341 / 1424;
export const FATORES_CO2 = Object.fromEntries(Object.keys(MATERIAIS).map((id) => [id, FATOR_DEMO]));

// materiais: [{ id, kg }]. Devolve kg de CO₂ evitados.
export function co2Evitado(materiais) {
  return materiais.reduce((soma, m) => soma + m.kg * (FATORES_CO2[m.id] ?? 0), 0);
}