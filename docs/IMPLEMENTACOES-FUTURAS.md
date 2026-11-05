# Implementações futuras

## Dentro do que o curso cobre (só HTML, CSS e JS)
- Mapa com marcadores por bairro (Leaflet + OpenStreetMap) e gráficos com Chart.js.
- Três visões no painel: bairro, morador e catador.
- Incentivo: selos por meta do mês, ranking de bairros, histórico pessoal.
- Link para o ecoponto mais próximo quando o material não for da lista.
- Filtros por material e relatório em PDF com mais detalhes.

## Precisa de servidor (fora do escopo do curso)
- **Banco de dados:** para o pedido do morador aparecer no aparelho do catador. Exemplo: Supabase.
- **Login real com gov.br (Login Único):** usa OAuth 2.0 (código de autorização). Exige pedir credenciais ao gov.br (client_id e segredo), uma URL de retorno em HTTPS e um servidor para guardar o segredo, que não pode ficar no JavaScript do navegador. Há ambiente de homologação para testes. Não confirmamos se projetos acadêmicos podem receber credenciais: é preciso consultar o gov.br. Até lá, o login continua simulado e sem dados reais.
- Notificações quando um pedido for aceito.

## Dados
- Trocar os fatores de CO₂ dos EUA por fatores brasileiros, quando houver fonte oficial.
- Confirmar com catadores e cooperativas quais materiais têm mais valor de venda.
