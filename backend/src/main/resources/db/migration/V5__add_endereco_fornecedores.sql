-- V5__add_endereco_fornecedores.sql
-- Adiciona coluna endereco na tabela fornecedores

ALTER TABLE fornecedores
    ADD COLUMN endereco VARCHAR(255) NULL;
