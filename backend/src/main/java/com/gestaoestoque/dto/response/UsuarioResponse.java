package com.gestaoestoque.dto.response;

import com.gestaoestoque.enums.Perfil;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class UsuarioResponse {
    private Long id;
    private String nome;
    private String email;
    private Perfil perfil;
    private Boolean ativo;
    private String nomeEmpresa;
    private LocalDateTime criadoEm;
}