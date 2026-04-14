-- V6: Views para dashboard, estoque baixo e relatório de movimentações
-- Nota: Usamos views em vez de stored procedures para compatibilidade com Flyway + MySQL

CREATE OR REPLACE VIEW vw_estoque_baixo AS
SELECT
    p.id,
    p.nome,
    p.sku,
    p.quantidade,
    p.quantidade_minima,
    (p.quantidade_minima - p.quantidade) AS deficit,
    p.empresa_id
FROM produtos p
WHERE p.quantidade < p.quantidade_minima
  AND p.ativo = TRUE
ORDER BY deficit DESC;

CREATE OR REPLACE VIEW vw_movimentacoes_diarias AS
SELECT
    DATE(me.criado_em)                                                      AS data,
    p.empresa_id,
    SUM(CASE WHEN me.tipo = 'ENTRADA' THEN me.quantidade ELSE 0 END)        AS entradas,
    SUM(CASE WHEN me.tipo = 'SAIDA'   THEN me.quantidade ELSE 0 END)        AS saidas,
    SUM(CASE WHEN me.tipo = 'AJUSTE'  THEN me.quantidade ELSE 0 END)        AS ajustes
FROM movimentacoes_estoque me
         JOIN produtos p ON me.produto_id = p.id
WHERE me.criado_em >= DATE_SUB(NOW(), INTERVAL 7 DAY)
GROUP BY DATE(me.criado_em), p.empresa_id
ORDER BY data ASC;
