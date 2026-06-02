package com.gestaoestoque.dto.response;

import com.gestaoestoque.enums.Perfil;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
@Schema(description = "Dados públicos do usuário retornados pela API")
public class UsuarioResponse {
    @Schema(description = "ID do usuário", example = "1")
    private Long id;

    @Schema(description = "Nome completo do usuário", example = "Maria Silva")
    private String nome;

    @Schema(description = "Email do usuário", example = "maria@empresa.com")
    private String email;

    @Schema(description = "Perfil de acesso do usuário", example = "ADMIN")
    private Perfil perfil;

    @Schema(description = "Indica se o usuário está ativo", example = "true")
    private Boolean ativo;

    @Schema(description = "Nome da empresa vinculada ao usuário", example = "Empresa Exemplo")
    private String nomeEmpresa;

    @Schema(description = "Data/hora de criação do usuário", example = "2026-06-02T12:00:00")
    private LocalDateTime criadoEm;
}