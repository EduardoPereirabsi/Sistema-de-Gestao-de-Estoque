-- V1__init_schema.sql
-- Schema inicial do sistema de gestão de estoque

CREATE TABLE empresas (
    id         BIGINT AUTO_INCREMENT PRIMARY KEY,
    nome       VARCHAR(150) NOT NULL,
    cnpj       VARCHAR(18)  NOT NULL UNIQUE,
    email      VARCHAR(150),
    telefone   VARCHAR(20),
    ativo      BOOLEAN      NOT NULL DEFAULT TRUE,
    criado_em  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_empresas_cnpj (cnpj)
);

CREATE TABLE usuarios (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    empresa_id  BIGINT       NOT NULL,
    nome        VARCHAR(150) NOT NULL,
    email       VARCHAR(150) NOT NULL UNIQUE,
    senha       VARCHAR(255) NOT NULL,
    perfil      ENUM('ADMIN', 'OPERADOR') NOT NULL DEFAULT 'OPERADOR',
    ativo       BOOLEAN      NOT NULL DEFAULT TRUE,
    criado_em   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_usuarios_empresa FOREIGN KEY (empresa_id) REFERENCES empresas (id),
    INDEX idx_usuarios_email (email),
    INDEX idx_usuarios_empresa (empresa_id)
);

CREATE TABLE categorias (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    empresa_id  BIGINT       NOT NULL,
    nome        VARCHAR(100) NOT NULL,
    descricao   VARCHAR(255),
    ativo       BOOLEAN      NOT NULL DEFAULT TRUE,
    criado_em   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_categorias_empresa FOREIGN KEY (empresa_id) REFERENCES empresas (id),
    UNIQUE KEY uq_categoria_empresa (empresa_id, nome),
    INDEX idx_categorias_empresa (empresa_id)
);

CREATE TABLE fornecedores (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    empresa_id  BIGINT       NOT NULL,
    nome        VARCHAR(150) NOT NULL,
    cnpj        VARCHAR(18),
    email       VARCHAR(150),
    telefone    VARCHAR(20),
    ativo       BOOLEAN      NOT NULL DEFAULT TRUE,
    criado_em   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_fornecedores_empresa FOREIGN KEY (empresa_id) REFERENCES empresas (id),
    INDEX idx_fornecedores_empresa (empresa_id),
    INDEX idx_fornecedores_cnpj (cnpj)
);

CREATE TABLE produtos (
    id              BIGINT         AUTO_INCREMENT PRIMARY KEY,
    empresa_id      BIGINT         NOT NULL,
    categoria_id    BIGINT,
    fornecedor_id   BIGINT,
    nome            VARCHAR(150)   NOT NULL,
    descricao       VARCHAR(500),
    sku             VARCHAR(50),
    preco           DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    quantidade      INT            NOT NULL DEFAULT 0,
    estoque_minimo  INT            NOT NULL DEFAULT 0,
    ativo           BOOLEAN        NOT NULL DEFAULT TRUE,
    criado_em       DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em   DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_produtos_empresa    FOREIGN KEY (empresa_id)    REFERENCES empresas (id),
    CONSTRAINT fk_produtos_categoria  FOREIGN KEY (categoria_id)  REFERENCES categorias (id) ON DELETE SET NULL,
    CONSTRAINT fk_produtos_fornecedor FOREIGN KEY (fornecedor_id) REFERENCES fornecedores (id) ON DELETE SET NULL,
    UNIQUE KEY uq_produto_sku_empresa (empresa_id, sku),
    INDEX idx_produtos_empresa (empresa_id),
    INDEX idx_produtos_categoria (categoria_id),
    INDEX idx_produtos_fornecedor (fornecedor_id),
    INDEX idx_produtos_ativo (ativo)
);

CREATE TABLE movimentacoes_estoque (
    id           BIGINT                   AUTO_INCREMENT PRIMARY KEY,
    produto_id   BIGINT                   NOT NULL,
    usuario_id   BIGINT                   NOT NULL,
    tipo         ENUM('ENTRADA', 'SAIDA') NOT NULL,
    quantidade   INT                      NOT NULL,
    observacao   VARCHAR(500),
    criado_em    DATETIME                 NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_movimentacoes_produto FOREIGN KEY (produto_id) REFERENCES produtos (id),
    CONSTRAINT fk_movimentacoes_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios (id),
    INDEX idx_movimentacoes_produto (produto_id),
    INDEX idx_movimentacoes_usuario (usuario_id),
    INDEX idx_movimentacoes_tipo (tipo),
    INDEX idx_movimentacoes_criado_em (criado_em)
);
