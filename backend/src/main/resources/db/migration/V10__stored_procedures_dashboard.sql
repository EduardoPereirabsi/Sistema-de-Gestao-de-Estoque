DROP PROCEDURE IF EXISTS sp_dashboard_resumo;
CREATE PROCEDURE sp_dashboard_resumo(IN p_empresa_id BIGINT)
SELECT
    (SELECT COUNT(*)
     FROM produtos p
     WHERE p.empresa_id = p_empresa_id
       AND p.ativo = TRUE)                                                   AS total_produtos,
    (SELECT COUNT(*)
     FROM categorias c
     WHERE c.empresa_id = p_empresa_id
       AND c.ativo = TRUE)                                                   AS total_categorias,
    (SELECT COUNT(*)
     FROM fornecedores f
     WHERE f.empresa_id = p_empresa_id
       AND f.ativo = TRUE)                                                   AS total_fornecedores,
    COALESCE((
        SELECT SUM(p.preco * p.quantidade)
        FROM produtos p
        WHERE p.empresa_id = p_empresa_id
          AND p.ativo = TRUE
    ), 0)                                                                    AS valor_total_estoque,
    (SELECT COUNT(*)
     FROM produtos p
     WHERE p.empresa_id = p_empresa_id
       AND p.ativo = TRUE
       AND p.quantidade <= p.quantidade_minima)                              AS produtos_abaixo_minimo,
    (SELECT COUNT(*)
     FROM movimentacoes_estoque me
     WHERE me.empresa_id = p_empresa_id
       AND MONTH(me.criado_em) = MONTH(CURRENT_DATE())
       AND YEAR(me.criado_em) = YEAR(CURRENT_DATE()))                        AS movimentacoes_mes;

DROP PROCEDURE IF EXISTS sp_dashboard_grafico_diario;
CREATE PROCEDURE sp_dashboard_grafico_diario(IN p_empresa_id BIGINT, IN p_dias INT)
SELECT
    DATE_FORMAT(me.criado_em, '%d/%m')                                       AS data,
    SUM(CASE WHEN me.tipo = 'ENTRADA' THEN 1 ELSE 0 END)                     AS entradas,
    SUM(CASE WHEN me.tipo = 'SAIDA' THEN 1 ELSE 0 END)                       AS saidas,
    SUM(CASE WHEN me.tipo = 'AJUSTE' THEN 1 ELSE 0 END)                      AS ajustes
FROM movimentacoes_estoque me
WHERE me.empresa_id = p_empresa_id
  AND me.criado_em >= DATE_SUB(CURDATE(), INTERVAL (p_dias - 1) DAY)
GROUP BY DATE(me.criado_em), DATE_FORMAT(me.criado_em, '%d/%m')
ORDER BY DATE(me.criado_em);

DROP PROCEDURE IF EXISTS sp_produtos_estoque_baixo;
CREATE PROCEDURE sp_produtos_estoque_baixo(IN p_empresa_id BIGINT)
SELECT
    p.id,
    p.nome,
    p.sku,
    p.quantidade,
    p.quantidade_minima,
    (p.quantidade_minima - p.quantidade) AS deficit
FROM produtos p
WHERE p.empresa_id = p_empresa_id
  AND p.ativo = TRUE
  AND p.quantidade < p.quantidade_minima
ORDER BY deficit DESC, p.nome;
