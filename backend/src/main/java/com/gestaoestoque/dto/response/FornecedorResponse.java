package com.gestaoestoque.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
@Schema(description = "Dados de um fornecedor cadastrado")
public class FornecedorResponse {
    @Schema(description = "ID do fornecedor", example = "1")
    private Long id;

    @Schema(description = "Nome do fornecedor", example = "Tech Distribuidora")
    private String nome;

    @Schema(description = "CNPJ do fornecedor", example = "11.222.333/0001-44")
    private String cnpj;

    @Schema(description = "Email do fornecedor", example = "contato@fornecedor.com")
    private String email;

    @Schema(description = "Telefone do fornecedor", example = "(11) 99999-0001")
    private String telefone;

    @Schema(description = "Endereço do fornecedor", example = "Rua das Tecnologias, 500 - Sao Paulo/SP")
    private String endereco;

    @Schema(description = "Data/hora de criação do fornecedor", example = "2026-06-02T13:10:00")
    private LocalDateTime criadoEm;
}