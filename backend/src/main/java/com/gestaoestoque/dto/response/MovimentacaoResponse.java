package com.gestaoestoque.dto.response;

import com.gestaoestoque.enums.TipoMovimentacao;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
@Schema(description = "Dados de uma movimentação de estoque")
public class MovimentacaoResponse {
    @Schema(description = "ID da movimentação", example = "43")
    private Long id;

    @Schema(description = "Nome do produto movimentado", example = "Notebook Dell Inspiron 15")
    private String nomeProduto;

    @Schema(description = "SKU do produto movimentado", example = "NOTE-DELL-001")
    private String skuProduto;

    @Schema(description = "Nome do usuário que registrou a movimentação", example = "Joao Silva")
    private String nomeUsuario;

    @Schema(description = "Tipo da movimentação", example = "SAIDA")
    private TipoMovimentacao tipo;

    @Schema(description = "Quantidade movimentada", example = "10")
    private Integer quantidade;

    @Schema(description = "Motivo da movimentação", example = "Venda para cliente corporativo")
    private String motivo;

    @Schema(description = "Data/hora da movimentação", example = "2026-06-02T13:30:00")
    private LocalDateTime criadoEm;
}