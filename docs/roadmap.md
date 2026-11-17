# CicloLocal — Roadmap, status e evoluções

**Atualizado em 16 de novembro de 2026.** Une o acompanhamento de execução e o backlog de evoluções. Detalhes técnicos ficam na [referência](./referencia.md).

**Convenção de status:** *Implementado* (está no código; pode exigir teste) · *Validação pendente* (executar o teste e registrar evidência) · *Em andamento* · *Fora do escopo atual*. Nunca marque como aprovado só porque existe código.

## 1. Status por frente

| Frente | Status | O que falta validar |
|---|---|---|
| Base, identidade e 8 páginas | Implementado | HTML no W3C, reflow, zoom, contraste, teclado |
| Entrada demonstrativa e preloader | Implementado | Navegação e redução de movimento |
| Doador, ViaCEP e pedido | Implementado | CEP válido/inexistente/incompleto, falha de rede, persistência |
| Coletor (filtro, aceite, desistência, conclusão) | Implementado | Estados, peso inválido, persistência após recarregar |
| Histórico de coletas | Implementado | Filtros por mês/bairro, exibição progressiva |
| Localização | Implementado | Permissão concedida, negada, serviço indisponível |
| Dashboard, CO₂ e impressão | Implementado | Conferir 19,60 kg CO₂e no exemplo; testar `print.css` em navegadores diferentes |
| Dados de demonstração e `reiniciarDemo()` | Implementado | Confirmar que `reiniciar()` limpa todo o estado e recarrega |
| PWA (manifest, ícones, service worker) | Implementado | Instalação e offline em dispositivo real (ver seção 2) |
| Acessibilidade WCAG 2.1 AA | Implementado no código; revalidação pendente | Teclado, foco, leitor de tela, contraste, zoom, mensagens dinâmicas |
| Lighthouse | Validação pendente | Registrar data, URL, navegador e pontuações |
| Teste em celular real | Validação pendente | Fluxos de doador, coletor e painel |
| Publicação e documentação | GitHub Pages publicado; documentos atualizados nesta versão | Conferir metadados e prévia social |

## 2. PWA: pendências e conferências

**Para corrigir ou conferir no código**

- [x] **Pré-cache de `sw.js` completo:** a lista cobre as 8 páginas, os 5 CSS e os 16 módulos JS (corrigido na versão `ciclolocal-v5`).
- [ ] Os caminhos `./img/icones/icon-*.png` do pré-cache existem no repositório? Um arquivo ausente faz o `addAll` falhar e o service worker não instala.
- [ ] Os arquivos `img/screenshots/desktop.png` e `mobile.png` do manifest existem?
- [ ] `pwa.js` e `app.js` registram o mesmo service worker. Confirmar se `pwa.js` é carregado em alguma página; se não, remover. Atualizar o comentário de `USAR_PWA`.
- [ ] O botão `#botao-instalar` existe em alguma página? Todas as páginas têm `<link rel="manifest">` e `apple-touch-icon`?
- [ ] Os fluxos que dependem de rede (CEP, IBGE, geolocalização) mostram mensagem compreensível offline?

**Testes (registrar dispositivo, navegador, data e resultado)**

- [ ] DevTools → Application: manifest sem erros, "Installable" e service worker ativo; Cache Storage com todos os arquivos.
- [ ] Instalar no Android (Chrome) e abrir como app standalone.
- [ ] Adicionar à Tela de Início no iPhone (Safari).
- [ ] Modo avião: abrir cada uma das 8 páginas e completar o fluxo doador → coletor → painel.
- [ ] Após um deploy com `VERSAO` nova, confirmar que o app instalado atualiza.

> O Lighthouse atual não tem mais categoria PWA; use o painel Application e o teste em dispositivo como evidência.

## 3. Roteiro mínimo de testes ponta a ponta

- [ ] Reiniciar a demonstração (`reiniciarDemo()`) e recarregar.
- [ ] Criar um pedido como doador com CEP válido e mais de um material.
- [ ] Ver o pedido disponível ao coletor na cidade correspondente.
- [ ] Filtrar por bairro, aceitar e confirmar quando o endereço completo aparece.
- [ ] Desfazer o aceite e aceitar de novo.
- [ ] Alterar pelo menos um peso em relação ao estimado e concluir.
- [ ] Confirmar a coleta no histórico e que o painel só mudou após a conclusão.
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
| Acessibilidade só no fim | Testar teclado e semântica a cada mudança |
| Alegar qualidade sem medição | Registrar evidências antes de marcar como concluído |

## 5. Evoluções futuras (backlog)

Não são compromisso de implementação. Quando uma evolução for iniciada, mova-a para a seção 1; quando concluída, atualize a referência e o README e remova-a daqui.

**Interface**

- **Mapa por bairro** (ex.: Leaflet + OpenStreetMap), sem expor endereços pessoais e com alternativa sem permissão de localização.
- **Visões personalizadas** (doador, coletor, comunidade) e **histórico individual**: dependem de identificação confiável e, entre dispositivos, de infraestrutura compartilhada.
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

**Antes de priorizar uma ideia, responda:** qual problema resolve? cabe no front-end atual? há riscos de privacidade, segurança ou acessibilidade? como será testada? quais documentos mudam?
