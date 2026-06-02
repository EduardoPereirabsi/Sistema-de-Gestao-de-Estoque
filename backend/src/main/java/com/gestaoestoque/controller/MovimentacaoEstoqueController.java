package com.gestaoestoque.controller;

import com.gestaoestoque.dto.request.MovimentacaoRequest;
import com.gestaoestoque.dto.response.ErroResponse;
import com.gestaoestoque.dto.response.MovimentacaoResponse;
import com.gestaoestoque.service.MovimentacaoEstoqueService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
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

@RestController
@RequestMapping("/api/movements")
@RequiredArgsConstructor
@SecurityRequirement(name = "Bearer")
@Tag(name = "Movimentações", description = "Registro e consulta de movimentações de estoque")
public class MovimentacaoEstoqueController {

    private final MovimentacaoEstoqueService movimentacaoEstoqueService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','GERENTE','OPERADOR')")
    @Operation(summary = "Listar movimentações", description = "Retorna movimentações paginadas da empresa atual")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Movimentações retornadas com sucesso"),
            @ApiResponse(responseCode = "401", description = "Usuário não autenticado",
                    content = @Content(schema = @Schema(implementation = ErroResponse.class))),
            @ApiResponse(responseCode = "403", description = "Acesso negado ao recurso",
                    content = @Content(schema = @Schema(implementation = ErroResponse.class)))
    })
    public ResponseEntity<Page<MovimentacaoResponse>> findAll(
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(movimentacaoEstoqueService.findAll(pageable));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','GERENTE','OPERADOR')")
    @Operation(summary = "Registrar movimentação", description = "Registra entrada, saída ou ajuste de estoque")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Movimentação registrada com sucesso",
                    content = @Content(schema = @Schema(implementation = MovimentacaoResponse.class))),
            @ApiResponse(responseCode = "400", description = "Dados inválidos ou estoque insuficiente",
                    content = @Content(schema = @Schema(implementation = ErroResponse.class))),
            @ApiResponse(responseCode = "401", description = "Usuário não autenticado",
                    content = @Content(schema = @Schema(implementation = ErroResponse.class))),
            @ApiResponse(responseCode = "403", description = "Acesso negado ao recurso",
                    content = @Content(schema = @Schema(implementation = ErroResponse.class))),
            @ApiResponse(responseCode = "404", description = "Produto não encontrado",
                    content = @Content(schema = @Schema(implementation = ErroResponse.class)))
    })
    public ResponseEntity<MovimentacaoResponse> create(
            @Valid @RequestBody MovimentacaoRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(movimentacaoEstoqueService.create(request));
    }
}
