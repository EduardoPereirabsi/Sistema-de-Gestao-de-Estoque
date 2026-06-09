# Banco de dados avancado

## Indices

O schema inicial do projeto ja possui indices para as consultas mais frequentes:

- `idx_empresas_cnpj`
- `idx_usuarios_email`
- `idx_usuarios_empresa`
- `idx_categorias_empresa`
- `idx_fornecedores_empresa`
- `idx_fornecedores_cnpj`
- `idx_produtos_empresa`
- `idx_produtos_categoria`
- `idx_produtos_fornecedor`
- `idx_produtos_ativo`
- `idx_movimentacoes_empresa`
- `idx_movimentacoes_produto`
- `idx_movimentacoes_usuario`
- `idx_movimentacoes_tipo`
- `idx_movimentacoes_criado_em`

Esses indices aceleram:

- autenticacao e busca de usuarios por empresa
- filtros de categorias, fornecedores e produtos
- consultas de dashboard, estoque baixo e movimentacoes por periodo

## Stored procedures adicionadas

Migration: `backend/src/main/resources/db/migration/V10__stored_procedures_dashboard.sql`

### `sp_dashboard_resumo`

Retorna, por empresa:

- total de produtos
- total de categorias
- total de fornecedores
- valor total em estoque
- total de produtos abaixo do minimo
- movimentacoes do mes atual

### `sp_dashboard_grafico_diario`

Retorna o agrupamento diario do dashboard para uma quantidade configuravel de dias:

- entradas
- saidas
- ajustes

### `sp_produtos_estoque_baixo`

Retorna os produtos abaixo do estoque minimo, ordenados pelo maior deficit.

## Motivacao

As procedures acima centralizam consultas analiticas no banco e complementam as views ja existentes para relatorios e dashboard.
