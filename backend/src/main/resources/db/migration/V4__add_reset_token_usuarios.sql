-- V4__add_reset_token_usuarios.sql
-- Adiciona colunas para recuperação de senha na tabela usuarios

ALTER TABLE usuarios
    ADD COLUMN token_recuperacao             VARCHAR(255) NULL,
    ADD COLUMN token_recuperacao_expiracao   DATETIME     NULL;
