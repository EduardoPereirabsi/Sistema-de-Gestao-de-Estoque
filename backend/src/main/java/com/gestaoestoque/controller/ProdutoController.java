package com.gestaoestoque.controller;

import com.gestaoestoque.dto.request.ProdutoRequest;
import com.gestaoestoque.dto.response.ProdutoResponse;
import com.gestaoestoque.service.ProdutoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
@Tag(name = "Produtos", description = "CRUD de produtos")
public class ProdutoController {

    private final ProdutoService produtoService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','GERENTE','OPERADOR')")
    @Operation(summary = "Listar produtos", description = "Retorna produtos paginados")
    public ResponseEntity<Page<ProdutoResponse>> findAll(@PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(produtoService.findAll(pageable));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','GERENTE','OPERADOR')")
    @Operation(summary = "Buscar produto", description = "Retorna um produto pelo ID")
    public ResponseEntity<ProdutoResponse> findById(@PathVariable Long id) {
        return ResponseEntity.ok(produtoService.findById(id));
    }

    @GetMapping("/search")
    @PreAuthorize("hasAnyRole('ADMIN','GERENTE','OPERADOR')")
    @Operation(summary = "Buscar por nome", description = "Busca produtos pelo nome")
    public ResponseEntity<Page<ProdutoResponse>> search(
            @RequestParam String nome,
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(produtoService.search(nome, pageable));
    }

    @GetMapping("/low-stock")
    @PreAuthorize("hasAnyRole('ADMIN','GERENTE','OPERADOR')")
    @Operation(summary = "Estoque baixo", description = "Retorna produtos com estoque abaixo do mínimo")
    public ResponseEntity<List<ProdutoResponse>> findLowStock() {
        return ResponseEntity.ok(produtoService.findLowStock());
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','GERENTE')")
    @Operation(summary = "Criar produto", description = "Cadastra um novo produto")
    public ResponseEntity<ProdutoResponse> create(@Valid @RequestBody ProdutoRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(produtoService.create(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','GERENTE')")
    @Operation(summary = "Atualizar produto", description = "Atualiza um produto existente")
    public ResponseEntity<ProdutoResponse> update(@PathVariable Long id, @Valid @RequestBody ProdutoRequest request) {
        return ResponseEntity.ok(produtoService.update(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','GERENTE')")
    @Operation(summary = "Remover produto", description = "Remove um produto pelo ID")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        produtoService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
