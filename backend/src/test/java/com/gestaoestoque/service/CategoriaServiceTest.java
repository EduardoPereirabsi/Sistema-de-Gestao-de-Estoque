package com.gestaoestoque.service;

import com.gestaoestoque.dto.request.CategoriaRequest;
import com.gestaoestoque.entity.Categoria;
import com.gestaoestoque.entity.Empresa;
import com.gestaoestoque.entity.Usuario;
import com.gestaoestoque.enums.Perfil;
import com.gestaoestoque.exception.RecursoDuplicadoException;
import com.gestaoestoque.repository.CategoriaRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CategoriaServiceTest {

    @Mock
    private CategoriaRepository categoriaRepository;

    @Mock
    private EmpresaContexto empresaContexto;

    @InjectMocks
    private CategoriaService categoriaService;

    private Empresa empresa;
    private Usuario usuario;
    private Categoria categoriaExistente;

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

        categoriaExistente = Categoria.builder()
                .id(5L)
                .nome("Eletronicos")
                .descricao("Produtos eletronicos")
                .empresa(empresa)
                .criadoEm(LocalDateTime.of(2026, 6, 2, 12, 0))
                .build();
    }

    @Test
    void create_deveSalvarCategoria_comCamposEmPortugues() {
        CategoriaRequest request = new CategoriaRequest();
        request.setNome("Eletronicos");
        request.setDescricao("Produtos eletronicos em geral");

        when(empresaContexto.getCurrentCompanyId()).thenReturn(1L);
        when(empresaContexto.getCurrentUser()).thenReturn(usuario);
        when(categoriaRepository.existsByNomeAndEmpresaId("Eletronicos", 1L)).thenReturn(false);
        when(categoriaRepository.save(any(Categoria.class))).thenAnswer(invocation -> {
            Categoria categoria = invocation.getArgument(0);
            categoria.setId(10L);
            categoria.setCriadoEm(LocalDateTime.of(2026, 6, 2, 12, 30));
            return categoria;
        });

        var response = categoriaService.create(request);

        assertThat(response.getId()).isEqualTo(10L);
        assertThat(response.getNome()).isEqualTo("Eletronicos");
        assertThat(response.getDescricao()).isEqualTo("Produtos eletronicos em geral");
        assertThat(response.getCriadoEm()).isEqualTo(LocalDateTime.of(2026, 6, 2, 12, 30));

        verify(categoriaRepository).save(argThat(categoria ->
                "Eletronicos".equals(categoria.getNome())
                        && "Produtos eletronicos em geral".equals(categoria.getDescricao())
                        && categoria.getEmpresa().equals(empresa)
        ));
    }

    @Test
    void create_deveLancarExcecao_quandoNomeDuplicadoPorEmpresa() {
        CategoriaRequest request = new CategoriaRequest();
        request.setNome("Eletronicos");

        when(empresaContexto.getCurrentCompanyId()).thenReturn(1L);
        when(categoriaRepository.existsByNomeAndEmpresaId("Eletronicos", 1L)).thenReturn(true);

        assertThatThrownBy(() -> categoriaService.create(request))
                .isInstanceOf(RecursoDuplicadoException.class)
                .hasMessageContaining("Categoria já existe");

        verify(categoriaRepository, never()).save(any(Categoria.class));
    }

    @Test
    void update_deveLancarExcecao_quandoNomeDuplicadoEmOutraCategoria() {
        CategoriaRequest request = new CategoriaRequest();
        request.setNome("Informatica");
        request.setDescricao("Descricao atualizada");

        Categoria outraCategoria = Categoria.builder()
                .id(8L)
                .nome("Informatica")
                .empresa(empresa)
                .build();

        when(categoriaRepository.findById(5L)).thenReturn(Optional.of(categoriaExistente));
        when(empresaContexto.getCurrentCompanyId()).thenReturn(1L);
        when(categoriaRepository.findByNomeAndEmpresaId("Informatica", 1L)).thenReturn(Optional.of(outraCategoria));

        assertThatThrownBy(() -> categoriaService.update(5L, request))
                .isInstanceOf(RecursoDuplicadoException.class)
                .hasMessageContaining("Categoria já existe");
    }
}
