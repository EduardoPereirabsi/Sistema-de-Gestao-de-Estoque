package com.gestaoestoque.service;

import com.gestaoestoque.dto.request.CadastroRequest;
import com.gestaoestoque.dto.request.LoginRequest;
import com.gestaoestoque.dto.response.AutenticacaoResponse;
import com.gestaoestoque.dto.response.EmpresaResponse;
import com.gestaoestoque.dto.response.UsuarioResponse;
import com.gestaoestoque.entity.Empresa;
import com.gestaoestoque.entity.Usuario;
import com.gestaoestoque.enums.Perfil;
import com.gestaoestoque.exception.RecursoNaoEncontradoException;
import com.gestaoestoque.exception.RequisicaoInvalidaException;
import com.gestaoestoque.repository.EmpresaRepository;
import com.gestaoestoque.repository.UsuarioRepository;
import com.gestaoestoque.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AutenticacaoService {

    private final UsuarioRepository usuarioRepository;
    private final EmpresaRepository empresaRepository;
    private final JwtTokenProvider tokenProvider;
    private final PasswordEncoder passwordEncoder;

    public AutenticacaoResponse login(LoginRequest request) {
        List<Usuario> usuariosValidos = buscarUsuariosValidos(request.getEmail(), request.getSenha());

        if (request.getEmpresaId() != null) {
            Usuario usuario = usuariosValidos.stream()
                    .filter(u -> u.getEmpresa().getId().equals(request.getEmpresaId()))
                    .findFirst()
                    .orElseThrow(() -> new RecursoNaoEncontradoException("Usuário não encontrado nesta empresa"));

            return buildAuthResponse(usuario);
        }

        if (usuariosValidos.size() == 1) {
            return buildAuthResponse(usuariosValidos.get(0));
        }

        List<EmpresaResponse> empresas = usuariosValidos.stream()
                .map(u -> new EmpresaResponse(u.getEmpresa().getId(), u.getEmpresa().getNome()))
                .distinct()
                .toList();

        return AutenticacaoResponse.builder()
                .empresas(empresas)
                .build();
    }

    @Transactional
    public AutenticacaoResponse register(CadastroRequest request) {
        Empresa empresa = Empresa.builder()
                .nome(request.getNomeEmpresa() != null ? request.getNomeEmpresa() : request.getNome() + " Empresa")
                .cnpj("00.000.000/0000-00")
                .ativo(true)
                .build();
        empresa = empresaRepository.save(empresa);

        Usuario usuario = Usuario.builder()
                .nome(request.getNome())
                .email(request.getEmail())
                .senha(passwordEncoder.encode(request.getSenha()))
                .perfil(Perfil.ADMIN)
                .ativo(true)
                .empresa(empresa)
                .build();
        usuario = usuarioRepository.save(usuario);

        return buildAuthResponse(usuario);
    }

    @Transactional
    public void forgotPassword(String email) {
        List<Usuario> usuarios = usuarioRepository.findAllByEmail(email);
        if (usuarios.isEmpty()) {
            throw new RecursoNaoEncontradoException("Usuário não encontrado");
        }

        for (Usuario usuario : usuarios) {
            String token = UUID.randomUUID().toString();
            usuario.setTokenRecuperacao(token);
            usuario.setTokenRecuperacaoExpiracao(LocalDateTime.now().plusHours(2));
            usuarioRepository.save(usuario);

            // Em produção: enviar por email. Por ora, exibe no console.
            System.out.println("[RECUPERAÇÃO DE SENHA] Token para " + email
                    + " na empresa " + usuario.getEmpresa().getNome() + ": " + token);
        }
    }

    @Transactional
    public void resetPassword(String token, String newPassword) {
        var usuario = usuarioRepository.findByTokenRecuperacao(token)
                .orElseThrow(() -> new RequisicaoInvalidaException("Token inválido ou expirado"));

        if (usuario.getTokenRecuperacaoExpiracao().isBefore(LocalDateTime.now())) {
            throw new RequisicaoInvalidaException("Token expirado");
        }

        usuario.setSenha(passwordEncoder.encode(newPassword));
        usuario.setTokenRecuperacao(null);
        usuario.setTokenRecuperacaoExpiracao(null);
        usuarioRepository.save(usuario);
    }

    private List<Usuario> buscarUsuariosValidos(String email, String senha) {
        List<Usuario> usuariosComSenhaValida = usuarioRepository.findAllByEmail(email).stream()
                .filter(usuario -> passwordEncoder.matches(senha, usuario.getSenha()))
                .toList();

        if (usuariosComSenhaValida.isEmpty()) {
            throw new RequisicaoInvalidaException("Email ou senha inválidos");
        }

        List<Usuario> usuariosAtivos = usuariosComSenhaValida.stream()
                .filter(Usuario::getAtivo)
                .toList();

        if (usuariosAtivos.isEmpty()) {
            throw new RequisicaoInvalidaException("Usuário inativo. Contate o administrador.");
        }

        return usuariosAtivos;
    }

    private AutenticacaoResponse buildAuthResponse(Usuario usuario) {
        String accessToken = tokenProvider.generateAccessToken(usuario.getId());
        String refreshToken = tokenProvider.generateRefreshToken(usuario.getId());

        UsuarioResponse usuarioResponse = UsuarioResponse.builder()
                .id(usuario.getId())
                .nome(usuario.getNome())
                .email(usuario.getEmail())
                .perfil(usuario.getPerfil())
                .ativo(usuario.getAtivo())
                .nomeEmpresa(usuario.getEmpresa().getNome())
                .criadoEm(usuario.getCriadoEm())
                .build();

        return AutenticacaoResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .usuario(usuarioResponse)
                .build();
    }
}
