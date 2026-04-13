package com.gestaoestoque.service;

import com.gestaoestoque.dto.request.ProdutoRequest;
import com.gestaoestoque.dto.response.CategoriaResponse;
import com.gestaoestoque.dto.response.ProdutoResponse;
import com.gestaoestoque.dto.response.FornecedorResponse;
import com.gestaoestoque.entity.Categoria;
import com.gestaoestoque.entity.Produto;
import com.gestaoestoque.entity.Fornecedor;
import com.gestaoestoque.exception.RecursoDuplicadoException;
import com.gestaoestoque.exception.RecursoNaoEncontradoException;
import com.gestaoestoque.repository.CategoriaRepository;
import com.gestaoestoque.repository.ProdutoRepository;
import com.gestaoestoque.repository.FornecedorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProdutoService {

    private final ProdutoRepository produtoRepository;
    private final CategoriaRepository categoriaRepository;
    private final FornecedorRepository fornecedorRepository;
    private final EmpresaContexto empresaContexto;

    public Page<ProdutoResponse> findAll(Pageable pageable) {
        Long companyId = empresaContexto.getCurrentCompanyId();
        return produtoRepository.findByCompanyId(companyId, pageable).map(this::mapToResponse);
    }

    public ProdutoResponse findById(Long id) {
        Produto product = produtoRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Produto não encontrado com ID: " + id));
        return mapToResponse(product);
    }

    public Page<ProdutoResponse> search(String name, Pageable pageable) {
        Long companyId = empresaContexto.getCurrentCompanyId();
        return produtoRepository.findByNameContainingIgnoreCaseAndCompanyId(name, companyId, pageable).map(this::mapToResponse);
    }

    public List<ProdutoResponse> findLowStock() {
        Long companyId = empresaContexto.getCurrentCompanyId();
        return produtoRepository.findLowStockProductsByCompanyId(companyId).stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional
    public ProdutoResponse create(ProdutoRequest request) {
        Long companyId = empresaContexto.getCurrentCompanyId();
        if (produtoRepository.existsBySkuAndCompanyId(request.getSku(), companyId)) {
            throw new RecursoDuplicadoException("Código já cadastrado: " + request.getSku());
        }

        Produto product = Produto.builder()
                .name(request.getName())
                .sku(request.getSku())
                .description(request.getDescription())
                .price(request.getPrice())
                .costPrice(request.getCostPrice() != null ? request.getCostPrice() : java.math.BigDecimal.ZERO)
                .quantity(request.getQuantity())
                .minQuantity(request.getMinQuantity() != null ? request.getMinQuantity() : 0)
                .company(empresaContexto.getCurrentUser().getCompany())
                .build();

        if (request.getCategoryId() != null) {
            Categoria category = categoriaRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new RecursoNaoEncontradoException("Categoria não encontrada com ID: " + request.getCategoryId()));
            product.setCategory(category);
        }

        if (request.getSupplierId() != null) {
            Fornecedor supplier = fornecedorRepository.findById(request.getSupplierId())
                    .orElseThrow(() -> new RecursoNaoEncontradoException("Fornecedor não encontrado com ID: " + request.getSupplierId()));
            product.setSupplier(supplier);
        }

        produtoRepository.save(product);
        return mapToResponse(product);
    }

    @Transactional
    public ProdutoResponse update(Long id, ProdutoRequest request) {
        Produto product = produtoRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Produto não encontrado com ID: " + id));

        Long companyId = empresaContexto.getCurrentCompanyId();
        if (!product.getSku().equals(request.getSku()) && produtoRepository.existsBySkuAndCompanyId(request.getSku(), companyId)) {
            throw new RecursoDuplicadoException("Código já cadastrado: " + request.getSku());
        }

        product.setName(request.getName());
        product.setSku(request.getSku());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        if (request.getCostPrice() != null) product.setCostPrice(request.getCostPrice());
        product.setQuantity(request.getQuantity());
        if (request.getMinQuantity() != null) product.setMinQuantity(request.getMinQuantity());

        if (request.getCategoryId() != null) {
            Categoria category = categoriaRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new RecursoNaoEncontradoException("Categoria não encontrada"));
            product.setCategory(category);
        } else {
            product.setCategory(null);
        }

        if (request.getSupplierId() != null) {
            Fornecedor supplier = fornecedorRepository.findById(request.getSupplierId())
                    .orElseThrow(() -> new RecursoNaoEncontradoException("Fornecedor não encontrado"));
            product.setSupplier(supplier);
        } else {
            product.setSupplier(null);
        }

        produtoRepository.save(product);
        return mapToResponse(product);
    }

    @Transactional
    public void delete(Long id) {
        if (!produtoRepository.existsById(id)) {
            throw new RecursoNaoEncontradoException("Produto não encontrado com ID: " + id);
        }
        produtoRepository.deleteById(id);
    }

    private ProdutoResponse mapToResponse(Produto product) {
        ProdutoResponse.ProdutoResponseBuilder builder = ProdutoResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .sku(product.getSku())
                .description(product.getDescription())
                .price(product.getPrice())
                .costPrice(product.getCostPrice())
                .quantity(product.getQuantity())
                .minQuantity(product.getMinQuantity())
                .imageUrl(product.getImageUrl())
                .lowStock(product.isLowStock())
                .createdAt(product.getCreatedAt())
                .updatedAt(product.getUpdatedAt());

        if (product.getCategory() != null) {
            builder.category(CategoriaResponse.builder()
                    .id(product.getCategory().getId())
                    .name(product.getCategory().getName())
                    .build());
        }

        if (product.getSupplier() != null) {
            builder.supplier(FornecedorResponse.builder()
                    .id(product.getSupplier().getId())
                    .name(product.getSupplier().getName())
                    .build());
        }

        return builder.build();
    }
}