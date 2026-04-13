package com.gestaoestoque.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
@Schema(description = "Resumo do painel/dashboard")
public class PainelResponse {
    private Long totalProdutos;
    private Long totalCategorias;
    private Long totalFornecedores;
    private BigDecimal valorTotalEstoque;
    private Long produtosAbaixoMinimo;
    private Long movimentacoesMes;
}