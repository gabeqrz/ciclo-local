# CicloLocal — Evoluções futuras e backlog estratégico

**Versão 2.3 · novembro de 2026**

## Objetivo deste documento

Este arquivo reúne possibilidades de evolução do CicloLocal que não fazem parte do conjunto de funcionalidades já identificado na versão atual do projeto. Ele complementa o README, o documento unificado e o roadmap: não substitui o planejamento de execução nem representa compromisso de implementação.

As sugestões foram reorganizadas para evitar manter como “futuras” funcionalidades que já existem no protótipo. A presença de uma funcionalidade no código não significa que sua validação esteja concluída; os testes pendentes continuam registrados no roadmap.

## 1. Experiência e funcionalidades de interface

### 1.1 Mapa interativo de coletas por bairro
**Status:** ideia futura.

Adicionar uma visualização geográfica dos pedidos ou das coletas, com marcadores por bairro. Uma possível implementação front-end seria Leaflet com OpenStreetMap. Antes de desenvolver, definir quais dados de localização podem ser exibidos sem expor endereços pessoais e como a visualização funcionará quando a permissão de localização não for concedida.

### 1.2 Visões personalizadas no painel
**Status:** evolução possível.

O dashboard atual já apresenta indicadores, evolução temporal, distribuição por material e comparação/ranking de bairros. Como evolução, avaliar visões específicas para:
- **Morador/doador:** resumo das próprias solicitações e coletas concluídas.
- **Catador/coletor:** resumo das coletas aceitas e concluídas.
- **Comunidade/bairro:** indicadores agregados da região.

Essas visões dependem de uma identificação confiável dos registros e, para uso entre dispositivos, de uma infraestrutura de dados compartilhada.

### 1.3 Histórico individual
**Status:** evolução possível.

O projeto já possui uma página de histórico de coletas com filtros por mês e bairro. Uma evolução seria permitir que cada morador e cada coletor consulte seu próprio histórico, com separação clara entre solicitações, coletas aceitas e coletas concluídas. A experiência individual depende de identificação de usuário e de regras de privacidade.

### 1.4 Metas e selos de participação
**Status:** ideia futura.

Avaliar mecanismos opcionais de reconhecimento, como selos por metas mensais ou participação recorrente. Os critérios devem valorizar a participação sem incentivar competição inadequada, exposição de dados pessoais ou metas ambientais sem comprovação.

### 1.5 Filtros e exploração por material
**Status:** aprimoramento a avaliar.

A aplicação já trabalha com sete categorias de materiais e apresenta dados por material no painel. Como evolução, avaliar filtros interativos que permitam explorar indicadores e histórico por categoria, caso essa interação ainda não esteja coberta pelos controles atuais.

### 1.6 Orientação para ecopontos
**Status:** ideia futura.

Oferecer orientação ou link para um ecoponto adequado quando o material não puder ser encaminhado pelo fluxo atual. A funcionalidade exigiria uma fonte confiável e atualizada de locais, critérios para identificar o tipo de resíduo aceito e indicação clara de que horários e condições devem ser confirmados com o estabelecimento.

### 1.7 Relatórios mais detalhados
**Status:** aprimoramento a avaliar.

A impressão do dashboard e a possibilidade de salvar em PDF já fazem parte da versão atual. Uma evolução seria criar relatórios com filtros selecionados, período, bairro, detalhamento por material, metodologia de cálculo e identificação explícita de dados demonstrativos ou reais.

## 2. Infraestrutura e integrações

Estas evoluções estão fora do escopo do protótipo front-end sem servidor.

### 2.1 Backend e banco de dados compartilhado
**Status:** evolução estrutural futura.

Substituir ou complementar o armazenamento local por uma infraestrutura centralizada, para que pedidos e atualizações possam ser acessados por diferentes dispositivos. A solução deverá definir autenticação, autorização, integridade dos estados dos pedidos, proteção de dados, cópias de segurança e política de retenção. Supabase é apenas uma alternativa a avaliar, não uma decisão técnica já tomada.

### 2.2 Autenticação real
**Status:** depende de viabilidade institucional e técnica.

A entrada inspirada no gov.br é demonstrativa e não realiza autenticação oficial. Uma integração real exigiria seguir os requisitos e o processo de credenciamento aplicáveis, além de implementar o fluxo seguro em infraestrutura de servidor. Não armazenar segredos de cliente no JavaScript do navegador. A possibilidade de credenciais para um projeto acadêmico deve ser confirmada diretamente com os responsáveis pelo serviço antes de qualquer planejamento definitivo.

### 2.3 Notificações
**Status:** evolução futura.

Avaliar notificações quando um pedido for aceito ou quando houver mudança relevante no estado da coleta. A implementação dependerá de backend e de uma decisão sobre canais, consentimento, frequência e preferências do usuário.

## 3. Dados ambientais e validação com a comunidade

### 3.1 Fatores brasileiros de impacto ambiental
**Status:** pesquisa futura.

O cálculo atual apresenta uma estimativa de CO₂ equivalente baseada em fatores de referência do EPA WARM v16, dos Estados Unidos, adaptados às categorias simplificadas do projeto. Pesquisar fatores brasileiros ou estudos nacionais adequados antes de substituir a metodologia. Qualquer mudança deverá documentar fonte, unidade, limites e compatibilidade entre categorias; não apresentar estimativas como medições diretas.

### 3.2 Validação das categorias e dos materiais
**Status:** validação externa futura.

Conversar com catadores e cooperativas para verificar se as categorias usadas na interface representam materiais efetivamente coletados e comercializados na região, quais separações são relevantes e quais materiais exigem condições específicas de acondicionamento.

### 3.3 Indicadores sociais e territoriais
**Status:** possibilidade de pesquisa.

Avaliar indicadores que ajudem a representar a contribuição comunitária do projeto, sem afirmar aumento de renda, inclusão produtiva ou destinação final comprovada sem dados e metodologia que sustentem essas conclusões.

## 4. Expansão territorial

**Status:** depende de validação do piloto.

Avaliar a adaptação do CicloLocal para outros bairros ou municípios. Antes de expandir, validar a disponibilidade de coletores, a atualização das informações locais, a adequação das categorias de materiais e a capacidade de operação e suporte.

## 5. Itens que não devem permanecer como pendências de implementação

Os itens abaixo já aparecem na versão atual e devem ser acompanhados no roadmap como funcionalidades implementadas sujeitas a testes, não como funcionalidades futuras:

- Ranking/comparação de bairros no dashboard.
- Histórico geral de coletas com filtros por mês e bairro.
- Indicadores e visualizações de dados por material.
- Impressão do dashboard e possibilidade de salvar em PDF.

A existência dessas funcionalidades não elimina a necessidade de testar seu comportamento, acessibilidade e consistência dos dados.

## 6. Critérios para priorizar uma evolução

Antes de transformar uma ideia deste documento em tarefa de implementação, registrar:

1. Qual problema do usuário a evolução resolve?
2. Quais páginas, módulos e dados serão afetados?
3. A mudança cabe no escopo front-end atual ou exige backend/serviço externo?
4. Há riscos de privacidade, segurança, acessibilidade ou confiabilidade?
5. Como será testada e qual evidência permitirá considerá-la concluída?
6. O README, o documento unificado e o roadmap precisarão ser atualizados?

## 7. Relação com os demais documentos

| Documento | Finalidade |
|---|---|
| `README.md` | Apresentação pública do projeto, funcionalidades atuais, tecnologias e execução. |
| Documento unificado | Registro de referência sobre proposta, escopo, arquitetura, regras, limites e decisões. |
| Roadmap de execução | Acompanhamento do que está implementado, em validação, em andamento ou fora do escopo atual. |
| `docs/IMPLEMENTACOES-FUTURAS.md` | Backlog estratégico de possibilidades que ainda não integram a versão atual. |

**Regra de manutenção:** quando uma evolução for iniciada, mova a tarefa para o roadmap. Quando estiver implementada, atualize o documento unificado e o README conforme necessário e remova-a da lista de ideias futuras. Não marque validação como concluída sem evidência de teste.
