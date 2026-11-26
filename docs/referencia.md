# CicloLocal — Referência técnica

**Atualizado em novembro de 2026.** Este é o documento de referência do projeto: proposta, regras, arquitetura, PWA, impacto, acessibilidade e limites. O README apresenta o projeto; o [roadmap](./roadmap.md) acompanha status, testes e evoluções.

> Distinção usada em todo o documento: **implementado no código** não significa **validado**. Testes de navegador, leitor de tela, dispositivo real e Lighthouse exigem execução e evidência.

## 1. Visão e decisões

O CicloLocal aproxima quem separa recicláveis de coletores da região, organiza pedidos por bairro e transforma coletas concluídas em informação comunitária. Complementa iniciativas existentes; não é a primeira solução do tipo, não substitui serviços municipais e não garante atendimento.

| Tema | Decisão atual |
|---|---|
| Tecnologia | HTML5, CSS3 e JavaScript puro (ES Modules), sem framework, backend ou banco de dados |
| Perfis | Doador (disponibiliza materiais) e coletor (realiza a retirada) |
| Endereço | ViaCEP preenche o endereço do doador; o usuário pode editar manualmente se a busca falhar |
| Localização | Geolocalização do navegador e seleção manual de estado/cidade (IBGE); Nominatim converte coordenadas em cidade aproximada |
| Persistência | `localStorage`, sem sincronização entre dispositivos |
| Entrada | Visual inspirado no gov.br, apenas demonstrativo |
| Impacto | Só coletas concluídas e pesos confirmados alimentam os indicadores |
| PWA | Manifest, ícones e service worker (ver seção 5) |

## 2. Jornada, telas e estados

| Etapa | Arquivo | Responsabilidade |
|---|---|---|
| 1 | `index.html` | Entrada demonstrativa e acesso aos resultados |
| 2 | `selecao-de-perfil.html` | Escolha entre doar e recolher |
| 3A | `perfil-doador.html` | CEP, materiais e pesos estimados |
| 4A | `confirmacao-doador.html` | Resumo e andamento do pedido |
| 3B | `perfil-coletor.html` | Pedidos disponíveis, filtro por bairro e aceite |
| 4B | `confirmacao-coletor.html` | Coletas aceitas, confirmação de peso, conclusão e desistência |
| 5 | `historico-coletas.html` | Histórico geral, filtros por mês e bairro, exibição progressiva |
| 6 | `dashboard.html` | Indicadores, filtros, ranking e impressão |

**Doador:** informa o CEP, marca os materiais, estima os pesos (números fechados, a partir de 0,5 kg), e o pedido é salvo localmente.
**Coletor:** consulta pedidos da cidade, filtra por bairro, aceita (pode desfazer enquanto não concluir), informa o peso efetivo por material e conclui ou desiste.

| Estado | Significado | Entra nos totais? |
|---|---|---|
| `esperando` | Pedido publicado, visível aos coletores | Não (conta como "aguardando") |
| `aceita` | Um coletor assumiu; endereço completo liberado | Não |
| `concluida` | Coletor confirmou os pesos efetivos | **Sim**, com o peso confirmado |

**Materiais:** cobre, alumínio, PET, outros plásticos, papel branco, papelão e garrafas e potes de vidro (categorias simplificadas, não uma classificação técnica de resíduos).

**Linguagem da interface:** doador/coletor (ou "Quero doar"/"Quero recolher"), "Resultados da reciclagem" em vez de "dashboard", "Pedido esperando" em vez de "pendente", "estimativa de CO₂ equivalente" em vez de valor exato.

## 3. Dados e impacto

**Indicadores:** peso confirmado, coletas concluídas, pessoas participantes, pedidos aguardando, distribuição por material, evolução mensal, comparação por bairro e estimativa de CO₂ equivalente. O peso confirmado substitui o estimado.

**Estimativa de CO₂ equivalente** (`js/esg.js`): soma do peso confirmado de cada material × fator (kg CO₂e/kg), com base no **EPA WARM v16** (EUA).

| Categoria | Referência aproximada no WARM | Fator |
|---|---|---:|
| Cobre | Fio de cobre | 4,95 |
| Alumínio | Lingote de alumínio | 7,94 |
| PET | PET | 1,15 |
| Outros plásticos | Plásticos mistos | 1,03 |
| Papel branco | Papel de escritório | 3,15 |
| Papelão | Papelão ondulado | 3,46 |
| Vidro | Vidro | 0,31 |

Conferência: 2 kg de PET + 5 kg de papelão = (2 × 1,15) + (5 × 3,46) = **19,60 kg CO₂e**.

**Limites:** fatores dos EUA em cenários modelados, não medições locais; as categorias são aproximações; o indicador não comprova destinação final nem reciclagem efetiva. Use sempre "estimativa" ou "valor estimado".

**Dados de demonstração:** registros fictícios (6 meses, 7 bairros) criados quando não há estado salvo. Não misture com dados reais em apresentações e relatórios. `reiniciarDemo()` (definida em `app.js`) apaga o estado salvo e recarrega; é acionada pelo Console, não há botão.

## 4. Eixos ESG e limites

| Eixo | Como aparece | O que não se pode afirmar |
|---|---|---|
| Ambiental | Materiais confirmados e estimativa de CO₂e | Destinação final ou reciclagem efetiva |
| Social | Pedidos por bairro, informação ao coletor, histórico | Aumento de renda ou melhoria socioeconômica |
| Governança | Painel público, separação entre pedido e coleta concluída, dados de exemplo identificados | Auditoria externa, trilha centralizada ou sincronização em servidor |

## 5. Arquitetura e PWA

### Tecnologias

| Tecnologia / serviço | Uso |
|---|---|
| HTML5, CSS3 | Estrutura semântica, tokens, Flexbox, Grid, foco e impressão |
| JavaScript (ES Modules) | Fluxos, validações, DOM, eventos e cálculos |
| `localStorage` | Pedidos, coletas, histórico e preferências |
| ViaCEP | Endereço a partir do CEP |
| API de localidades do IBGE | Estados e municípios |
| Nominatim / OpenStreetMap | Cidade aproximada a partir de coordenadas |
| Google Fonts | Plus Jakarta Sans |

### PWA

| Elemento | Situação no código |
|---|---|
| `manifest.webmanifest` | Nome e nome curto "CicloLocal", `lang` pt-BR, `start_url` `./index.html`, `scope` `./`, `display` `standalone`, cores `#F7F5F0`, ícones 192, 512 e maskable 512, duas capturas de tela (wide 1280×720 e mobile 390×844) |
| `sw.js` | Cache `ciclolocal-v4`; pré-cache na instalação (`skipWaiting`); ativação remove caches antigos e assume as abas (`clients.claim`) |
| Estratégia de cache | Arquivos do app: cache primeiro, rede como reserva. Google Fonts: cache no primeiro uso. ViaCEP: sempre rede. Navegação sem cache e sem rede cai em `index.html`. Outros pedidos `GET` (IBGE, Nominatim) vão à rede, sem cache |
| Registro | Em `js/app.js` (carregado em todas as páginas), controlado pela constante `USAR_PWA`; falhas de registro são silenciosas |
| Instalação | Botão `#botao-instalar` aparece quando o navegador dispara `beforeinstallprompt` (Chromium). No iOS, a instalação é manual (Compartilhar → Adicionar à Tela de Início) |

**Atualizações:** como o cache é "cache primeiro", todo deploy que altere arquivos do app exige mudar o valor de `VERSAO` em `sw.js`; senão o usuário continua vendo a versão antiga.

**Limites:** o armazenamento continua local por navegador. Serviços externos (ViaCEP, IBGE, Nominatim) precisam de internet. Instalação e uso offline estão implementados no código, mas **não foram validados em dispositivo real** (ver roadmap).

### Estrutura do repositório

```text
ciclo-local/
├── index.html · selecao-de-perfil.html · perfil-doador.html
├── confirmacao-doador.html · perfil-coletor.html · confirmacao-coletor.html
├── historico-coletas.html · dashboard.html
├── reset.css · tokens.css · style.css · preloader.css · print.css
├── manifest.webmanifest · sw.js
├── js/        (módulos abaixo)
├── img/       (logo, favicon, prévias sociais, icones/, screenshots/)
└── docs/      (referencia.md, roadmap.md, identidade-visual/, prototipos/)
```

### Módulos JavaScript

| Módulo | Responsabilidade |
|---|---|
| `app.js` | Inicialização compartilhada, `reiniciarDemo()`, registro do service worker e botão de instalação |
| `preloader.js` | Tela de carregamento (apenas no login simulado) |
| `storage.js` | Leitura, atualização e persistência do estado local |
| `dados.js` | Categorias de materiais e dados |
| `util.js` | Funções utilitárias |
| `cep.js` | Máscara, validação e consulta de CEP |
| `local.js` | Geolocalização e seleção de cidade |
| `esg.js` | Estimativa de impacto ambiental |
| `resultados.js` | Consolidação dos resultados |
| `filtro-bairro.js` | Componente de filtro por bairro |
| `perfil-doador.js`, `perfil-coletor.js` | Formulário/pedido e listagem/aceite |
| `confirmacao-doador.js`, `confirmacao-coletor.js` | Resumo; confirmação, conclusão e desistência |
| `historico-coletas.js`, `dashboard.js` | Histórico com filtros; indicadores e filtros do painel |

## 6. Identidade visual e acessibilidade

**Direção "Industrial Orgânico":** tons de areia, azul-petróleo e terracota; Plus Jakarta Sans; ícones SVG; preloader. Cores, fontes e espaçamentos ficam em `tokens.css` (variáveis `--cor-*`, `--esp-*`, `--fs-*`).

| Token | Hex | Uso |
|---|---|---|
| Areia 100 | `#F7F5F0` | Fundo principal |
| Areia 200 | `#ECE7DC` | Superfícies secundárias |
| Petróleo 900 | `#1D3557` | Texto e títulos |
| Terracota 600 | `#B5502B` | Ações principais (texto branco permitido) |
| Terracota 700 | `#933F20` | Hover e pressionado |
| Terracota 400 | `#D96B43` | Só decorativo ou texto grande |
| Cinza 600 | `#4B5563` | Texto secundário |

**Acessibilidade:** meta **WCAG 2.1 nível AA**. Está implementada no código (HTML semântico, rótulos, foco visível, link "Pular para o conteúdo", `aria-live`, `aria-current`, alvos de 44 px, movimento reduzido), mas **requer nova validação** após as implementações recentes. A meta não equivale a certificação nem a declaração de conformidade. Registre testes, falhas e correções (teclado, leitor de tela, contraste, zoom/reflow, 320 px, impressão).

## 7. Limitações atuais

- Sem backend ou banco: dados não sincronizam entre aparelhos, navegadores ou usuários, e podem ser apagados pelo usuário.
- Entrada gov.br simulada; nunca solicitar CPF ou senha reais.
- Outra cidade selecionada não significa base real de pedidos.
- Serviços externos dependem de conexão e de políticas próprias.
- Indicadores ambientais são estimativas.

## 8. Fluxo Git e equipe

- Branch `main` como referência estável; branches curtas (`feature/...`, `fix/...`); mudanças por Pull Request; commits `feat:`, `fix:`, `docs:`, `style:`, `refactor:`.
- Ao alterar arquivos do app, lembre de atualizar `VERSAO` em `sw.js`.
- **Equipe:** Gabe Queiroz, Alisson Amarante, Daniel Costa, Pedro Camilo, Pedro Santos, Ryan Silva.

## 9. Roteiro de apresentação

1. Problema: conectar quem separa recicláveis a quem coleta e acompanhar resultados.
2. Proposta e perfis de doador e coletor.
3. Demonstração: pedido → aceite → conclusão com peso confirmado → histórico e painel.
4. Mostrar o app instalado (PWA), se validado em dispositivo.
5. Limites: armazenamento local, dados de demonstração e estimativa ambiental.

## 10. Referências

[Repositório](https://github.com/gabeqrz/ciclo-local) · [Aplicação](https://gabeqrz.github.io/ciclo-local/) · [WCAG 2.1](https://www.w3.org/TR/WCAG21/) · [EPA WARM](https://www.epa.gov/waste-reduction-model) · [ViaCEP](https://viacep.com.br/) · [IBGE localidades](https://servicodados.ibge.gov.br/api/docs/localidades)
