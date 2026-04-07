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
    private Long id;
    private String name;
    private String sku;
    private String description;
    private BigDecimal price;
    private BigDecimal costPrice;
    private Integer quantity;
    private Integer minQuantity;
    private String imageUrl;
    private boolean lowStock;
    private CategoriaResponse category;
    private FornecedorResponse supplier;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}