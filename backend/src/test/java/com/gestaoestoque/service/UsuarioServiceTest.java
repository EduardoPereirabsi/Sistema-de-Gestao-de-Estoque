package com.gestaoestoque.service;

import com.gestaoestoque.dto.request.UsuarioAtualizarRequest;
import com.gestaoestoque.dto.request.UsuarioCriarRequest;
import com.gestaoestoque.dto.response.UsuarioResponse;
import com.gestaoestoque.entity.Empresa;
import com.gestaoestoque.entity.Usuario;
import com.gestaoestoque.enums.Perfil;
import com.gestaoestoque.exception.RecursoDuplicadoException;
import com.gestaoestoque.exception.RecursoNaoEncontradoException;
import com.gestaoestoque.exception.RequisicaoInvalidaException;
import com.gestaoestoque.repository.UsuarioRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class UsuarioServiceTest {

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private EmpresaContexto empresaContexto;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UsuarioService usuarioService;

    private Empresa empresa;
    private Usuario adminUsuario;
    private Usuario operadorUsuario;

    @BeforeEach
    void setUp() {
        empresa = Empresa.builder()
                .id(1L)
                .nome("Empresa Teste")
                .cnpj("00.000.000/0001-00")
                .ativo(true)
                .build();

        adminUsuario = Usuario.builder()
                .id(1L)
                .empresa(empresa)
                .nome("Administrador")
                .email("admin@empresa.com")
                .senha("senha-criptografada")
                .perfil(Perfil.ADMIN)
                .ativo(true)
                .criadoEm(LocalDateTime.of(2026, 6, 2, 9, 0))
                .build();

        operadorUsuario = Usuario.builder()
                .id(2L)
                .empresa(empresa)
                .nome("Carlos Souza")
                .email("carlos@empresa.com")
                .senha("senha-criptografada")
                .perfil(Perfil.OPERADOR)
                .ativo(true)
                .criadoEm(LocalDateTime.of(2026, 6, 2, 10, 0))
                .build();
    }

    @Test
    void findAll_deveRetornarUsuariosDaEmpresaAtual() {
        when(empresaContexto.getCurrentCompanyId()).thenReturn(1L);
        when(usuarioRepository.findByEmpresaId(1L)).thenReturn(List.of(adminUsuario, operadorUsuario));

        List<UsuarioResponse> response = usuarioService.findAll();

        assertThat(response).hasSize(2);
        assertThat(response).extracting(UsuarioResponse::getNome)
                .containsExactly("Administrador", "Carlos Souza");
    }

    @Test
    void findById_deveBuscarUsuarioDentroDaEmpresa() {
        when(empresaContexto.getCurrentCompanyId()).thenReturn(1L);
        when(usuarioRepository.findByIdAndEmpresaId(2L, 1L)).thenReturn(Optional.of(operadorUsuario));

        UsuarioResponse response = usuarioService.findById(2L);

        assertThat(response.getNome()).isEqualTo("Carlos Souza");
        assertThat(response.getPerfil()).isEqualTo(Perfil.OPERADOR);
        assertThat(response.getNomeEmpresa()).isEqualTo("Empresa Teste");
    }

    @Test
    void findById_deveLancarExcecaoQuandoUsuarioNaoExisteNaEmpresa() {
        when(empresaContexto.getCurrentCompanyId()).thenReturn(1L);
        when(usuarioRepository.findByIdAndEmpresaId(99L, 1L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> usuarioService.findById(99L))
                .isInstanceOf(RecursoNaoEncontradoException.class)
                .hasMessageContaining("Usuário não encontrado");
    }

    @Test
    void create_deveCriarUsuarioComPerfilPadraoOperador() {
        UsuarioCriarRequest request = new UsuarioCriarRequest();
        request.setNome("Novo Usuário");
        request.setEmail("novo@empresa.com");
        request.setSenha("senha123");
        request.setPerfil(null);

        when(empresaContexto.getCurrentUser()).thenReturn(adminUsuario);
        when(usuarioRepository.existsByEmailAndEmpresaId("novo@empresa.com", 1L)).thenReturn(false);
        when(passwordEncoder.encode("senha123")).thenReturn("senha-codificada");
        when(usuarioRepository.save(any(Usuario.class))).thenAnswer(invocation -> {
            Usuario usuario = invocation.getArgument(0);
            usuario.setId(3L);
            return usuario;
        });

        UsuarioResponse response = usuarioService.create(request);

        assertThat(response.getNome()).isEqualTo("Novo Usuário");
        assertThat(response.getPerfil()).isEqualTo(Perfil.OPERADOR);
        verify(usuarioRepository).save(argThat(usuario ->
                "Novo Usuário".equals(usuario.getNome())
                        && "novo@empresa.com".equals(usuario.getEmail())
                        && "senha-codificada".equals(usuario.getSenha())
                        && Perfil.OPERADOR.equals(usuario.getPerfil())
                        && empresa.equals(usuario.getEmpresa())
        ));
    }

    @Test
    void create_deveLancarExcecaoQuandoEmailJaExisteNaEmpresa() {
        UsuarioCriarRequest request = new UsuarioCriarRequest();
        request.setNome("Duplicado");
        request.setEmail("carlos@empresa.com");
        request.setSenha("senha123");

        when(empresaContexto.getCurrentUser()).thenReturn(adminUsuario);
        when(usuarioRepository.existsByEmailAndEmpresaId("carlos@empresa.com", 1L)).thenReturn(true);

        assertThatThrownBy(() -> usuarioService.create(request))
                .isInstanceOf(RecursoDuplicadoException.class)
                .hasMessageContaining("Email já cadastrado");

        verify(usuarioRepository, never()).save(any(Usuario.class));
    }

    @Test
    void update_deveAtualizarDadosESenhaDoUsuario() {
        UsuarioAtualizarRequest request = new UsuarioAtualizarRequest();
        request.setNome("Carlos Atualizado");
        request.setEmail("carlos.atualizado@empresa.com");
        request.setSenha("novaSenha123");
        request.setPerfil(Perfil.GERENTE);
        request.setAtivo(false);

        when(empresaContexto.getCurrentCompanyId()).thenReturn(1L);
        when(usuarioRepository.findByIdAndEmpresaId(2L, 1L)).thenReturn(Optional.of(operadorUsuario));
        when(usuarioRepository.existsByEmailAndEmpresaId("carlos.atualizado@empresa.com", 1L)).thenReturn(false);
        when(passwordEncoder.encode("novaSenha123")).thenReturn("nova-senha-codificada");
        when(usuarioRepository.save(any(Usuario.class))).thenAnswer(invocation -> invocation.getArgument(0));

        UsuarioResponse response = usuarioService.update(2L, request);

        assertThat(response.getNome()).isEqualTo("Carlos Atualizado");
        assertThat(response.getEmail()).isEqualTo("carlos.atualizado@empresa.com");
        assertThat(response.getPerfil()).isEqualTo(Perfil.GERENTE);
        assertThat(response.getAtivo()).isFalse();
        verify(usuarioRepository).save(argThat(usuario ->
                "nova-senha-codificada".equals(usuario.getSenha())
                        && Perfil.GERENTE.equals(usuario.getPerfil())
                        && Boolean.FALSE.equals(usuario.getAtivo())
        ));
    }

    @Test
    void update_deveLancarExcecaoQuandoNovoEmailJaExisteNaEmpresa() {
        UsuarioAtualizarRequest request = new UsuarioAtualizarRequest();
        request.setEmail("admin@empresa.com");

        when(empresaContexto.getCurrentCompanyId()).thenReturn(1L);
        when(usuarioRepository.findByIdAndEmpresaId(2L, 1L)).thenReturn(Optional.of(operadorUsuario));
        when(usuarioRepository.existsByEmailAndEmpresaId("admin@empresa.com", 1L)).thenReturn(true);

        assertThatThrownBy(() -> usuarioService.update(2L, request))
                .isInstanceOf(RecursoDuplicadoException.class)
                .hasMessageContaining("Email já cadastrado");
    }

    @Test
    void alternarAtivo_deveAlternarStatusDoUsuario() {
        when(empresaContexto.getCurrentUser()).thenReturn(adminUsuario);
        when(empresaContexto.getCurrentCompanyId()).thenReturn(1L);
        when(usuarioRepository.findByIdAndEmpresaId(2L, 1L)).thenReturn(Optional.of(operadorUsuario));
        when(usuarioRepository.save(any(Usuario.class))).thenAnswer(invocation -> invocation.getArgument(0));

        UsuarioResponse response = usuarioService.alternarAtivo(2L);

        assertThat(response.getAtivo()).isFalse();
        verify(usuarioRepository).save(argThat(usuario -> Boolean.FALSE.equals(usuario.getAtivo())));
    }

    @Test
    void alternarAtivo_deveLancarExcecaoAoTentarDesativarPropriaConta() {
        when(empresaContexto.getCurrentUser()).thenReturn(adminUsuario);

        assertThatThrownBy(() -> usuarioService.alternarAtivo(1L))
                .isInstanceOf(RequisicaoInvalidaException.class)
                .hasMessageContaining("própria conta");
    }
}
