package com.gestaoestoque.dto.request;

import com.gestaoestoque.enums.TipoMovimentacao;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
@Schema(description = "Dados para registro de movimentação de estoque")
public class MovimentacaoRequest {

    @NotNull(message = "ID do produto é obrigatório")
    @Schema(description = "ID do produto", example = "1")
    private Long produtoId;

    @NotNull(message = "Tipo de movimentação é obrigatório")
    @Schema(description = "Tipo: ENTRADA, SAIDA ou AJUSTE", example = "ENTRADA")
    private TipoMovimentacao tipo;

    @NotNull(message = "Quantidade é obrigatória")
    @Min(value = 1, message = "Quantidade deve ser pelo menos 1")
    @Schema(description = "Quantidade da movimentação", example = "25")
    private Integer quantidade;

    @Schema(description = "Motivo da movimentação", example = "Reposição de estoque mensal")
    private String motivo;
}