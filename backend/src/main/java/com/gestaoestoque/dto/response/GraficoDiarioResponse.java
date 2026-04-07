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
    private String date;
    private Long entries;
    private Long exits;
    private Long adjustments;
}