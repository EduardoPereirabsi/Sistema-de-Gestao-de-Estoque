package com.gestaoestoque.service;

import com.gestaoestoque.enums.TipoMovimentacao;
import com.gestaoestoque.repository.CategoriaRepository;
import com.gestaoestoque.repository.FornecedorRepository;
import com.gestaoestoque.repository.MovimentacaoEstoqueRepository;
import com.gestaoestoque.repository.ProdutoRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class PainelServiceTest {

    @Mock
    private ProdutoRepository produtoRepository;

    @Mock
    private CategoriaRepository categoriaRepository;

    @Mock
    private FornecedorRepository fornecedorRepository;

    @Mock
    private MovimentacaoEstoqueRepository movimentacaoRepository;

    @Mock
    private EmpresaContexto empresaContexto;

    @InjectMocks
    private PainelService painelService;

    @Test
    void getPainel_deveRetornarResumoComCamposEmPortugues() {
        when(empresaContexto.getCurrentCompanyId()).thenReturn(1L);
        when(produtoRepository.countByEmpresaId(1L)).thenReturn(25L);
        when(categoriaRepository.findByEmpresaId(1L)).thenReturn(List.of(
                com.gestaoestoque.entity.Categoria.builder().id(1L).nome("Cat").build()
        ));
        when(fornecedorRepository.findByEmpresaId(1L)).thenReturn(List.of(
                com.gestaoestoque.entity.Fornecedor.builder().id(1L).nome("Forn").build()
        ));
        when(produtoRepository.calculateTotalStockValueByEmpresaId(1L)).thenReturn(new BigDecimal("15000.00"));
        when(produtoRepository.countLowStockProductsByEmpresaId(1L)).thenReturn(3L);
        when(movimentacaoRepository.countMovementsThisMonthByEmpresaId(1L)).thenReturn(42L);

        var response = painelService.getPainel();

        assertThat(response.getTotalProdutos()).isEqualTo(25L);
        assertThat(response.getTotalCategorias()).isEqualTo(1L);
        assertThat(response.getTotalFornecedores()).isEqualTo(1L);
        assertThat(response.getValorTotalEstoque()).isEqualByComparingTo("15000.00");
        assertThat(response.getProdutosAbaixoMinimo()).isEqualTo(3L);
        assertThat(response.getMovimentacoesMes()).isEqualTo(42L);
    }

    @Test
    void getGraficoDiario_devePreencherDiasSemMovimentacao() {
        LocalDate hoje = LocalDate.now();

        when(empresaContexto.getCurrentCompanyId()).thenReturn(1L);
        when(movimentacaoRepository.countByTipoAndDataGrouped(eq(1L), any(LocalDateTime.class))).thenReturn(List.of(
                new Object[]{TipoMovimentacao.ENTRADA, hoje.minusDays(1), 4L},
                new Object[]{TipoMovimentacao.SAIDA, hoje.minusDays(1), 2L},
                new Object[]{TipoMovimentacao.AJUSTE, hoje, 1L}
        ));

        var response = painelService.getGraficoDiario(3);

        assertThat(response).hasSize(3);
        assertThat(response.get(0).getEntradas()).isZero();
        assertThat(response.get(0).getSaidas()).isZero();
        assertThat(response.get(0).getAjustes()).isZero();
        assertThat(response.get(1).getEntradas()).isEqualTo(4L);
        assertThat(response.get(1).getSaidas()).isEqualTo(2L);
        assertThat(response.get(1).getAjustes()).isZero();
        assertThat(response.get(2).getEntradas()).isZero();
        assertThat(response.get(2).getSaidas()).isZero();
        assertThat(response.get(2).getAjustes()).isEqualTo(1L);
    }
}
