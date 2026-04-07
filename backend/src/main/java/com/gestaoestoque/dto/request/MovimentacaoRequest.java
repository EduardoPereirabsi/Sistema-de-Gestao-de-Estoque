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
    private Long productId;

    @NotNull(message = "Tipo de movimentação é obrigatório")
    @Schema(description = "Tipo: ENTRY (entrada), EXIT (saída) ou ADJUSTMENT (ajuste)", example = "ENTRY")
    private TipoMovimentacao type;

    @NotNull(message = "Quantidade é obrigatória")
    @Min(value = 1, message = "Quantidade deve ser pelo menos 1")
    @Schema(description = "Quantidade da movimentação", example = "25")
    private Integer quantity;

    @Schema(description = "Motivo da movimentação", example = "Reposição de estoque mensal")
    private String reason;
}