package com.gestaoestoque.controller;

import com.gestaoestoque.dto.request.FornecedorRequest;
import com.gestaoestoque.dto.response.ErroResponse;
import com.gestaoestoque.dto.response.FornecedorResponse;
import com.gestaoestoque.service.FornecedorService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
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
@SecurityRequirement(name = "Bearer")
@Tag(name = "Fornecedores", description = "CRUD de fornecedores")
public class FornecedorController {

    private final FornecedorService fornecedorService;

    @GetMapping
    @Operation(summary = "Listar fornecedores", description = "Retorna todos os fornecedores")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Fornecedores retornados com sucesso",
                    content = @Content(array = @ArraySchema(schema = @Schema(implementation = FornecedorResponse.class)))),
            @ApiResponse(responseCode = "401", description = "Usuário não autenticado",
                    content = @Content(schema = @Schema(implementation = ErroResponse.class))),
            @ApiResponse(responseCode = "403", description = "Acesso negado ao recurso",
                    content = @Content(schema = @Schema(implementation = ErroResponse.class)))
    })
    public ResponseEntity<List<FornecedorResponse>> findAll() {
        return ResponseEntity.ok(fornecedorService.findAll());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar fornecedor", description = "Retorna um fornecedor pelo ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Fornecedor retornado com sucesso",
                    content = @Content(schema = @Schema(implementation = FornecedorResponse.class))),
            @ApiResponse(responseCode = "401", description = "Usuário não autenticado",
                    content = @Content(schema = @Schema(implementation = ErroResponse.class))),
            @ApiResponse(responseCode = "403", description = "Acesso negado ao recurso",
                    content = @Content(schema = @Schema(implementation = ErroResponse.class))),
            @ApiResponse(responseCode = "404", description = "Fornecedor não encontrado",
                    content = @Content(schema = @Schema(implementation = ErroResponse.class)))
    })
    public ResponseEntity<FornecedorResponse> findById(@PathVariable Long id) {
        return ResponseEntity.ok(fornecedorService.findById(id));
    }

    @PostMapping
    @Operation(summary = "Criar fornecedor", description = "Cadastra um novo fornecedor")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Fornecedor criado com sucesso",
                    content = @Content(schema = @Schema(implementation = FornecedorResponse.class))),
            @ApiResponse(responseCode = "400", description = "Dados inválidos para criação do fornecedor",
                    content = @Content(schema = @Schema(implementation = ErroResponse.class))),
            @ApiResponse(responseCode = "401", description = "Usuário não autenticado",
                    content = @Content(schema = @Schema(implementation = ErroResponse.class))),
            @ApiResponse(responseCode = "403", description = "Acesso negado ao recurso",
                    content = @Content(schema = @Schema(implementation = ErroResponse.class))),
            @ApiResponse(responseCode = "409", description = "CNPJ duplicado na empresa",
                    content = @Content(schema = @Schema(implementation = ErroResponse.class)))
    })
    public ResponseEntity<FornecedorResponse> create(@Valid @RequestBody FornecedorRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(fornecedorService.create(request));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualizar fornecedor", description = "Atualiza um fornecedor existente")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Fornecedor atualizado com sucesso",
                    content = @Content(schema = @Schema(implementation = FornecedorResponse.class))),
            @ApiResponse(responseCode = "400", description = "Dados inválidos para atualização",
                    content = @Content(schema = @Schema(implementation = ErroResponse.class))),
            @ApiResponse(responseCode = "401", description = "Usuário não autenticado",
                    content = @Content(schema = @Schema(implementation = ErroResponse.class))),
            @ApiResponse(responseCode = "403", description = "Acesso negado ao recurso",
                    content = @Content(schema = @Schema(implementation = ErroResponse.class))),
            @ApiResponse(responseCode = "404", description = "Fornecedor não encontrado",
                    content = @Content(schema = @Schema(implementation = ErroResponse.class))),
            @ApiResponse(responseCode = "409", description = "CNPJ duplicado na empresa",
                    content = @Content(schema = @Schema(implementation = ErroResponse.class)))
    })
    public ResponseEntity<FornecedorResponse> update(@PathVariable Long id, @Valid @RequestBody FornecedorRequest request) {
        return ResponseEntity.ok(fornecedorService.update(id, request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Remover fornecedor", description = "Remove um fornecedor pelo ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Fornecedor removido com sucesso"),
            @ApiResponse(responseCode = "401", description = "Usuário não autenticado",
                    content = @Content(schema = @Schema(implementation = ErroResponse.class))),
            @ApiResponse(responseCode = "403", description = "Acesso negado ao recurso",
                    content = @Content(schema = @Schema(implementation = ErroResponse.class))),
            @ApiResponse(responseCode = "404", description = "Fornecedor não encontrado",
                    content = @Content(schema = @Schema(implementation = ErroResponse.class)))
    })
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        fornecedorService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
