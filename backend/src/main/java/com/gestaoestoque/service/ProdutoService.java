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
        Long empresaId = empresaContexto.getCurrentCompanyId();
        return produtoRepository.findByEmpresaIdAndAtivoTrue(empresaId, pageable).map(this::mapToResponse);
    }

    public ProdutoResponse findById(Long id) {
        return mapToResponse(buscarProdutoAtivoDaEmpresa(id));
    }

    public Page<ProdutoResponse> search(String nome, Pageable pageable) {
        Long empresaId = empresaContexto.getCurrentCompanyId();
        return produtoRepository.findByNomeContainingIgnoreCaseAndEmpresaIdAndAtivoTrue(nome, empresaId, pageable)
                .map(this::mapToResponse);
    }

    public List<ProdutoResponse> findLowStock() {
        Long empresaId = empresaContexto.getCurrentCompanyId();
        return produtoRepository.findLowStockProductsByEmpresaId(empresaId).stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional
    public ProdutoResponse create(ProdutoRequest request) {
        Long empresaId = empresaContexto.getCurrentCompanyId();
        if (produtoRepository.existsBySkuAndEmpresaId(request.getSku(), empresaId)) {
            throw new RecursoDuplicadoException("SKU já cadastrado: " + request.getSku());
        }

        Produto produto = Produto.builder()
                .nome(request.getNome())
                .sku(request.getSku())
                .descricao(request.getDescricao())
                .preco(request.getPreco())
                .precoCusto(request.getPrecoCusto() != null ? request.getPrecoCusto() : java.math.BigDecimal.ZERO)
                .quantidade(request.getQuantidade())
                .quantidadeMinima(request.getQuantidadeMinima() != null ? request.getQuantidadeMinima() : 0)
                .empresa(empresaContexto.getCurrentUser().getEmpresa())
                .build();

        if (request.getCategoriaId() != null) {
            Categoria categoria = categoriaRepository.findById(request.getCategoriaId())
                    .orElseThrow(() -> new RecursoNaoEncontradoException("Categoria não encontrada com ID: " + request.getCategoriaId()));
            produto.setCategoria(categoria);
        }

        if (request.getFornecedorId() != null) {
            Fornecedor fornecedor = fornecedorRepository.findById(request.getFornecedorId())
                    .orElseThrow(() -> new RecursoNaoEncontradoException("Fornecedor não encontrado com ID: " + request.getFornecedorId()));
            produto.setFornecedor(fornecedor);
        }

        produtoRepository.save(produto);
        return mapToResponse(produto);
    }

    @Transactional
    public ProdutoResponse update(Long id, ProdutoRequest request) {
        Produto produto = buscarProdutoAtivoDaEmpresa(id);

        Long empresaId = empresaContexto.getCurrentCompanyId();
        if (!produto.getSku().equals(request.getSku()) && produtoRepository.existsBySkuAndEmpresaId(request.getSku(), empresaId)) {
            throw new RecursoDuplicadoException("SKU já cadastrado: " + request.getSku());
        }

        produto.setNome(request.getNome());
        produto.setSku(request.getSku());
        produto.setDescricao(request.getDescricao());
        produto.setPreco(request.getPreco());
        if (request.getPrecoCusto() != null) produto.setPrecoCusto(request.getPrecoCusto());
        produto.setQuantidade(request.getQuantidade());
        if (request.getQuantidadeMinima() != null) produto.setQuantidadeMinima(request.getQuantidadeMinima());

        if (request.getCategoriaId() != null) {
            Categoria categoria = categoriaRepository.findById(request.getCategoriaId())
                    .orElseThrow(() -> new RecursoNaoEncontradoException("Categoria não encontrada"));
            produto.setCategoria(categoria);
        } else {
            produto.setCategoria(null);
        }

        if (request.getFornecedorId() != null) {
            Fornecedor fornecedor = fornecedorRepository.findById(request.getFornecedorId())
                    .orElseThrow(() -> new RecursoNaoEncontradoException("Fornecedor não encontrado"));
            produto.setFornecedor(fornecedor);
        } else {
            produto.setFornecedor(null);
        }

        produtoRepository.save(produto);
        return mapToResponse(produto);
    }

    @Transactional
    public void delete(Long id) {
        Produto produto = buscarProdutoAtivoDaEmpresa(id);
        produto.setAtivo(false);
        produtoRepository.save(produto);
    }

    private Produto buscarProdutoAtivoDaEmpresa(Long id) {
        Long empresaId = empresaContexto.getCurrentCompanyId();
        return produtoRepository.findByIdAndEmpresaIdAndAtivoTrue(id, empresaId)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Produto não encontrado com ID: " + id));
    }

    private ProdutoResponse mapToResponse(Produto produto) {
        ProdutoResponse.ProdutoResponseBuilder builder = ProdutoResponse.builder()
                .id(produto.getId())
                .nome(produto.getNome())
                .sku(produto.getSku())
                .descricao(produto.getDescricao())
                .preco(produto.getPreco())
                .precoCusto(produto.getPrecoCusto())
                .quantidade(produto.getQuantidade())
                .quantidadeMinima(produto.getQuantidadeMinima())
                .urlImagem(produto.getUrlImagem())
                .estoqueAbaixo(produto.isEstoqueAbaixo())
                .criadoEm(produto.getCriadoEm())
                .atualizadoEm(produto.getAtualizadoEm());

        if (produto.getCategoria() != null) {
            builder.categoria(CategoriaResponse.builder()
                    .id(produto.getCategoria().getId())
                    .nome(produto.getCategoria().getNome())
                    .build());
        }

        if (produto.getFornecedor() != null) {
            builder.fornecedor(FornecedorResponse.builder()
                    .id(produto.getFornecedor().getId())
                    .nome(produto.getFornecedor().getNome())
                    .build());
        }

        return builder.build();
    }
}