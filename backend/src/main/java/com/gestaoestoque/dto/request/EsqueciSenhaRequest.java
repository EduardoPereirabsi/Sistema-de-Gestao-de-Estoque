package com.gestaoestoque.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
@Schema(description = "Dados para solicitar recuperação de senha")
public class EsqueciSenhaRequest {

    @NotBlank(message = "Email é obrigatório")
    @Email(message = "Email inválido")
    @Schema(description = "Email do usuário que deseja recuperar a senha", example = "usuario@empresa.com")
    private String email;
}
