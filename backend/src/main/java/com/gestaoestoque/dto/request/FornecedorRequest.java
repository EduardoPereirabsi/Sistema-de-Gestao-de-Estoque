package com.gestaoestoque.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
@Schema(description = "Dados para criação ou atualização de um fornecedor")
public class FornecedorRequest {

    @NotBlank(message = "Nome do fornecedor é obrigatório")
    @Size(max = 150, message = "Nome deve ter no máximo 150 caracteres")
    @Schema(description = "Nome do fornecedor", example = "Tech Distribuidora")
    private String nome;

    @Size(max = 18, message = "CNPJ deve ter no máximo 18 caracteres")
    @Schema(description = "CNPJ do fornecedor", example = "11.222.333/0001-44")
    private String cnpj;

    @Email(message = "Email inválido")
    @Schema(description = "Email de contato do fornecedor", example = "contato@fornecedor.com")
    private String email;

    @Size(max = 20)
    @Schema(description = "Telefone do fornecedor", example = "(11) 99999-0001")
    private String telefone;

    @Schema(description = "Endereço do fornecedor", example = "Rua das Tecnologias, 500 - Sao Paulo/SP")
    private String endereco;
}