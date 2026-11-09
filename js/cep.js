// cep.js: máscara e consulta de CEP (ViaCEP)

export const soDigitos = (texto) => texto.replace(/\D/g, '').slice(0, 8);

// '01001000' -> '01001-000'
export function mascararCep(texto) {
  const digitos = soDigitos(texto);
  return digitos.length > 5 ? `${digitos.slice(0, 5)}-${digitos.slice(5)}` : digitos;
}

// Devolve { cep, logradouro, bairro, cidade, uf } ou null se o CEP não existe.
// Lança erro se a consulta falhar (sem internet, serviço fora do ar).
export async function consultarCep(cep) {
  const digitos = soDigitos(cep);
  if (digitos.length !== 8) return null;
  const resposta = await fetch(`https://viacep.com.br/ws/${digitos}/json/`);
  if (!resposta.ok) throw new Error('Falha na consulta do CEP');
  const dados = await resposta.json();
  if (dados.erro) return null;
  return { cep: dados.cep, logradouro: dados.logradouro, bairro: dados.bairro, cidade: dados.localidade, uf: dados.uf };
}