package com.gestaoestoque.controller;

import com.gestaoestoque.dto.request.UsuarioAtualizarRequest;
import com.gestaoestoque.dto.request.UsuarioCriarRequest;
import com.gestaoestoque.dto.response.UsuarioResponse;
import com.gestaoestoque.service.UsuarioService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
@RequiredArgsConstructor
@Tag(name = "Usuários", description = "Gestão de usuários — restrito a administradores")
public class UsuarioController {

    private final UsuarioService usuarioService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Listar usuários", description = "Retorna todos os usuários da empresa")
    public ResponseEntity<List<UsuarioResponse>> findAll() {
        return ResponseEntity.ok(usuarioService.findAll());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Buscar usuário", description = "Retorna um usuário pelo ID")
    public ResponseEntity<UsuarioResponse> findById(@PathVariable Long id) {
        return ResponseEntity.ok(usuarioService.findById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Criar usuário", description = "Cria um novo usuário na empresa")
    public ResponseEntity<UsuarioResponse> create(@Valid @RequestBody UsuarioCriarRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(usuarioService.create(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Atualizar usuário", description = "Atualiza dados de um usuário")
    public ResponseEntity<UsuarioResponse> update(
            @PathVariable Long id,
            @RequestBody UsuarioAtualizarRequest request) {
        return ResponseEntity.ok(usuarioService.update(id, request));
    }

    @PatchMapping("/{id}/alternar-ativo")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Ativar/Desativar usuário", description = "Alterna o status ativo/inativo do usuário")
    public ResponseEntity<UsuarioResponse> alternarAtivo(@PathVariable Long id) {
        return ResponseEntity.ok(usuarioService.alternarAtivo(id));
    }
}
