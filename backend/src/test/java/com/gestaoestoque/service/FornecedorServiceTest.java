package com.gestaoestoque.service;

import com.gestaoestoque.dto.request.FornecedorRequest;
import com.gestaoestoque.entity.Empresa;
import com.gestaoestoque.entity.Fornecedor;
import com.gestaoestoque.entity.Usuario;
import com.gestaoestoque.enums.Perfil;
import com.gestaoestoque.exception.RecursoDuplicadoException;
import com.gestaoestoque.repository.FornecedorRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class FornecedorServiceTest {

    @Mock
    private FornecedorRepository fornecedorRepository;

    @Mock
    private EmpresaContexto empresaContexto;

    @InjectMocks
    private FornecedorService fornecedorService;

    private Empresa empresa;
    private Usuario usuario;

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
    }

    @Test
    void create_deveSalvarFornecedor_comCampoEndereco() {
        FornecedorRequest request = new FornecedorRequest();
        request.setNome("Tech Distribuidora");
        request.setCnpj("11.222.333/0001-44");
        request.setEmail("contato@tech.com");
        request.setTelefone("(11) 99999-0001");
        request.setEndereco("Rua das Tecnologias, 500 - Sao Paulo/SP");

        when(empresaContexto.getCurrentCompanyId()).thenReturn(1L);
        when(empresaContexto.getCurrentUser()).thenReturn(usuario);
        when(fornecedorRepository.existsByCnpjAndEmpresaId("11.222.333/0001-44", 1L)).thenReturn(false);
        when(fornecedorRepository.save(any(Fornecedor.class))).thenAnswer(invocation -> {
            Fornecedor fornecedor = invocation.getArgument(0);
            fornecedor.setId(20L);
            fornecedor.setCriadoEm(LocalDateTime.of(2026, 6, 2, 13, 0));
            return fornecedor;
        });

        var response = fornecedorService.create(request);

        assertThat(response.getId()).isEqualTo(20L);
        assertThat(response.getNome()).isEqualTo("Tech Distribuidora");
        assertThat(response.getTelefone()).isEqualTo("(11) 99999-0001");
        assertThat(response.getEndereco()).isEqualTo("Rua das Tecnologias, 500 - Sao Paulo/SP");

        verify(fornecedorRepository).save(argThat(fornecedor ->
                "Tech Distribuidora".equals(fornecedor.getNome())
                        && "(11) 99999-0001".equals(fornecedor.getTelefone())
                        && "Rua das Tecnologias, 500 - Sao Paulo/SP".equals(fornecedor.getEndereco())
                        && fornecedor.getEmpresa().equals(empresa)
        ));
    }

    @Test
    void create_deveLancarExcecao_quandoCnpjDuplicadoNaEmpresa() {
        FornecedorRequest request = new FornecedorRequest();
        request.setNome("Fornecedor Duplicado");
        request.setCnpj("11.222.333/0001-44");

        when(empresaContexto.getCurrentCompanyId()).thenReturn(1L);
        when(fornecedorRepository.existsByCnpjAndEmpresaId("11.222.333/0001-44", 1L)).thenReturn(true);

        assertThatThrownBy(() -> fornecedorService.create(request))
                .isInstanceOf(RecursoDuplicadoException.class)
                .hasMessageContaining("CNPJ já cadastrado");

        verify(fornecedorRepository, never()).save(any(Fornecedor.class));
    }

    @Test
    void update_deveAtualizarEnderecoETelefone() {
        Fornecedor fornecedor = Fornecedor.builder()
                .id(30L)
                .nome("Fornecedor Antigo")
                .cnpj("55.666.777/0001-88")
                .email("antigo@fornecedor.com")
                .telefone("(11) 90000-0000")
                .endereco("Endereco antigo")
                .empresa(empresa)
                .build();

        FornecedorRequest request = new FornecedorRequest();
        request.setNome("Fornecedor Atualizado");
        request.setCnpj("55.666.777/0001-88");
        request.setEmail("novo@fornecedor.com");
        request.setTelefone("(11) 98888-7777");
        request.setEndereco("Avenida Central, 1000");

        when(fornecedorRepository.findById(30L)).thenReturn(java.util.Optional.of(fornecedor));
        when(empresaContexto.getCurrentCompanyId()).thenReturn(1L);
        when(fornecedorRepository.save(any(Fornecedor.class))).thenAnswer(invocation -> invocation.getArgument(0));

        var response = fornecedorService.update(30L, request);

        assertThat(response.getNome()).isEqualTo("Fornecedor Atualizado");
        assertThat(response.getTelefone()).isEqualTo("(11) 98888-7777");
        assertThat(response.getEndereco()).isEqualTo("Avenida Central, 1000");
    }
}
