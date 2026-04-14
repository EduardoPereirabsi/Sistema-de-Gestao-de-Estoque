package com.gestaoestoque.service;

import com.gestaoestoque.dto.request.UsuarioAtualizarRequest;
import com.gestaoestoque.dto.request.UsuarioCriarRequest;
import com.gestaoestoque.dto.response.UsuarioResponse;
import com.gestaoestoque.entity.Usuario;
import com.gestaoestoque.enums.Perfil;
import com.gestaoestoque.exception.RecursoDuplicadoException;
import com.gestaoestoque.exception.RecursoNaoEncontradoException;
import com.gestaoestoque.exception.RequisicaoInvalidaException;
import com.gestaoestoque.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final EmpresaContexto empresaContexto;
    private final PasswordEncoder passwordEncoder;

    public List<UsuarioResponse> findAll() {
        Long empresaId = empresaContexto.getCurrentCompanyId();
        return usuarioRepository.findByEmpresaId(empresaId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public UsuarioResponse findById(Long id) {
        return mapToResponse(buscarPorIdNaEmpresa(id));
    }

    @Transactional
    public UsuarioResponse create(UsuarioCriarRequest request) {
        if (usuarioRepository.existsByEmail(request.getEmail())) {
            throw new RecursoDuplicadoException("Email já cadastrado: " + request.getEmail());
        }

        Usuario usuario = Usuario.builder()
                .empresa(empresaContexto.getCurrentUser().getEmpresa())
                .nome(request.getNome())
                .email(request.getEmail())
                .senha(passwordEncoder.encode(request.getSenha()))
                .perfil(request.getPerfil() != null ? request.getPerfil() : Perfil.OPERADOR)
                .ativo(true)
                .build();

        usuarioRepository.save(usuario);
        return mapToResponse(usuario);
    }

    @Transactional
    public UsuarioResponse update(Long id, UsuarioAtualizarRequest request) {
        Usuario usuario = buscarPorIdNaEmpresa(id);

        if (request.getNome() != null) {
            usuario.setNome(request.getNome());
        }
        if (request.getEmail() != null && !request.getEmail().equals(usuario.getEmail())) {
            if (usuarioRepository.existsByEmail(request.getEmail())) {
                throw new RecursoDuplicadoException("Email já cadastrado: " + request.getEmail());
            }
            usuario.setEmail(request.getEmail());
        }
        if (request.getSenha() != null) {
            usuario.setSenha(passwordEncoder.encode(request.getSenha()));
        }
        if (request.getPerfil() != null) {
            usuario.setPerfil(request.getPerfil());
        }
        if (request.getAtivo() != null) {
            usuario.setAtivo(request.getAtivo());
        }

        usuarioRepository.save(usuario);
        return mapToResponse(usuario);
    }

    @Transactional
    public UsuarioResponse alternarAtivo(Long id) {
        Usuario usuarioLogado = empresaContexto.getCurrentUser();
        if (usuarioLogado.getId().equals(id)) {
            throw new RequisicaoInvalidaException("Você não pode desativar sua própria conta");
        }

        Usuario usuario = buscarPorIdNaEmpresa(id);
        usuario.setAtivo(!usuario.getAtivo());
        usuarioRepository.save(usuario);
        return mapToResponse(usuario);
    }

    private Usuario buscarPorIdNaEmpresa(Long id) {
        Long empresaId = empresaContexto.getCurrentCompanyId();
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Usuário não encontrado com ID: " + id));
        if (!usuario.getEmpresa().getId().equals(empresaId)) {
            throw new RecursoNaoEncontradoException("Usuário não encontrado com ID: " + id);
        }
        return usuario;
    }

    private UsuarioResponse mapToResponse(Usuario usuario) {
        return UsuarioResponse.builder()
                .id(usuario.getId())
                .nome(usuario.getNome())
                .email(usuario.getEmail())
                .perfil(usuario.getPerfil())
                .ativo(usuario.getAtivo())
                .nomeEmpresa(usuario.getEmpresa().getNome())
                .criadoEm(usuario.getCriadoEm())
                .build();
    }
}
