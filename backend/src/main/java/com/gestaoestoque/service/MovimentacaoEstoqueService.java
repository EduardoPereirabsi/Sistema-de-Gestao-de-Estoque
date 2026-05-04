package com.gestaoestoque.service;

import com.gestaoestoque.dto.request.MovimentacaoRequest;
import com.gestaoestoque.dto.response.MovimentacaoResponse;
import com.gestaoestoque.entity.MovimentacaoEstoque;
import com.gestaoestoque.entity.Produto;
import com.gestaoestoque.entity.Usuario;
import com.gestaoestoque.exception.EstoqueInsuficienteException;
import com.gestaoestoque.exception.RecursoNaoEncontradoException;
import com.gestaoestoque.repository.MovimentacaoEstoqueRepository;
import com.gestaoestoque.repository.ProdutoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class MovimentacaoEstoqueService {

    private final MovimentacaoEstoqueRepository movimentacaoRepository;
    private final ProdutoRepository produtoRepository;
    private final EmpresaContexto empresaContexto;

    public Page<MovimentacaoResponse> findAll(Pageable pageable) {
        Long empresaId = empresaContexto.getCurrentCompanyId();
        return movimentacaoRepository.findByEmpresaId(empresaId, pageable)
                .map(this::mapToResponse);
    }

    @Transactional
    public MovimentacaoResponse create(MovimentacaoRequest request) {
        Long empresaId = empresaContexto.getCurrentCompanyId();

        Produto produto = produtoRepository.findById(request.getProdutoId())
                .orElseThrow(() -> new RecursoNaoEncontradoException(
                        "Produto não encontrado com ID: " + request.getProdutoId()
                ));

        if (!produto.getEmpresa().getId().equals(empresaId)) {
            throw new RecursoNaoEncontradoException(
                    "Produto não encontrado com ID: " + request.getProdutoId()
            );
        }

        Usuario usuario = empresaContexto.getCurrentUser();

        switch (request.getTipo()) {
            case ENTRADA -> produto.setQuantidade(produto.getQuantidade() + request.getQuantidade());
            case SAIDA -> {
                if (produto.getQuantidade() < request.getQuantidade()) {
                    throw new EstoqueInsuficienteException(
                            "Estoque insuficiente. Disponível: " + produto.getQuantidade()
                                    + ", solicitado: " + request.getQuantidade()
                    );
                }
                produto.setQuantidade(produto.getQuantidade() - request.getQuantidade());
            }
            case AJUSTE -> produto.setQuantidade(request.getQuantidade());
        }

        produtoRepository.save(produto);
        produtoRepository.save(produto);
        movimentacaoRepository.save(movimentacao);
        if (produto.isEstoqueAbaixo()) {
            messagingTemplate.convertAndSend(
                    "/topic/low-stock",
                    "Produto '" + produto.getNome() + "' está com estoque baixo: "
                            + produto.getQuantidade() + " unidade(s)"
            );
        }
        return mapToResponse(movimentacao);
    }
}



        MovimentacaoEstoque movimentacao = MovimentacaoEstoque.builder()
                .empresa(usuario.getEmpresa())
                .produto(produto)
                .usuario(usuario)
                .tipo(request.getTipo())
                .quantidade(request.getQuantidade())
                .motivo(request.getMotivo())
                .build();

        movimentacaoRepository.save(movimentacao);
        return mapToResponse(movimentacao);
    }

    private MovimentacaoResponse mapToResponse(MovimentacaoEstoque movimentacao) {
        return MovimentacaoResponse.builder()
                .id(movimentacao.getId())
                .nomeProduto(movimentacao.getProduto().getNome())
                .skuProduto(movimentacao.getProduto().getSku())
                .nomeUsuario(movimentacao.getUsuario().getNome())
                .tipo(movimentacao.getTipo())
                .quantidade(movimentacao.getQuantidade())
                .motivo(movimentacao.getMotivo())
                .criadoEm(movimentacao.getCriadoEm())
                .build();
    }
}