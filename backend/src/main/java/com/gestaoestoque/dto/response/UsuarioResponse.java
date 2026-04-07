package com.gestaoestoque.dto.response;

import com.gestaoestoque.enums.Perfil;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class UsuarioResponse {
    private Long id;
    private String name;
    private String email;
    private Perfil role;
    private Boolean active;
    private String companyName;
    private LocalDateTime createdAt;
}