package com.gestaoestoque.dto.request;

import com.gestaoestoque.enums.Perfil;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UsuarioAtualizarRequest {

    @Size(min = 2, max = 100, message = "Nome deve ter entre 2 e 100 caracteres")
    private String name;

    @Email(message = "Email inválido")
    private String email;

    @Size(min = 6, max = 100, message = "Senha deve ter entre 6 e 100 caracteres")
    private String password;

    private Perfil role;

    private Boolean active;
}