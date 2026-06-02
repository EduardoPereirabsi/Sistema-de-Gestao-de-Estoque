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
    private String nome;

    @Schema(description = "Código SKU único", example = "NOTE-DELL-001")
    private String sku;

    @Schema(description = "Descrição do produto", example = "Notebook com 16GB RAM, SSD 512GB")
    private String descricao;

    @Schema(description = "Preço de venda", example = "4599.90")
    private BigDecimal preco;

    @Schema(description = "Preço de custo", example = "3200.00")
    private BigDecimal precoCusto;

    @Schema(description = "Quantidade atual em estoque", example = "50")
    private Integer quantidade;

    @Schema(description = "Quantidade mínima (alerta estoque baixo)", example = "10")
    private Integer quantidadeMinima;

    @Schema(description = "URL da imagem do produto")
    private String urlImagem;

    @Schema(description = "Indica se o estoque está abaixo do mínimo", example = "false")
    private boolean estoqueAbaixo;

    @Schema(description = "Categoria vinculada ao produto")
    private CategoriaResponse categoria;

    @Schema(description = "Fornecedor vinculado ao produto")
    private FornecedorResponse fornecedor;

    @Schema(description = "Data/hora de criação do produto", example = "2026-06-02T13:40:00")
    private LocalDateTime criadoEm;

    @Schema(description = "Data/hora da última atualização do produto", example = "2026-06-02T13:45:00")
    private LocalDateTime atualizadoEm;
}