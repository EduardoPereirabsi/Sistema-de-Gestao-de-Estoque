package com.gestaoestoque.controller;


import com.gestaoestoque.dto.response.GraficoDiarioResponse;
import com.gestaoestoque.dto.response.PainelResponse;
import com.gestaoestoque.service.PainelService;
import io.swagger.v3.oas.annotations.Operation;
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
@Tag(name = "Dashboard", description = "Dados consolidados do painel principal")
public class PainelController {


    private final PainelService painelService;


    @GetMapping("/painel")
    @Operation(summary = "Resumo do painel", description = "Retorna os indicadores principais do dashboard")
    public ResponseEntity<PainelResponse> getPainel() {
        return ResponseEntity.ok(painelService.getPainel());
    }


    @GetMapping("/grafico-diario")
    @Operation(summary = "Gráfico diário", description = "Retorna movimentações agrupadas por dia e tipo")
    public ResponseEntity<List<GraficoDiarioResponse>> getGraficoDiario(
            @RequestParam(defaultValue = "7") int dias) {
        return ResponseEntity.ok(painelService.getGraficoDiario(dias));
    }
}