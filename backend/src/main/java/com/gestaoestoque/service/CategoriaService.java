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
        Long companyId = empresaContexto.getCurrentCompanyId();
        return categoriaRepository.findByCompanyId(companyId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public CategoriaResponse findById(Long id) {
        Categoria category = categoriaRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Categoria não encontrada com ID: " + id));
        return mapToResponse(category);
    }

    @Transactional
    public CategoriaResponse create(CategoriaRequest request) {
        Long companyId = empresaContexto.getCurrentCompanyId();
        if (categoriaRepository.existsByNameAndCompanyId(request.getName(), companyId)) {
            throw new RecursoDuplicadoException("Categoria já existe: " + request.getName());
        }

        Categoria category = Categoria.builder()
                .name(request.getName())
                .description(request.getDescription())
                .company(empresaContexto.getCurrentUser().getCompany())
                .build();

        categoriaRepository.save(category);
        return mapToResponse(category);
    }

    @Transactional
    public CategoriaResponse update(Long id, CategoriaRequest request) {
        Categoria category = categoriaRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Categoria não encontrada com ID: " + id));

        Long companyId = empresaContexto.getCurrentCompanyId();
        categoriaRepository.findByNameAndCompanyId(request.getName(), companyId)
                .ifPresent(existing -> {
                    if (!existing.getId().equals(id)) {
                        throw new RecursoDuplicadoException("Categoria já existe: " + request.getName());
                    }
                });

        category.setName(request.getName());
        category.setDescription(request.getDescription());
        categoriaRepository.save(category);
        return mapToResponse(category);
    }

    @Transactional
    public void delete(Long id) {
        if (!categoriaRepository.existsById(id)) {
            throw new RecursoNaoEncontradoException("Categoria não encontrada com ID: " + id);
        }
        categoriaRepository.deleteById(id);
    }

    private CategoriaResponse mapToResponse(Categoria category) {
        return CategoriaResponse.builder()
                .id(category.getId())
                .name(category.getName())
                .description(category.getDescription())
                .createdAt(category.getCreatedAt())
                .build();
    }
}