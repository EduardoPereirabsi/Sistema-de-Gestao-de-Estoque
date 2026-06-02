package com.gestaoestoque.controller;


import com.gestaoestoque.dto.response.GraficoDiarioResponse;
import com.gestaoestoque.dto.response.ErroResponse;
import com.gestaoestoque.dto.response.PainelResponse;
import com.gestaoestoque.service.PainelService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;


import java.util.List;


@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@SecurityRequirement(name = "Bearer")
@Tag(name = "Dashboard", description = "Dados consolidados do painel principal")
public class PainelController {


    private final PainelService painelService;


    @GetMapping("/painel")
    @Operation(summary = "Resumo do painel", description = "Retorna os indicadores principais do dashboard")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Resumo do painel retornado com sucesso",
                    content = @Content(schema = @Schema(implementation = PainelResponse.class))),
            @ApiResponse(responseCode = "401", description = "Usuário não autenticado",
                    content = @Content(schema = @Schema(implementation = ErroResponse.class)))
    })
    public ResponseEntity<PainelResponse> getPainel() {
        return ResponseEntity.ok(painelService.getPainel());
    }


    @GetMapping("/grafico-diario")
    @Operation(summary = "Gráfico diário", description = "Retorna movimentações agrupadas por dia e tipo")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Dados do gráfico retornados com sucesso",
                    content = @Content(array = @ArraySchema(schema = @Schema(implementation = GraficoDiarioResponse.class)))),
            @ApiResponse(responseCode = "401", description = "Usuário não autenticado",
                    content = @Content(schema = @Schema(implementation = ErroResponse.class)))
    })
    public ResponseEntity<List<GraficoDiarioResponse>> getGraficoDiario(
            @Parameter(description = "Quantidade de dias retroativos para o gráfico", example = "7")
            @RequestParam(defaultValue = "7") int dias) {
        return ResponseEntity.ok(painelService.getGraficoDiario(dias));
    }
}