package com.gestaoestoque.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
@Schema(description = "Resumo do painel/dashboard")
public class PainelResponse {
    @Schema(description = "Quantidade total de produtos", example = "215")
    private Long totalProdutos;

    @Schema(description = "Quantidade total de categorias", example = "10")
    private Long totalCategorias;

    @Schema(description = "Quantidade total de fornecedores", example = "18")
    private Long totalFornecedores;

    @Schema(description = "Valor total em estoque", example = "134870.25")
    private BigDecimal valorTotalEstoque;

    @Schema(description = "Quantidade de produtos abaixo do estoque minimo", example = "8")
    private Long produtosAbaixoMinimo;

    @Schema(description = "Quantidade de movimentações no mês atual", example = "67")
    private Long movimentacoesMes;
}