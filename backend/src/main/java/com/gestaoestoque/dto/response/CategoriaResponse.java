package com.gestaoestoque.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
@Schema(description = "Dados de uma categoria cadastrada")
public class CategoriaResponse {
    @Schema(description = "ID da categoria", example = "1")
    private Long id;

    @Schema(description = "Nome da categoria", example = "Eletronicos")
    private String nome;

    @Schema(description = "Descrição da categoria", example = "Produtos eletronicos em geral")
    private String descricao;

    @Schema(description = "Data/hora de criação da categoria", example = "2026-06-02T13:00:00")
    private LocalDateTime criadoEm;
}