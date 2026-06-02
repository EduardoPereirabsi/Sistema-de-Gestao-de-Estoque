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
    @Schema(description = "Dia formatado para exibição", example = "02/06")
    private String data;

    @Schema(description = "Quantidade de entradas no dia", example = "4")
    private Long entradas;

    @Schema(description = "Quantidade de saídas no dia", example = "2")
    private Long saidas;

    @Schema(description = "Quantidade de ajustes no dia", example = "1")
    private Long ajustes;
}