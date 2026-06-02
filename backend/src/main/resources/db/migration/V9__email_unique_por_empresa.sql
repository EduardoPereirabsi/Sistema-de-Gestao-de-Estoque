ALTER TABLE usuarios DROP INDEX email;

ALTER TABLE usuarios
    ADD CONSTRAINT uq_usuario_email_empresa UNIQUE (email, empresa_id);
