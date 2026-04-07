package com.gestaoestoque.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class FornecedorResponse {
    private Long id;
    private String name;
    private String cnpj;
    private String email;
    private String phone;
    private String address;
    private LocalDateTime createdAt;
}