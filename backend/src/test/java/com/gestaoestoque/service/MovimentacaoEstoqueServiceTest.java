package com.gestaoestoque.service;

import com.gestaoestoque.dto.request.MovimentacaoRequest;
import com.gestaoestoque.dto.response.MovimentacaoResponse;
import com.gestaoestoque.entity.Empresa;
import com.gestaoestoque.entity.MovimentacaoEstoque;
import com.gestaoestoque.entity.Produto;
import com.gestaoestoque.entity.Usuario;
import com.gestaoestoque.enums.Perfil;
import com.gestaoestoque.enums.TipoMovimentacao;
import com.gestaoestoque.exception.EstoqueInsuficienteException;
import com.gestaoestoque.exception.RecursoNaoEncontradoException;
import com.gestaoestoque.repository.MovimentacaoEstoqueRepository;
import com.gestaoestoque.repository.ProdutoRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class MovimentacaoEstoqueServiceTest {

    @Mock
    private MovimentacaoEstoqueRepository movimentacaoRepository;

    @Mock
    private ProdutoRepository produtoRepository;

    @Mock
    private EmpresaContexto empresaContexto;

    @Mock
    private SimpMessagingTemplate messagingTemplate;

    @InjectMocks
    private MovimentacaoEstoqueService movimentacaoEstoqueService;

    private Empresa empresa;
    private Usuario usuario;
    private Produto produto;

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
                .empresa(empresa)
                .nome("Administrador")
                .email("admin@empresa.com")
                .senha("senha")
                .perfil(Perfil.ADMIN)
                .ativo(true)
                .build();

        produto = Produto.builder()
                .id(1L)
                .nome("Mouse Gamer")
                .sku("MOU-001")
                .preco(new BigDecimal("199.90"))
                .precoCusto(new BigDecimal("120.00"))
                .quantidade(100)
                .quantidadeMinima(10)
                .empresa(empresa)
                .build();
    }

    @Test
    void create_deveRegistrarEntradaEAtualizarEstoque() {
        MovimentacaoRequest request = new MovimentacaoRequest();
        request.setProdutoId(1L);
        request.setTipo(TipoMovimentacao.ENTRADA);
        request.setQuantidade(20);
        request.setMotivo("Reposição");

        when(empresaContexto.getCurrentCompanyId()).thenReturn(1L);
        when(empresaContexto.getCurrentUser()).thenReturn(usuario);
        when(produtoRepository.findById(1L)).thenReturn(Optional.of(produto));
        when(movimentacaoRepository.save(any(MovimentacaoEstoque.class))).thenAnswer(invocation -> {
            MovimentacaoEstoque movimentacao = invocation.getArgument(0);
            movimentacao.setId(10L);
            movimentacao.setCriadoEm(LocalDateTime.of(2026, 6, 2, 12, 0));
            return movimentacao;
        });

        MovimentacaoResponse response = movimentacaoEstoqueService.create(request);

        assertThat(response.getTipo()).isEqualTo(TipoMovimentacao.ENTRADA);
        assertThat(response.getQuantidade()).isEqualTo(20);
        assertThat(produto.getQuantidade()).isEqualTo(120);
        verify(produtoRepository).save(produto);
        verify(messagingTemplate, never()).convertAndSend(anyString(), anyString());
    }

    @Test
    void create_deveLancarExcecaoQuandoProdutoNaoPertenceEmpresaAtual() {
        Empresa outraEmpresa = Empresa.builder()
                .id(2L)
                .nome("Outra Empresa")
                .cnpj("11.111.111/0001-11")
                .ativo(true)
                .build();

        Produto produtoOutraEmpresa = Produto.builder()
                .id(1L)
                .nome("Produto Externo")
                .sku("EXT-001")
                .quantidade(10)
                .quantidadeMinima(2)
                .empresa(outraEmpresa)
                .preco(BigDecimal.TEN)
                .precoCusto(BigDecimal.ONE)
                .build();

        MovimentacaoRequest request = new MovimentacaoRequest();
        request.setProdutoId(1L);
        request.setTipo(TipoMovimentacao.ENTRADA);
        request.setQuantidade(5);

        when(empresaContexto.getCurrentCompanyId()).thenReturn(1L);
        when(produtoRepository.findById(1L)).thenReturn(Optional.of(produtoOutraEmpresa));

        assertThatThrownBy(() -> movimentacaoEstoqueService.create(request))
                .isInstanceOf(RecursoNaoEncontradoException.class)
                .hasMessageContaining("Produto não encontrado");
    }

    @Test
    void create_deveLancarExcecaoQuandoEstoqueInsuficienteNaSaida() {
        produto.setQuantidade(5);

        MovimentacaoRequest request = new MovimentacaoRequest();
        request.setProdutoId(1L);
        request.setTipo(TipoMovimentacao.SAIDA);
        request.setQuantidade(10);

        when(empresaContexto.getCurrentCompanyId()).thenReturn(1L);
        when(produtoRepository.findById(1L)).thenReturn(Optional.of(produto));

        assertThatThrownBy(() -> movimentacaoEstoqueService.create(request))
                .isInstanceOf(EstoqueInsuficienteException.class)
                .hasMessageContaining("Estoque insuficiente");

        verify(produtoRepository, never()).save(any(Produto.class));
    }

    @Test
    void create_deveEnviarAlertaQuandoEstoqueFicarBaixo() {
        produto.setQuantidade(15);
        produto.setQuantidadeMinima(10);

        MovimentacaoRequest request = new MovimentacaoRequest();
        request.setProdutoId(1L);
        request.setTipo(TipoMovimentacao.SAIDA);
        request.setQuantidade(10);
        request.setMotivo("Venda");

        when(empresaContexto.getCurrentCompanyId()).thenReturn(1L);
        when(empresaContexto.getCurrentUser()).thenReturn(usuario);
        when(produtoRepository.findById(1L)).thenReturn(Optional.of(produto));
        when(movimentacaoRepository.save(any(MovimentacaoEstoque.class))).thenAnswer(invocation -> {
            MovimentacaoEstoque movimentacao = invocation.getArgument(0);
            movimentacao.setId(20L);
            movimentacao.setCriadoEm(LocalDateTime.of(2026, 6, 2, 13, 0));
            return movimentacao;
        });

        movimentacaoEstoqueService.create(request);

        assertThat(produto.getQuantidade()).isEqualTo(5);
        verify(messagingTemplate).convertAndSend(eq("/topic/low-stock"), anyString());
    }

    @Test
    void findAll_deveRetornarPaginaComMovimentacoesDaEmpresaAtual() {
        Pageable pageable = PageRequest.of(0, 10);
        MovimentacaoEstoque movimentacao = MovimentacaoEstoque.builder()
                .id(1L)
                .empresa(empresa)
                .produto(produto)
                .usuario(usuario)
                .tipo(TipoMovimentacao.ENTRADA)
                .quantidade(20)
                .motivo("Reposição")
                .criadoEm(LocalDateTime.of(2026, 6, 2, 12, 0))
                .build();

        when(empresaContexto.getCurrentCompanyId()).thenReturn(1L);
        when(movimentacaoRepository.findByEmpresaId(1L, pageable))
                .thenReturn(new PageImpl<>(List.of(movimentacao), pageable, 1));

        Page<MovimentacaoResponse> response = movimentacaoEstoqueService.findAll(pageable);

        assertThat(response.getContent()).hasSize(1);
        assertThat(response.getContent().get(0).getNomeProduto()).isEqualTo("Mouse Gamer");
        assertThat(response.getContent().get(0).getNomeUsuario()).isEqualTo("Administrador");
    }
}
