package com.gestaoestoque.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
@Schema(description = "Empresa disponível para autenticação do usuário")
public class EmpresaResponse {
    @Schema(description = "ID da empresa", example = "1")
    private Long id;

    @Schema(description = "Nome da empresa", example = "Empresa Exemplo")
    private String nome;
}