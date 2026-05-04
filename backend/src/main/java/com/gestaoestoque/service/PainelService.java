package com.gestaoestoque.service;


import com.gestaoestoque.dto.response.GraficoDiarioResponse;
import com.gestaoestoque.dto.response.PainelResponse;
import com.gestaoestoque.enums.TipoMovimentacao;
import com.gestaoestoque.repository.CategoriaRepository;
import com.gestaoestoque.repository.FornecedorRepository;
import com.gestaoestoque.repository.MovimentacaoEstoqueRepository;
import com.gestaoestoque.repository.ProdutoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;


import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.EnumMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;


@Service
@RequiredArgsConstructor
public class PainelService {


    private final ProdutoRepository produtoRepository;
    private final CategoriaRepository categoriaRepository;
    private final FornecedorRepository fornecedorRepository;
    private final MovimentacaoEstoqueRepository movimentacaoRepository;
    private final EmpresaContexto empresaContexto;


    public PainelResponse getPainel() {
        Long empresaId = empresaContexto.getCurrentCompanyId();


        return PainelResponse.builder()
                .totalProdutos(produtoRepository.countByEmpresaId(empresaId))
                .totalCategorias((long) categoriaRepository.findByEmpresaId(empresaId).size())
                .totalFornecedores((long) fornecedorRepository.findByEmpresaId(empresaId).size())
                .valorTotalEstoque(produtoRepository.calculateTotalStockValueByEmpresaId(empresaId))
                .produtosAbaixoMinimo(produtoRepository.countLowStockProductsByEmpresaId(empresaId))
                .movimentacoesMes(movimentacaoRepository.countMovementsThisMonthByEmpresaId(empresaId))
                .build();
    }


    public List<GraficoDiarioResponse> getGraficoDiario(int dias) {
        Long empresaId = empresaContexto.getCurrentCompanyId();
        LocalDateTime startDate = LocalDate.now().minusDays(dias - 1).atStartOfDay();


        List<Object[]> results = movimentacaoRepository.countByTipoAndDataGrouped(empresaId, startDate);
        Map<LocalDate, Map<TipoMovimentacao, Long>> agrupado = new LinkedHashMap<>();


        for (Object[] row : results) {
            TipoMovimentacao tipo = (TipoMovimentacao) row[0];
            LocalDate data = (LocalDate) row[1];
            Long total = (Long) row[2];


            agrupado.computeIfAbsent(data, ignored -> new EnumMap<>(TipoMovimentacao.class))
                    .put(tipo, total);
        }


        List<GraficoDiarioResponse> grafico = new ArrayList<>();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM");


        for (int i = 0; i < dias; i++) {
            LocalDate data = LocalDate.now().minusDays(dias - 1 - i);
            Map<TipoMovimentacao, Long> dia = agrupado.getOrDefault(data, Collections.emptyMap());


            grafico.add(GraficoDiarioResponse.builder()
                    .data(data.format(formatter))
                    .entradas(dia.getOrDefault(TipoMovimentacao.ENTRADA, 0L))
                    .saidas(dia.getOrDefault(TipoMovimentacao.SAIDA, 0L))
                    .ajustes(dia.getOrDefault(TipoMovimentacao.AJUSTE, 0L))
                    .build());
        }


        return grafico;
    }
}