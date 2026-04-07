package com.gestaoestoque.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Schema(description = "Dados para cadastro ou atualização de produto")
public class ProdutoRequest {

    @NotBlank(message = "Nome do produto é obrigatório")
    @Size(max = 150, message = "Nome deve ter no máximo 150 caracteres")
    @Schema(description = "Nome do produto", example = "Notebook Dell Inspiron 15")
    private String name;

    @NotBlank(message = "SKU é obrigatório")
    @Size(max = 50, message = "SKU deve ter no máximo 50 caracteres")
    @Schema(description = "Código SKU único", example = "NOTE-DELL-001")
    private String sku;

    @Schema(description = "Descrição detalhada", example = "Notebook 16GB RAM, SSD 512GB")
    private String description;

    @NotNull(message = "Preço é obrigatório")
    @DecimalMin(value = "0.0", message = "Preço não pode ser negativo")
    @Schema(description = "Preço de venda", example = "4599.90")
    private BigDecimal price;

    @DecimalMin(value = "0.0", message = "Preço de custo não pode ser negativo")
    @Schema(description = "Preço de custo", example = "3200.00")
    private BigDecimal costPrice;

    @NotNull(message = "Quantidade é obrigatória")
    @Min(value = 0, message = "Quantidade não pode ser negativa")
    @Schema(description = "Quantidade em estoque", example = "50")
    private Integer quantity;

    @Min(value = 0, message = "Quantidade mínima não pode ser negativa")
    @Schema(description = "Estoque mínimo para alerta", example = "10")
    private Integer minQuantity;

    @Schema(description = "ID da categoria", example = "1")
    private Long categoryId;

    @Schema(description = "ID do fornecedor", example = "1")
    private Long supplierId;
}