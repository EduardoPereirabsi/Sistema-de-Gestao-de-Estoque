package com.gestaoestoque.controller;

import com.gestaoestoque.dto.request.FornecedorRequest;
import com.gestaoestoque.dto.response.FornecedorResponse;
import com.gestaoestoque.service.FornecedorService;
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
@RequestMapping("/api/suppliers")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN','GERENTE')")
@Tag(name = "Fornecedores", description = "CRUD de fornecedores")
public class FornecedorController {

    private final FornecedorService fornecedorService;

    @GetMapping
    @Operation(summary = "Listar fornecedores", description = "Retorna todos os fornecedores")
    public ResponseEntity<List<FornecedorResponse>> findAll() {
        return ResponseEntity.ok(fornecedorService.findAll());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar fornecedor", description = "Retorna um fornecedor pelo ID")
    public ResponseEntity<FornecedorResponse> findById(@PathVariable Long id) {
        return ResponseEntity.ok(fornecedorService.findById(id));
    }

    @PostMapping
    @Operation(summary = "Criar fornecedor", description = "Cadastra um novo fornecedor")
    public ResponseEntity<FornecedorResponse> create(@Valid @RequestBody FornecedorRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(fornecedorService.create(request));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualizar fornecedor", description = "Atualiza um fornecedor existente")
    public ResponseEntity<FornecedorResponse> update(@PathVariable Long id, @Valid @RequestBody FornecedorRequest request) {
        return ResponseEntity.ok(fornecedorService.update(id, request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Remover fornecedor", description = "Remove um fornecedor pelo ID")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        fornecedorService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
