package com.gestaoestoque.service;

import com.gestaoestoque.dto.request.FornecedorRequest;
import com.gestaoestoque.dto.response.FornecedorResponse;
import com.gestaoestoque.entity.Fornecedor;
import com.gestaoestoque.exception.RecursoDuplicadoException;
import com.gestaoestoque.exception.RecursoNaoEncontradoException;
import com.gestaoestoque.repository.FornecedorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FornecedorService {

    private final FornecedorRepository fornecedorRepository;
    private final EmpresaContexto empresaContexto;

    public List<FornecedorResponse> findAll() {
        Long empresaId = empresaContexto.getCurrentCompanyId();
        return fornecedorRepository.findByEmpresaId(empresaId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public FornecedorResponse findById(Long id) {
        Fornecedor fornecedor = fornecedorRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Fornecedor não encontrado com ID: " + id));
        return mapToResponse(fornecedor);
    }

    @Transactional
    public FornecedorResponse create(FornecedorRequest request) {
        Long empresaId = empresaContexto.getCurrentCompanyId();
        if (request.getCnpj() != null && fornecedorRepository.existsByCnpjAndEmpresaId(request.getCnpj(), empresaId)) {
            throw new RecursoDuplicadoException("CNPJ já cadastrado: " + request.getCnpj());
        }

        Fornecedor fornecedor = Fornecedor.builder()
                .nome(request.getNome())
                .cnpj(request.getCnpj())
                .email(request.getEmail())
                .telefone(request.getTelefone())
                .endereco(request.getEndereco())
                .empresa(empresaContexto.getCurrentUser().getEmpresa())
                .build();

        fornecedorRepository.save(fornecedor);
        return mapToResponse(fornecedor);
    }

    @Transactional
    public FornecedorResponse update(Long id, FornecedorRequest request) {
        Fornecedor fornecedor = fornecedorRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Fornecedor não encontrado com ID: " + id));

        Long empresaId = empresaContexto.getCurrentCompanyId();
        if (request.getCnpj() != null && !request.getCnpj().equals(fornecedor.getCnpj())) {
            if (fornecedorRepository.existsByCnpjAndEmpresaId(request.getCnpj(), empresaId)) {
                throw new RecursoDuplicadoException("CNPJ já cadastrado: " + request.getCnpj());
            }
        }

        fornecedor.setNome(request.getNome());
        fornecedor.setCnpj(request.getCnpj());
        fornecedor.setEmail(request.getEmail());
        fornecedor.setTelefone(request.getTelefone());
        fornecedor.setEndereco(request.getEndereco());
        fornecedorRepository.save(fornecedor);
        return mapToResponse(fornecedor);
    }

    @Transactional
    public void delete(Long id) {
        if (!fornecedorRepository.existsById(id)) {
            throw new RecursoNaoEncontradoException("Fornecedor não encontrado com ID: " + id);
        }
        fornecedorRepository.deleteById(id);
    }

    private FornecedorResponse mapToResponse(Fornecedor fornecedor) {
        return FornecedorResponse.builder()
                .id(fornecedor.getId())
                .nome(fornecedor.getNome())
                .cnpj(fornecedor.getCnpj())
                .email(fornecedor.getEmail())
                .telefone(fornecedor.getTelefone())
                .endereco(fornecedor.getEndereco())
                .criadoEm(fornecedor.getCriadoEm())
                .build();
    }
}