package com.gestaoestoque.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "PRODUTOS")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Produto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private Long id;

    @Column(name = "NOME", nullable = false, length = 150)
    private String nome;

    @Column(name = "SKU", nullable = false, unique = true, length = 50)
    private String sku;

    @Column(name = "DESCRICAO", columnDefinition = "TEXT")
    private String descricao;

    @Builder.Default
    @Column(name = "PRECO", nullable = false, precision = 12, scale = 2)
    private BigDecimal preco = BigDecimal.ZERO;

    @Builder.Default
    @Column(name = "PRECO_CUSTO", nullable = false, precision = 12, scale = 2)
    private BigDecimal precoCusto = BigDecimal.ZERO;

    @Builder.Default
    @Column(name = "QUANTIDADE", nullable = false)
    private Integer quantidade = 0;

    @Builder.Default
    @Column(name = "QUANTIDADE_MINIMA", nullable = false)
    private Integer quantidadeMinima = 0;

    @Column(name = "URL_IMAGEM", length = 500)
    private String urlImagem;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "EMPRESA_ID", nullable = false)
    private Empresa empresa;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "CATEGORIA_ID")
    private Categoria categoria;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "FORNECEDOR_ID")
    private Fornecedor fornecedor;

    @Builder.Default
    @Column(name = "ATIVO", nullable = false)
    private Boolean ativo = true;

    @CreationTimestamp
    @Column(name = "CRIADO_EM", updatable = false)
    private LocalDateTime criadoEm;

    @UpdateTimestamp
    @Column(name = "ATUALIZADO_EM")
    private LocalDateTime atualizadoEm;

    public boolean isEstoqueAbaixo() {
        return this.quantidade <= this.quantidadeMinima;
    }
}