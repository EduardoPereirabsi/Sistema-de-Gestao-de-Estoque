package com.gestaoestoque.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Schema(description = "Dados diários de movimentações para gráfico")
public class GraficoDiarioResponse {
    private String data;
    private Long entradas;
    private Long saidas;
    private Long ajustes;
}