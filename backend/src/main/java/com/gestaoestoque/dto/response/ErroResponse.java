package com.gestaoestoque.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Map;

@Data
@Builder
@Schema(description = "Resposta de erro padronizada")
public class ErroResponse {
    @Schema(description = "Código HTTP do erro", example = "400")
    private int status;

    @Schema(description = "Mensagem de erro", example = "Estoque insuficiente para esta operação")
    private String message;

    @Schema(description = "Data/hora do erro", example = "2026-03-25T10:30:00")
    private LocalDateTime timestamp;

    @Schema(description = "Erros de validação por campo")
    private Map<String, String> errors;
}