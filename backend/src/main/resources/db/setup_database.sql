-- =============================================================
-- Script de setup do banco de dados
-- Execute como root/administrador do MySQL antes de subir a aplicação
-- =============================================================

CREATE DATABASE IF NOT EXISTS gestao_estoque
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

CREATE USER IF NOT EXISTS 'gestao_user'@'localhost' IDENTIFIED BY 'gestao_pass';

GRANT ALL PRIVILEGES ON gestao_estoque.* TO 'gestao_user'@'localhost';

FLUSH PRIVILEGES;

SELECT 'Banco gestao_estoque e usuario gestao_user criados com sucesso!' AS status;
