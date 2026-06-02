package com.gestaoestoque.service;

import com.gestaoestoque.dto.request.CadastroRequest;
import com.gestaoestoque.dto.request.LoginRequest;
import com.gestaoestoque.entity.Empresa;
import com.gestaoestoque.entity.Usuario;
import com.gestaoestoque.enums.Perfil;
import com.gestaoestoque.exception.RecursoNaoEncontradoException;
import com.gestaoestoque.exception.RequisicaoInvalidaException;
import com.gestaoestoque.repository.EmpresaRepository;
import com.gestaoestoque.repository.UsuarioRepository;
import com.gestaoestoque.security.JwtTokenProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AutenticacaoServiceTest {

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private EmpresaRepository empresaRepository;

    @Mock
    private JwtTokenProvider tokenProvider;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private AutenticacaoService autenticacaoService;

    private Empresa empresaMatriz;
    private Empresa empresaFilial;
    private Usuario usuarioMatriz;
    private Usuario usuarioFilial;

    @BeforeEach
    void setUp() {
        empresaMatriz = criarEmpresa(1L, "Empresa Matriz");
        empresaFilial = criarEmpresa(2L, "Empresa Filial");

        usuarioMatriz = criarUsuario(10L, "Maria Silva", "maria@empresa.com", "hash-matriz", true, empresaMatriz);
        usuarioFilial = criarUsuario(20L, "Maria Silva", "maria@empresa.com", "hash-filial", true, empresaFilial);
    }

    @Test
    void login_deveRetornarTokens_quandoExisteUsuarioValidoUnico() {
        LoginRequest request = criarLoginRequest("maria@empresa.com", "senha123", null);

        when(usuarioRepository.findAllByEmail("maria@empresa.com")).thenReturn(List.of(usuarioMatriz));
        when(passwordEncoder.matches("senha123", "hash-matriz")).thenReturn(true);
        when(tokenProvider.generateAccessToken(10L)).thenReturn("access-token");
        when(tokenProvider.generateRefreshToken(10L)).thenReturn("refresh-token");

        var response = autenticacaoService.login(request);

        assertThat(response.getAccessToken()).isEqualTo("access-token");
        assertThat(response.getRefreshToken()).isEqualTo("refresh-token");
        assertThat(response.getUsuario()).isNotNull();
        assertThat(response.getUsuario().getNome()).isEqualTo("Maria Silva");
        assertThat(response.getUsuario().getNomeEmpresa()).isEqualTo("Empresa Matriz");
        assertThat(response.getEmpresas()).isNull();
    }

    @Test
    void login_deveRetornarEmpresas_quandoEmailExisteEmMaisDeUmaEmpresa() {
        LoginRequest request = criarLoginRequest("maria@empresa.com", "senha123", null);

        when(usuarioRepository.findAllByEmail("maria@empresa.com")).thenReturn(List.of(usuarioMatriz, usuarioFilial));
        when(passwordEncoder.matches("senha123", "hash-matriz")).thenReturn(true);
        when(passwordEncoder.matches("senha123", "hash-filial")).thenReturn(true);

        var response = autenticacaoService.login(request);

        assertThat(response.getAccessToken()).isNull();
        assertThat(response.getRefreshToken()).isNull();
        assertThat(response.getUsuario()).isNull();
        assertThat(response.getEmpresas())
                .extracting(empresa -> empresa.getNome())
                .containsExactly("Empresa Matriz", "Empresa Filial");
    }

    @Test
    void login_deveAutenticarEmpresaEspecifica_quandoEmpresaIdForInformado() {
        LoginRequest request = criarLoginRequest("maria@empresa.com", "senha123", 2L);

        when(usuarioRepository.findAllByEmail("maria@empresa.com")).thenReturn(List.of(usuarioMatriz, usuarioFilial));
        when(passwordEncoder.matches("senha123", "hash-matriz")).thenReturn(true);
        when(passwordEncoder.matches("senha123", "hash-filial")).thenReturn(true);
        when(tokenProvider.generateAccessToken(20L)).thenReturn("access-token-filial");
        when(tokenProvider.generateRefreshToken(20L)).thenReturn("refresh-token-filial");

        var response = autenticacaoService.login(request);

        assertThat(response.getAccessToken()).isEqualTo("access-token-filial");
        assertThat(response.getRefreshToken()).isEqualTo("refresh-token-filial");
        assertThat(response.getUsuario()).isNotNull();
        assertThat(response.getUsuario().getNomeEmpresa()).isEqualTo("Empresa Filial");
    }

    @Test
    void login_deveLancarErro_quandoEmpresaIdNaoExisteEntreUsuariosValidos() {
        LoginRequest request = criarLoginRequest("maria@empresa.com", "senha123", 999L);

        when(usuarioRepository.findAllByEmail("maria@empresa.com")).thenReturn(List.of(usuarioMatriz, usuarioFilial));
        when(passwordEncoder.matches("senha123", "hash-matriz")).thenReturn(true);
        when(passwordEncoder.matches("senha123", "hash-filial")).thenReturn(true);

        assertThatThrownBy(() -> autenticacaoService.login(request))
                .isInstanceOf(RecursoNaoEncontradoException.class)
                .hasMessageContaining("Usuário não encontrado nesta empresa");
    }

    @Test
    void login_deveLancarErro_quandoSenhaForInvalida() {
        LoginRequest request = criarLoginRequest("maria@empresa.com", "senha-invalida", null);

        when(usuarioRepository.findAllByEmail("maria@empresa.com")).thenReturn(List.of(usuarioMatriz));
        when(passwordEncoder.matches("senha-invalida", "hash-matriz")).thenReturn(false);

        assertThatThrownBy(() -> autenticacaoService.login(request))
                .isInstanceOf(RequisicaoInvalidaException.class)
                .hasMessageContaining("Email ou senha inválidos");
    }

    @Test
    void login_deveLancarErro_quandoTodosUsuariosEstaoInativos() {
        LoginRequest request = criarLoginRequest("maria@empresa.com", "senha123", null);
        usuarioMatriz.setAtivo(false);
        usuarioFilial.setAtivo(false);

        when(usuarioRepository.findAllByEmail("maria@empresa.com")).thenReturn(List.of(usuarioMatriz, usuarioFilial));
        when(passwordEncoder.matches("senha123", "hash-matriz")).thenReturn(true);
        when(passwordEncoder.matches("senha123", "hash-filial")).thenReturn(true);

        assertThatThrownBy(() -> autenticacaoService.login(request))
                .isInstanceOf(RequisicaoInvalidaException.class)
                .hasMessageContaining("Usuário inativo");
    }

    @Test
    void register_deveCriarUsuarioEEmpresa_comCamposEmPortugues() {
        CadastroRequest request = new CadastroRequest();
        request.setNome("João Souza");
        request.setEmail("joao@empresa.com");
        request.setSenha("senha123");
        request.setNomeEmpresa("Empresa João");

        when(passwordEncoder.encode("senha123")).thenReturn("senha-hash");
        when(empresaRepository.save(any(Empresa.class))).thenAnswer(invocation -> {
            Empresa empresa = invocation.getArgument(0);
            empresa.setId(30L);
            return empresa;
        });
        when(usuarioRepository.save(any(Usuario.class))).thenAnswer(invocation -> {
            Usuario usuario = invocation.getArgument(0);
            usuario.setId(40L);
            usuario.setCriadoEm(LocalDateTime.of(2026, 6, 2, 12, 0));
            return usuario;
        });
        when(tokenProvider.generateAccessToken(40L)).thenReturn("access-token-cadastro");
        when(tokenProvider.generateRefreshToken(40L)).thenReturn("refresh-token-cadastro");

        var response = autenticacaoService.register(request);

        assertThat(response.getAccessToken()).isEqualTo("access-token-cadastro");
        assertThat(response.getRefreshToken()).isEqualTo("refresh-token-cadastro");
        assertThat(response.getUsuario()).isNotNull();
        assertThat(response.getUsuario().getNome()).isEqualTo("João Souza");
        assertThat(response.getUsuario().getNomeEmpresa()).isEqualTo("Empresa João");

        verify(empresaRepository).save(any(Empresa.class));
        verify(usuarioRepository).save(any(Usuario.class));
    }

    @Test
    void register_deveUsarNomePadraoEmpresa_quandoNomeEmpresaNaoInformado() {
        CadastroRequest request = new CadastroRequest();
        request.setNome("Carlos");
        request.setEmail("carlos@empresa.com");
        request.setSenha("senha123");

        when(passwordEncoder.encode(anyString())).thenReturn("senha-hash");
        when(empresaRepository.save(any(Empresa.class))).thenAnswer(invocation -> {
            Empresa empresa = invocation.getArgument(0);
            empresa.setId(50L);
            return empresa;
        });
        when(usuarioRepository.save(any(Usuario.class))).thenAnswer(invocation -> {
            Usuario usuario = invocation.getArgument(0);
            usuario.setId(60L);
            usuario.setCriadoEm(LocalDateTime.of(2026, 6, 2, 12, 30));
            return usuario;
        });
        when(tokenProvider.generateAccessToken(60L)).thenReturn("access-token");
        when(tokenProvider.generateRefreshToken(60L)).thenReturn("refresh-token");

        autenticacaoService.register(request);

        verify(empresaRepository).save(any(Empresa.class));
        verify(usuarioRepository).save(any(Usuario.class));
        verify(empresaRepository).save(argThat(empresa -> "Carlos Empresa".equals(empresa.getNome())));
    }

    @Test
    void forgotPassword_deveGerarTokenParaTodosUsuariosDoMesmoEmail() {
        when(usuarioRepository.findAllByEmail("maria@empresa.com")).thenReturn(List.of(usuarioMatriz, usuarioFilial));
        when(usuarioRepository.save(any(Usuario.class))).thenAnswer(invocation -> invocation.getArgument(0));

        autenticacaoService.forgotPassword("maria@empresa.com");

        ArgumentCaptor<Usuario> captor = ArgumentCaptor.forClass(Usuario.class);
        verify(usuarioRepository, times(2)).save(captor.capture());
        assertThat(captor.getAllValues())
                .extracting(Usuario::getTokenRecuperacao)
                .doesNotContainNull()
                .doesNotHaveDuplicates();
        assertThat(captor.getAllValues())
                .allSatisfy(usuario -> assertThat(usuario.getTokenRecuperacaoExpiracao()).isAfter(LocalDateTime.now()));
    }

    @Test
    void forgotPassword_deveLancarErro_quandoEmailNaoForEncontrado() {
        when(usuarioRepository.findAllByEmail("inexistente@empresa.com")).thenReturn(List.of());

        assertThatThrownBy(() -> autenticacaoService.forgotPassword("inexistente@empresa.com"))
                .isInstanceOf(RecursoNaoEncontradoException.class)
                .hasMessageContaining("Usuário não encontrado");
    }

    @Test
    void resetPassword_deveAtualizarSenhaELimparToken() {
        usuarioMatriz.setTokenRecuperacao("token-valido");
        usuarioMatriz.setTokenRecuperacaoExpiracao(LocalDateTime.now().plusHours(2));

        when(usuarioRepository.findByTokenRecuperacao("token-valido")).thenReturn(Optional.of(usuarioMatriz));
        when(passwordEncoder.encode("novaSenha123")).thenReturn("nova-senha-hash");

        autenticacaoService.resetPassword("token-valido", "novaSenha123");

        verify(usuarioRepository).save(argThat(usuario ->
                "nova-senha-hash".equals(usuario.getSenha())
                        && usuario.getTokenRecuperacao() == null
                        && usuario.getTokenRecuperacaoExpiracao() == null
        ));
    }

    @Test
    void resetPassword_deveLancarErro_quandoTokenEstiverExpirado() {
        usuarioMatriz.setTokenRecuperacao("token-expirado");
        usuarioMatriz.setTokenRecuperacaoExpiracao(LocalDateTime.now().minusMinutes(1));

        when(usuarioRepository.findByTokenRecuperacao("token-expirado")).thenReturn(Optional.of(usuarioMatriz));

        assertThatThrownBy(() -> autenticacaoService.resetPassword("token-expirado", "novaSenha123"))
                .isInstanceOf(RequisicaoInvalidaException.class)
                .hasMessageContaining("Token expirado");
    }

    private LoginRequest criarLoginRequest(String email, String senha, Long empresaId) {
        LoginRequest request = new LoginRequest();
        request.setEmail(email);
        request.setSenha(senha);
        request.setEmpresaId(empresaId);
        return request;
    }

    private Empresa criarEmpresa(Long id, String nome) {
        return Empresa.builder()
                .id(id)
                .nome(nome)
                .cnpj("00.000.000/0001-00")
                .ativo(true)
                .build();
    }

    private Usuario criarUsuario(Long id, String nome, String email, String senha, boolean ativo, Empresa empresa) {
        return Usuario.builder()
                .id(id)
                .nome(nome)
                .email(email)
                .senha(senha)
                .perfil(Perfil.ADMIN)
                .ativo(ativo)
                .empresa(empresa)
                .criadoEm(LocalDateTime.of(2026, 6, 1, 10, 0))
                .build();
    }
}
