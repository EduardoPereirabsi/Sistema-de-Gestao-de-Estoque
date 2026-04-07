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
        var usuario = usuarioRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RequisicaoInvalidaException("Email ou senha inválidos"));

        if (!passwordEncoder.matches(request.getPassword(), usuario.getSenha())) {
            throw new RequisicaoInvalidaException("Email ou senha inválidos");
        }

        if (!usuario.getAtivo()) {
            throw new RequisicaoInvalidaException("Usuário inativo. Contate o administrador.");
        }

        if (request.getCompanyId() == null) {
            List<EmpresaResponse> companies = usuarioRepository.findAllByEmail(request.getEmail())
                    .stream()
                    .map(u -> new EmpresaResponse(u.getEmpresa().getId(), u.getEmpresa().getNome()))
                    .distinct()
                    .toList();
            if (companies.size() > 1) {
                return AutenticacaoResponse.builder().companies(companies).build();
            }
        }

        return buildAuthResponse(usuario);
    }

    @Transactional
    public AutenticacaoResponse register(CadastroRequest request) {
        if (usuarioRepository.existsByEmail(request.getEmail())) {
            throw new RequisicaoInvalidaException("Email já cadastrado");
        }

        Empresa empresa = Empresa.builder()
                .nome(request.getCompanyName() != null ? request.getCompanyName() : request.getName() + " Empresa")
                .cnpj("00.000.000/0000-00")
                .ativo(true)
                .build();
        empresa = empresaRepository.save(empresa);

        Usuario usuario = Usuario.builder()
                .nome(request.getName())
                .email(request.getEmail())
                .senha(passwordEncoder.encode(request.getPassword()))
                .perfil(Perfil.ADMIN)
                .ativo(true)
                .empresa(empresa)
                .build();
        usuario = usuarioRepository.save(usuario);

        return buildAuthResponse(usuario);
    }

    @Transactional
    public void forgotPassword(String email) {
        var usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Usuário não encontrado"));

        String token = UUID.randomUUID().toString();
        usuario.setTokenRecuperacao(token);
        usuario.setTokenRecuperacaoExpiracao(LocalDateTime.now().plusHours(2));
        usuarioRepository.save(usuario);

        // Em produção: enviar por email. Por ora, exibe no console.
        System.out.println("[RECUPERAÇÃO DE SENHA] Token para " + email + ": " + token);
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

    private AutenticacaoResponse buildAuthResponse(Usuario usuario) {
        String accessToken = tokenProvider.generateAccessToken(usuario.getId());
        String refreshToken = tokenProvider.generateRefreshToken(usuario.getId());

        UsuarioResponse userResponse = UsuarioResponse.builder()
                .id(usuario.getId())
                .name(usuario.getNome())
                .email(usuario.getEmail())
                .role(usuario.getPerfil())
                .active(usuario.getAtivo())
                .companyName(usuario.getEmpresa().getNome())
                .createdAt(usuario.getCriadoEm())
                .build();

        return AutenticacaoResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .user(userResponse)
                .build();
    }
}
