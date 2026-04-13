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
        Long companyId = empresaContexto.getCurrentCompanyId();
        return fornecedorRepository.findByCompanyId(companyId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public FornecedorResponse findById(Long id) {
        Fornecedor supplier = fornecedorRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Fornecedor não encontrado com ID: " + id));
        return mapToResponse(supplier);
    }

    @Transactional
    public FornecedorResponse create(FornecedorRequest request) {
        Long companyId = empresaContexto.getCurrentCompanyId();
        if (request.getCnpj() != null && fornecedorRepository.existsByCnpjAndCompanyId(request.getCnpj(), companyId)) {
            throw new RecursoDuplicadoException("CNPJ já cadastrado: " + request.getCnpj());
        }

        Fornecedor supplier = Fornecedor.builder()
                .name(request.getName())
                .cnpj(request.getCnpj())
                .email(request.getEmail())
                .phone(request.getPhone())
                .address(request.getAddress())
                .company(empresaContexto.getCurrentUser().getCompany())
                .build();

        fornecedorRepository.save(supplier);
        return mapToResponse(supplier);
    }

    @Transactional
    public FornecedorResponse update(Long id, FornecedorRequest request) {
        Fornecedor supplier = fornecedorRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Fornecedor não encontrado com ID: " + id));

        Long companyId = empresaContexto.getCurrentCompanyId();
        if (request.getCnpj() != null && !request.getCnpj().equals(supplier.getCnpj())) {
            if (fornecedorRepository.existsByCnpjAndCompanyId(request.getCnpj(), companyId)) {
                throw new RecursoDuplicadoException("CNPJ já cadastrado: " + request.getCnpj());
            }
        }

        supplier.setName(request.getName());
        supplier.setCnpj(request.getCnpj());
        supplier.setEmail(request.getEmail());
        supplier.setPhone(request.getPhone());
        supplier.setAddress(request.getAddress());
        fornecedorRepository.save(supplier);
        return mapToResponse(supplier);
    }

    @Transactional
    public void delete(Long id) {
        if (!fornecedorRepository.existsById(id)) {
            throw new RecursoNaoEncontradoException("Fornecedor não encontrado com ID: " + id);
        }
        fornecedorRepository.deleteById(id);
    }

    private FornecedorResponse mapToResponse(Fornecedor supplier) {
        return FornecedorResponse.builder()
                .id(supplier.getId())
                .name(supplier.getName())
                .cnpj(supplier.getCnpj())
                .email(supplier.getEmail())
                .phone(supplier.getPhone())
                .address(supplier.getAddress())
                .createdAt(supplier.getCreatedAt())
                .build();
    }