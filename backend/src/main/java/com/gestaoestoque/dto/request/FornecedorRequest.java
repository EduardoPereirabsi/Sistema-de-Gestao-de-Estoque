package com.gestaoestoque.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class FornecedorRequest {

    @NotBlank(message = "Nome do fornecedor é obrigatório")
    @Size(max = 150, message = "Nome deve ter no máximo 150 caracteres")
    private String nome;

    @Size(max = 18, message = "CNPJ deve ter no máximo 18 caracteres")
    private String cnpj;

    @Email(message = "Email inválido")
    private String email;

    @Size(max = 20)
    private String telefone;

    private String endereco;
}