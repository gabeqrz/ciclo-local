# CicloLocal — Roadmap, status e evoluções

**Atualizado em 23 de novembro de 2026.** Une o acompanhamento de execução e o backlog de evoluções. Detalhes técnicos ficam na [referência](./referencia.md).

**Convenção de status:** *Implementado* (está no código; pode exigir teste) · *Validação pendente* (executar o teste e registrar evidência) · *Em andamento* · *Fora do escopo atual*. Nunca marque como aprovado só porque existe código.

## 1. Status por frente

| Frente                                                     | Status                                                        | O que falta validar                                                             |
| ---------------------------------------------------------- | ------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| Base, identidade e 9 páginas                               | Implementado                                                  | HTML no W3C, reflow, zoom, contraste, teclado                                   |
| Entrada demonstrativa e preloader                          | Implementado                                                  | Navegação e redução de movimento                                                |
| Doador, ViaCEP e pedido                                    | Implementado                                                  | CEP válido/inexistente/incompleto, falha de rede, persistência                  |
| Coletor (filtro, aceite, desistência, conclusão)           | Implementado                                                  | Estados, peso inválido, persistência após recarregar                            |
| Histórico de coletas                                       | Implementado                                                  | Filtros por mês/bairro, exibição progressiva                                    |
| Menu principal (Início, Coletas/Pedidos, Resultados, Sair) | Implementado e testado nas 9 páginas                          | Nada pendente                                                                   |
| Pedidos do doador (acompanhamento e histórico)             | Implementado e testado (3 estados, outra aba, botão "Voltar") | Nada pendente                                                                   |
| Localização                                                | Implementado                                                  | Permissão concedida, negada, serviço indisponível                               |
| Dashboard, CO₂ e impressão                                 | Implementado                                                  | Conferir 19,60 kg CO₂e no exemplo; testar `print.css` em navegadores diferentes |
| Dados de demonstração e `reiniciarDemo()`                  | Implementado                                                  | Confirmar que `reiniciar()` limpa todo o estado e recarrega                     |
| PWA (manifest, ícones, service worker)                     | Implementado                                                  | Instalação e offline em dispositivo real (ver seção 2)                          |
| Acessibilidade WCAG 2.1 AA                                 | Implementado no código; revalidação pendente                  | Teclado, foco, leitor de tela, contraste, zoom, mensagens dinâmicas             |
| Lighthouse                                                 | Validação pendente                                            | Registrar data, URL, navegador e pontuações                                     |
| Teste em celular real                                      | Validação pendente                                            | Fluxos de doador, coletor e painel                                              |
| Publicação e documentação                                  | GitHub Pages publicado; documentos atualizados nesta versão   | Conferir metadados e prévia social                                              |

## 1.1 Prioridade antes da apresentação (nov/2026)

**Concluído e testado** (sem checklist): correções da revisão de UX/UI (card de coleta aceita, `barra-aceite`, `print.css`), menu com "Sair" e "Pedidos", acompanhamento do doador, "Últimos pedidos concluídos", `historico-pedidos.html` com pré-cache e `VERSAO`, link fixo "Ver meus pedidos", slide do piloto de 90 dias e o ajuste "Tenho material pronto" no deck e no roteiro.

**Documentação**

- [x] README: preencher os nomes completos da equipe. A reinicialização dos dados de exemplo existe só pelo console (`reiniciarDemo()`); não há botões e não serão implantados.
- [x] README e referência: incluir `historico-pedidos.html` (9 páginas), o menu com "Sair" e a página de pedidos do doador.

**PWA e testes (mínimo para a demonstração)**

- [x] Trocar `VERSAO` no último deploy; remover `USAR_PWA`; conferir ícones e maiúsculas/minúsculas.
- [x] Fluxo doador → coletor → painel, online e em modo avião, no aparelho da apresentação.
- [ ] Rodar `reiniciarDemo()` e confirmar que os dados de exemplo voltam (é o plano B da demonstração).

## 2. PWA: pendências e conferências

**Para corrigir ou conferir no código**

Concluído: pré-cache do `sw.js` (9 páginas, 5 CSS e os módulos JS), caminhos dos ícones e `addAll`, registro único do service worker em `app.js`, comentário de `USAR_PWA`, botão de instalar (no início e na seleção de perfil) e manifest com `apple-touch-icon` em todas as páginas.

- [x] Os arquivos `img/screenshots/desktop.png` e `mobile.png` do manifest existem?
- [x] Os fluxos que dependem de rede (CEP, IBGE, geolocalização) mostram mensagem compreensível offline?

**Testes (registrar dispositivo, navegador, data e resultado)**

- [x] DevTools → Application: manifest sem erros, "Installable" e service worker ativo; Cache Storage com todos os arquivos.
- [x] Instalar no Android (Chrome) e abrir como app standalone.
- [ ] Adicionar à Tela de Início no iPhone (Safari).
- [ ] Modo avião: abrir cada uma das 9 páginas e completar o fluxo doador → coletor → painel.
- [x] Após um deploy com `VERSAO` nova, confirmar que o app instalado atualiza.

> O Lighthouse atual não tem mais categoria PWA; use o painel Application e o teste em dispositivo como evidência.

## 3. Roteiro mínimo de testes ponta a ponta

- [ ] Reiniciar a demonstração (`reiniciarDemo()`) e recarregar.
- [x] Criar um pedido como doador com CEP válido e mais de um material.
- [x] Ver o pedido disponível ao coletor na cidade correspondente.
- [x] Filtrar por bairro, aceitar e confirmar quando o endereço completo aparece.
- [x] Desfazer o aceite e aceitar de novo.
- [x] Alterar pelo menos um peso em relação ao estimado e concluir.
- [x] Confirmar a coleta no histórico e que o painel só mudou após a conclusão.
- [ ] Conferir cálculo de CO₂e e filtros por bairro e mês.
- [ ] Testar impressão/PDF e repetir o fluxo essencial por teclado e em 320 px.

## 4. Riscos

| Risco | Resposta |
|---|---|
| `localStorage` não sincroniza aparelhos | Demonstrar no mesmo navegador e explicar o limite |
| Serviços externos indisponíveis | Mensagens claras e alternativa manual |
| Dados fictícios confundidos com reais | Manter o selo "Modo demonstração" e separar os registros |
| Fatores de CO₂ dos EUA | Falar sempre em estimativa e citar EPA WARM v16 |
| Cache antigo após deploy | Atualizar `VERSAO` em `sw.js` a cada mudança de arquivos do app |
| "Sair" apaga todos os dados do aparelho durante a demonstração | Não tocar em "Sair" no meio do fluxo; é o plano B visível para recomeçar |
| Acessibilidade só no fim | Testar teclado e semântica a cada mudança |
| Alegar qualidade sem medição | Registrar evidências antes de marcar como concluído |

## 5. Evoluções futuras (backlog)

Não são compromisso de implementação. Quando uma evolução for iniciada, mova-a para a seção 1; quando concluída, atualize a referência e o README e remova-a daqui.

**Interface**

- **Mapa por bairro** (ex.: Leaflet + OpenStreetMap), sem expor endereços pessoais e com alternativa sem permissão de localização.
- **Visões personalizadas** (doador, coletor, comunidade) e **histórico individual entre dispositivos**: dependem de identificação confiável e de infraestrutura compartilhada. Hoje o histórico de pedidos do doador existe, mas só no mesmo navegador.
- **Metas e selos** de participação, sem incentivar competição inadequada ou metas ambientais sem comprovação.
- **Filtros por material** no painel e no histórico.
- **Orientação para ecopontos**, com fonte confiável e atualizada.
- **Relatórios detalhados** com período, bairro, metodologia e identificação de dados demonstrativos ou reais.

**Infraestrutura** (fora do escopo front-end atual)

- **Backend e banco compartilhado** (ex.: Supabase, apenas uma alternativa a avaliar), com autenticação, autorização, integridade de estados, proteção de dados e retenção.
- **Autenticação real** (gov.br), sujeita a viabilidade institucional e técnica; nunca guardar segredos no JavaScript do navegador.
- **Notificações**, que dependem de backend e de decisões sobre consentimento e frequência.

**Dados e validação**

- **Fatores brasileiros de CO₂**, documentando fonte, unidade e limites.
- **Validação das categorias** com catadores e cooperativas.
- **Indicadores sociais**, sem afirmar renda ou destinação final sem metodologia.
- **Expansão territorial**, após validar um piloto (coletores, informações locais, suporte).

**Expansão do produto**

- **Perfil Ponto/estabelecimento** (pequenos comércios): botão "Tenho material pronto", uso por funcionários via gov.br/CPF em nome da empresa, sem cadastro empresarial pesado, aviso sob demanda (o descarte é diário), selo no bairro e comprovante mensal. Desenho aprovado; código ainda não aplicado nem testado.
- **Rotas do coletor:** pedidos agrupados por bairro e dia.
- **Grandes geradores** por cooperativas cadastradas, condicionado à validação regulatória (SP Regula) no piloto.
- **Pontos de apoio** (ecopontos, cooperativas) que registram pedidos de quem não tem celular.

**Piloto e sustentação** (fora do código)

- **Piloto de 90 dias** em uma subprefeitura ou três bairros. Métricas: quilos recolhidos, coletores ativos, CO₂ estimado, quilos por viagem, tempo por quilo, retenção e, por questionário, renda e gasto no bairro antes e depois.
- **Modelo de sustentação (hipótese, sem valores):** licença por faixa de população, implantação e relatórios/parcerias; o cidadão não paga. O preço não é tratado na apresentação.
- **Conferência do peso:** cruzar com a pesagem das cooperativas e criar alertas para valores fora do padrão.
- **LGPD:** base legal, termo de uso e política de retenção, definidos com o jurídico.

**Antes de priorizar uma ideia, responda:** qual problema resolve? cabe no front-end atual? há riscos de privacidade, segurança ou acessibilidade? como será testada? quais documentos mudam?
