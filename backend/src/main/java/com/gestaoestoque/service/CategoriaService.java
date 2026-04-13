package com.gestaoestoque.service;

import com.gestaoestoque.dto.request.CategoriaRequest;
import com.gestaoestoque.dto.response.CategoriaResponse;
import com.gestaoestoque.entity.Categoria;
import com.gestaoestoque.exception.RecursoDuplicadoException;
import com.gestaoestoque.exception.RecursoNaoEncontradoException;
import com.gestaoestoque.repository.CategoriaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoriaService {

    private final CategoriaRepository categoriaRepository;
    private final EmpresaContexto empresaContexto;

    public List<CategoriaResponse> findAll() {
        Long empresaId = empresaContexto.getCurrentCompanyId();
        return categoriaRepository.findByEmpresaId(empresaId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public CategoriaResponse findById(Long id) {
        Categoria categoria = categoriaRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Categoria não encontrada com ID: " + id));
        return mapToResponse(categoria);
    }

    @Transactional
    public CategoriaResponse create(CategoriaRequest request) {
        Long empresaId = empresaContexto.getCurrentCompanyId();
        if (categoriaRepository.existsByNomeAndEmpresaId(request.getNome(), empresaId)) {
            throw new RecursoDuplicadoException("Categoria já existe: " + request.getNome());
        }

        Categoria categoria = Categoria.builder()
                .nome(request.getNome())
                .descricao(request.getDescricao())
                .empresa(empresaContexto.getCurrentUser().getEmpresa())
                .build();

        categoriaRepository.save(categoria);
        return mapToResponse(categoria);
    }

    @Transactional
    public CategoriaResponse update(Long id, CategoriaRequest request) {
        Categoria categoria = categoriaRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Categoria não encontrada com ID: " + id));

        Long empresaId = empresaContexto.getCurrentCompanyId();
        categoriaRepository.findByNomeAndEmpresaId(request.getNome(), empresaId)
                .ifPresent(existing -> {
                    if (!existing.getId().equals(id)) {
                        throw new RecursoDuplicadoException("Categoria já existe: " + request.getNome());
                    }
                });

        categoria.setNome(request.getNome());
        categoria.setDescricao(request.getDescricao());
        categoriaRepository.save(categoria);
        return mapToResponse(categoria);
    }

    @Transactional
    public void delete(Long id) {
        if (!categoriaRepository.existsById(id)) {
            throw new RecursoNaoEncontradoException("Categoria não encontrada com ID: " + id);
        }
        categoriaRepository.deleteById(id);
    }

    private CategoriaResponse mapToResponse(Categoria categoria) {
        return CategoriaResponse.builder()
                .id(categoria.getId())
                .nome(categoria.getNome())
                .descricao(categoria.getDescricao())
                .criadoEm(categoria.getCriadoEm())
                .build();
    }
}