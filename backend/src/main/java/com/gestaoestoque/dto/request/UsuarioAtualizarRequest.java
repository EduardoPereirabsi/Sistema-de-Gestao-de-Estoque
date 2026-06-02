package com.gestaoestoque.dto.request;

import com.gestaoestoque.enums.Perfil;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
@Schema(description = "Dados para atualização parcial de um usuário existente")
public class UsuarioAtualizarRequest {

    @Size(min = 2, max = 100, message = "Nome deve ter entre 2 e 100 caracteres")
    @Schema(description = "Nome completo do usuário", example = "Ana Souza")
    private String nome;

    @Email(message = "Email inválido")
    @Schema(description = "Email do usuário", example = "ana@empresa.com")
    private String email;

    @Size(min = 6, max = 100, message = "Senha deve ter entre 6 e 100 caracteres")
    @Schema(description = "Nova senha do usuário", example = "novaSenha123")
    private String senha;

    @Schema(description = "Perfil de acesso do usuário", example = "GERENTE")
    private Perfil perfil;

    @Schema(description = "Indica se o usuário está ativo", example = "true")
    private Boolean ativo;
}