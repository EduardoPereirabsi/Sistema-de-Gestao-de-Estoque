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
    private Long id;
    private String nomeProduto;
    private String skuProduto;
    private String nomeUsuario;
    private TipoMovimentacao tipo;
    private Integer quantidade;
    private String motivo;
    private LocalDateTime criadoEm;
}