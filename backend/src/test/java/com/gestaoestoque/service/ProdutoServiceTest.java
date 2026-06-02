package com.gestaoestoque.service;

import com.gestaoestoque.dto.request.ProdutoRequest;
import com.gestaoestoque.entity.Categoria;
import com.gestaoestoque.entity.Empresa;
import com.gestaoestoque.entity.Fornecedor;
import com.gestaoestoque.entity.Produto;
import com.gestaoestoque.entity.Usuario;
import com.gestaoestoque.enums.Perfil;
import com.gestaoestoque.repository.CategoriaRepository;
import com.gestaoestoque.repository.FornecedorRepository;
import com.gestaoestoque.repository.ProdutoRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ProdutoServiceTest {

    @Mock
    private ProdutoRepository produtoRepository;

    @Mock
    private CategoriaRepository categoriaRepository;

    @Mock
    private FornecedorRepository fornecedorRepository;

    @Mock
    private EmpresaContexto empresaContexto;

    @InjectMocks
    private ProdutoService produtoService;

    private Empresa empresa;
    private Usuario usuario;
    private Categoria categoria;
    private Fornecedor fornecedor;

    @BeforeEach
    void setUp() {
        empresa = Empresa.builder()
                .id(1L)
                .nome("Empresa Teste")
                .cnpj("00.000.000/0001-00")
                .ativo(true)
                .build();

        usuario = Usuario.builder()
                .id(1L)
                .nome("Administrador")
                .email("admin@empresa.com")
                .senha("senha")
                .perfil(Perfil.ADMIN)
                .empresa(empresa)
                .ativo(true)
                .build();

        categoria = Categoria.builder()
                .id(10L)
                .nome("Perifericos")
                .empresa(empresa)
                .build();

        fornecedor = Fornecedor.builder()
                .id(20L)
                .nome("Fornecedor Tech")
                .empresa(empresa)
                .build();
    }

    @Test
    void create_deveSalvarProduto_comCamposEmPortugues() {
        ProdutoRequest request = new ProdutoRequest();
        request.setNome("Mouse Logitech");
        request.setSku("MOUSE-001");
        request.setDescricao("Mouse sem fio");
        request.setPreco(new BigDecimal("349.90"));
        request.setPrecoCusto(new BigDecimal("180.00"));
        request.setQuantidade(30);
        request.setQuantidadeMinima(5);
        request.setCategoriaId(10L);
        request.setFornecedorId(20L);

        when(empresaContexto.getCurrentCompanyId()).thenReturn(1L);
        when(empresaContexto.getCurrentUser()).thenReturn(usuario);
        when(produtoRepository.existsBySkuAndEmpresaId("MOUSE-001", 1L)).thenReturn(false);
        when(categoriaRepository.findById(10L)).thenReturn(Optional.of(categoria));
        when(fornecedorRepository.findById(20L)).thenReturn(Optional.of(fornecedor));
        when(produtoRepository.save(any(Produto.class))).thenAnswer(invocation -> {
            Produto produto = invocation.getArgument(0);
            produto.setId(99L);
            produto.setCriadoEm(LocalDateTime.of(2026, 6, 2, 14, 0));
            produto.setAtualizadoEm(LocalDateTime.of(2026, 6, 2, 14, 0));
            return produto;
        });

        var response = produtoService.create(request);

        assertThat(response.getId()).isEqualTo(99L);
        assertThat(response.getNome()).isEqualTo("Mouse Logitech");
        assertThat(response.getPreco()).isEqualByComparingTo("349.90");
        assertThat(response.getPrecoCusto()).isEqualByComparingTo("180.00");
        assertThat(response.getQuantidadeMinima()).isEqualTo(5);
        assertThat(response.getCategoria()).isNotNull();
        assertThat(response.getCategoria().getNome()).isEqualTo("Perifericos");
        assertThat(response.getFornecedor()).isNotNull();
        assertThat(response.getFornecedor().getNome()).isEqualTo("Fornecedor Tech");

        verify(produtoRepository).save(argThat(produto ->
                "Mouse Logitech".equals(produto.getNome())
                        && "MOUSE-001".equals(produto.getSku())
                        && produto.getEmpresa().equals(empresa)
                        && produto.getCategoria().equals(categoria)
                        && produto.getFornecedor().equals(fornecedor)
        ));
    }

    @Test
    void search_deveBuscarPorNomeDentroDaEmpresa() {
        Produto produto = Produto.builder()
                .id(1L)
                .nome("Notebook Gamer")
                .sku("NOTE-001")
                .descricao("16GB RAM")
                .preco(new BigDecimal("4999.90"))
                .precoCusto(new BigDecimal("3200.00"))
                .quantidade(12)
                .quantidadeMinima(3)
                .empresa(empresa)
                .build();

        var pageable = PageRequest.of(0, 10);

        when(empresaContexto.getCurrentCompanyId()).thenReturn(1L);
        when(produtoRepository.findByNomeContainingIgnoreCaseAndEmpresaId("Notebook", 1L, pageable))
                .thenReturn(new PageImpl<>(List.of(produto), pageable, 1));

        var response = produtoService.search("Notebook", pageable);

        assertThat(response.getContent()).hasSize(1);
        assertThat(response.getContent().get(0).getNome()).isEqualTo("Notebook Gamer");
        verify(produtoRepository).findByNomeContainingIgnoreCaseAndEmpresaId("Notebook", 1L, pageable);
    }

    @Test
    void findLowStock_deveRetornarProdutosComEstoqueAbaixo() {
        Produto produto = Produto.builder()
                .id(2L)
                .nome("Teclado Mecanico")
                .sku("TEC-002")
                .preco(new BigDecimal("450.00"))
                .precoCusto(new BigDecimal("250.00"))
                .quantidade(2)
                .quantidadeMinima(5)
                .empresa(empresa)
                .build();

        when(empresaContexto.getCurrentCompanyId()).thenReturn(1L);
        when(produtoRepository.findLowStockProductsByEmpresaId(1L)).thenReturn(List.of(produto));

        var response = produtoService.findLowStock();

        assertThat(response).hasSize(1);
        assertThat(response.get(0).getNome()).isEqualTo("Teclado Mecanico");
        assertThat(response.get(0).isEstoqueAbaixo()).isTrue();
        verify(produtoRepository).findLowStockProductsByEmpresaId(1L);
    }

    @Test
    void delete_deveInativarProdutoSemExcluirHistorico() {
        Produto produto = Produto.builder()
                .id(3L)
                .nome("Mouse Logitech")
                .sku("MOUSE-001")
                .empresa(empresa)
                .ativo(true)
                .build();

        when(empresaContexto.getCurrentCompanyId()).thenReturn(1L);
        when(produtoRepository.findByIdAndEmpresaIdAndAtivoTrue(3L, 1L)).thenReturn(Optional.of(produto));

        produtoService.delete(3L);

        assertThat(produto.getAtivo()).isFalse();
        verify(produtoRepository).save(produto);
    }
}
