package com.gestaoestoque.service;

import com.gestaoestoque.entity.Usuario;
import com.gestaoestoque.exception.RecursoNaoEncontradoException;
import com.gestaoestoque.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class EmpresaContexto {

    private final UsuarioRepository usuarioRepository;

    public Usuario getCurrentUser() {
        String userIdStr = SecurityContextHolder.getContext().getAuthentication().getName();
        Long userId = Long.parseLong(userIdStr);
        return usuarioRepository.findById(userId)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Usuário não encontrado"));
    }

    public Long getCurrentCompanyId() {
        return getCurrentUser().getEmpresa().getId();
    }
}