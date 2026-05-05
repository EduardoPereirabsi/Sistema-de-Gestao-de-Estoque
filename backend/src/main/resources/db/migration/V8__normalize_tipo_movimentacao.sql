ALTER TABLE movimentacoes_estoque
    MODIFY COLUMN tipo ENUM('ENTRY', 'EXIT', 'ADJUSTMENT', 'ENTRADA', 'SAIDA', 'AJUSTE') NOT NULL;

UPDATE movimentacoes_estoque
SET tipo = 'ENTRADA'
WHERE tipo = 'ENTRY';

UPDATE movimentacoes_estoque
SET tipo = 'SAIDA'
WHERE tipo = 'EXIT';

UPDATE movimentacoes_estoque
SET tipo = 'AJUSTE'
WHERE tipo = 'ADJUSTMENT';

ALTER TABLE movimentacoes_estoque
    MODIFY COLUMN tipo ENUM('ENTRADA', 'SAIDA', 'AJUSTE') NOT NULL;
