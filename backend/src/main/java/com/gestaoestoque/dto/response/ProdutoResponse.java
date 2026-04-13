package com.gestaoestoque.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@Schema(description = "Dados completos de um produto")
public class ProdutoResponse {
    @Schema(description = "ID do produto", example = "1")
    private Long id;

    @Schema(description = "Nome do produto", example = "Notebook Dell Inspiron 15")
    private String name;

    @Schema(description = "Código SKU único", example = "NOTE-DELL-001")
    private String sku;

    @Schema(description = "Descrição do produto", example = "Notebook com 16GB RAM, SSD 512GB")
    private String description;

    @Schema(description = "Preço de venda", example = "4599.90")
    private BigDecimal price;

    @Schema(description = "Preço de custo", example = "3200.00")
    private BigDecimal costPrice;

    @Schema(description = "Quantidade atual em estoque", example = "50")
    private Integer quantity;

    @Schema(description = "Quantidade mínima (alerta estoque baixo)", example = "10")
    private Integer minQuantity;

    @Schema(description = "URL da imagem do produto")
    private String imageUrl;

    @Schema(description = "Indica se o estoque está abaixo do mínimo", example = "false")
    private boolean lowStock;

    private CategoriaResponse category;
    private FornecedorResponse supplier;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}