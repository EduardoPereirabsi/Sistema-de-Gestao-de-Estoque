package com.gestaoestoque.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class EmpresaResponse {
    private Long id;
    private String nome;
}