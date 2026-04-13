package com.gestaoestoque.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
@Schema(description = "Resposta de autenticação com tokens JWT")
public class AutenticacaoResponse {
    @Schema(description = "Token de acesso JWT (válido por 15 minutos)", example = "eyJhbGciOiJIUzI1NiJ9...")
    private String accessToken;

    @Schema(description = "Token de refresh JWT (válido por 7 dias)", example = "eyJhbGciOiJIUzI1NiJ9...")
    private String refreshToken;

    @Schema(description = "Dados do usuário autenticado")
    private UsuarioResponse usuario;

    @Schema(description = "Lista de empresas do usuário (retornada quando há múltiplas)")
    private List<EmpresaResponse> empresas;
}