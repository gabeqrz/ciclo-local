# CicloLocal

![CicloLocal: a reciclagem começa perto. O impacto transforma tudo.](./img/previa-github-1280x640.png)

**A reciclagem começa perto. O impacto transforma tudo.**

O **CicloLocal** é uma plataforma web de inteligência comunitária para reciclagem. Aproxima moradores que querem destinar materiais recicláveis de coletores da região, organiza os pedidos por bairro e transforma as coletas concluídas em indicadores de impacto para a comunidade.

Projeto de TCC feito com **HTML5, CSS3 e JavaScript puro**, sem frameworks, backend ou banco de dados. Funciona como **PWA** (pode ser instalado no celular).

- **Aplicação publicada:** https://gabeqrz.github.io/ciclo-local/
- **Repositório:** https://github.com/gabeqrz/ciclo-local

---

## Como funciona

1. **Doador:** informa o CEP, marca os materiais e estima os pesos. O pedido fica disponível para os coletores da região. Doador pode conferir o histórico de pedidos na plataforma.
2. **Coletor:** consulta os pedidos, filtra por bairro e aceita uma coleta. O endereço completo só aparece depois do aceite. Depois de recolher, confirma o peso real de cada material.
3. **Comunidade:** acompanha o histórico e o painel de resultados, com indicadores por material, evolução mensal, ranking de bairros e estimativa de CO₂ equivalente.

Estados do pedido: `esperando` → `aceita` → `concluida`.

> **Regra dos indicadores:** pedido criado ou aceito não é material coletado. Os totais consideram apenas coletas **concluídas**, com o peso confirmado pelo coletor.

O CicloLocal complementa iniciativas existentes. Não substitui serviços municipais nem garante que todo pedido será atendido.

## Funcionalidades

- Consulta de endereço pelo CEP (ViaCEP) e sete categorias de materiais.
- Geolocalização com permissão do usuário, ou seleção manual de estado e cidade (IBGE).
- Aceite, desistência e conclusão de coletas, com peso confirmado.
- Histórico de coletas com filtros por mês e bairro.
- Painel de resultados com filtro por bairro e impressão/PDF pelo navegador.
- PWA: manifest, ícones e service worker com cache dos arquivos principais.

**Materiais:** cobre, alumínio, PET, outros plásticos, papel branco, papelão e garrafas e potes de vidro.

## Como rodar

O projeto usa módulos JavaScript, então precisa de um servidor local (abrir o HTML direto por `file://` pode bloquear os módulos).

1. Clone o repositório: `git clone https://github.com/gabeqrz/ciclo-local.git`
2. Abra a pasta no VS Code e inicie o **Live Server** a partir do `index.html`.

Para reiniciar a demonstração, execute `reiniciarDemo()` no Console do navegador. Não há botão para isso na interface.

- **Equipe:** Gabe Queiroz, Alisson Amarante, Daniel Costa, Pedro Camilo, Pedro Santos, Ryan Silva.

## Instalar como aplicativo

- **Android (Chrome):** use o botão de instalação do app, quando exibido, ou o menu do navegador.
- **iPhone (Safari):** Compartilhar → Adicionar à Tela de Início.
- No desktop, o Chrome e o Edge oferecem a instalação pela barra de endereço.

O service worker só funciona em `https://` ou em `localhost`.

## Limites do protótipo

- Os dados ficam no `localStorage` do navegador: não há sincronização entre aparelhos. Doador e coletor precisam usar o mesmo navegador para compartilhar a demonstração.
- Os registros iniciais são **fictícios** e identificados na interface. Dados de demonstração são de **São Paulo - SP**; escolher outra cidade não cria uma base real.
- O login no estilo gov.br é **demonstrativo**: não há autenticação oficial nem coleta de credenciais.
- O CO₂ é uma **estimativa** (fatores dos EUA), não uma medição.
- O uso offline e a instalação em dispositivo real ainda estão em validação.
- A acessibilidade tem como meta o WCAG 2.1 nível AA. Isso **não é declaração de conformidade**; a revalidação está em andamento.

## Documentação

| Documento | Conteúdo |
|---|---|
| [`docs/referencia.md`](./docs/referencia.md) | Referência técnica: regras, arquitetura, PWA, CO₂, acessibilidade, estrutura e módulos |
| [`docs/roadmap.md`](./docs/roadmap.md) | Status, testes pendentes, riscos e evoluções futuras |
| [`docs/identidade-visual/`](./docs/identidade-visual/) | Marca e tokens visuais |
| [`docs/prototipos/`](./docs/prototipos/) | Mockup da jornada do usuário |

## Créditos

- Fatores de CO₂: EPA WARM v16. Busca de CEP: ViaCEP. Localidades: IBGE. Cidade aproximada: Nominatim/OpenStreetMap. Fonte: Plus Jakarta Sans (Google Fonts).

---

_Projeto acadêmico (TCC). Os registros de demonstração são fictícios._
