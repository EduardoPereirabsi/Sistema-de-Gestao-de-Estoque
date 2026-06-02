package com.gestaoestoque.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
@Schema(description = "Dados para criação ou atualização de uma categoria")
public class CategoriaRequest {

    @NotBlank(message = "Nome da categoria é obrigatório")
    @Size(max = 100, message = "Nome deve ter no máximo 100 caracteres")
    @Schema(description = "Nome da categoria", example = "Eletronicos")
    private String nome;

    @Schema(description = "Descrição opcional da categoria", example = "Produtos eletronicos em geral")
    private String descricao;
}