// storage.js: estado compartilhado entre as páginas (localStorage)
const CHAVE = 'ciclolocal:v1';
const SP = 'São Paulo - SP';

function inicial() {
  const agora = Date.now();
  return {
    local: { cidade: 'São Paulo', uf: 'SP', bairro: null, manual: false, detectado: false },
    pedidoDoador: null,          // último pedido feito na tela do doador
    ultimaVisitaAceitas: agora,  // define o que é "Nova" na Coleta aceita
    coletas: [
      { id: 'c-se', cidade: SP, bairro: 'Sé', endereco: 'Praça da Sé, 100', materiais: [{ id: 'pet', kg: 2 }, { id: 'papelao', kg: 5 }], status: 'esperando' },
      { id: 'c-liberdade-1', cidade: SP, bairro: 'Liberdade', endereco: 'Rua Galvão Bueno, 200', materiais: [{ id: 'aluminio', kg: 1.5 }], status: 'aceita', aceitaEm: agora - 86400000 },
      { id: 'c-liberdade-2', cidade: SP, bairro: 'Liberdade', endereco: 'Rua dos Estudantes, 45', materiais: [{ id: 'papel_branco', kg: 4 }], status: 'esperando' },
      { id: 'c-bela-vista', cidade: SP, bairro: 'Bela Vista', endereco: 'Rua Treze de Maio, 300', materiais: [{ id: 'outros_plasticos', kg: 3 }], status: 'esperando' },
      { id: 'c-consolacao', cidade: SP, bairro: 'Consolação', endereco: 'Rua Augusta, 800', materiais: [{ id: 'aluminio', kg: 2 }, { id: 'cobre', kg: 0.5 }], status: 'esperando' },
    ],
    concluidas: [
      { id: 'h1', cidade: SP, bairro: 'Bela Vista', materiais: [{ id: 'vidro', kg: 3 }, { id: 'papel_branco', kg: 2 }], data: '2026-10-28' },
      { id: 'h2', cidade: SP, bairro: 'Consolação', materiais: [{ id: 'papelao', kg: 6 }], data: '2026-10-21' },
      { id: 'h3', cidade: SP, bairro: 'Sé', materiais: [{ id: 'pet', kg: 4 }, { id: 'aluminio', kg: 1 }], data: '2026-10-14' },
      { id: 'h4', cidade: SP, bairro: 'República', materiais: [{ id: 'papel_branco', kg: 3 }], data: '2026-10-07' },
      { id: 'h5', cidade: SP, bairro: 'Liberdade', materiais: [{ id: 'aluminio', kg: 2 }, { id: 'pet', kg: 1 }], data: '2026-09-30' },
      { id: 'h6', cidade: SP, bairro: 'Bom Retiro', materiais: [{ id: 'papelao', kg: 4 }], data: '2026-09-23' },
    ],
  };
}

export function ler() {
  try {
    const bruto = localStorage.getItem(CHAVE);
    if (bruto) return JSON.parse(bruto);
  } catch { /* storage bloqueado ou JSON inválido: recomeça com os dados de exemplo */ }
  const novo = inicial();
  salvar(novo);
  return novo;
}

export function salvar(estado) {
  try { localStorage.setItem(CHAVE, JSON.stringify(estado)); } catch { /* sem armazenamento: segue sem salvar */ }
}

// Apaga o estado (a demonstração recomeça com os dados de exemplo)
export function reiniciar() {
  try { localStorage.removeItem(CHAVE); } catch { /* sem armazenamento */ }
}

// Lê, aplica a mudança e salva: atualizar((e) => { e.local.bairro = 'Sé'; })
export function atualizar(mudanca) {
  const estado = ler();
  mudanca(estado);
  salvar(estado);
  return estado;
}