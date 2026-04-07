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
    private String name;

    @Column(name = "SKU", nullable = false, unique = true, length = 50)
    private String sku;

    @Column(name = "DESCRICAO", columnDefinition = "TEXT")
    private String description;

    @Column(name = "PRECO", nullable = false, precision = 12, scale = 2)
    private BigDecimal price = BigDecimal.ZERO;

    @Column(name = "PRECO_CUSTO", nullable = false, precision = 12, scale = 2)
    private BigDecimal costPrice = BigDecimal.ZERO;

    @Column(name = "QUANTIDADE", nullable = false)
    private Integer quantity = 0;

    @Column(name = "QUANTIDADE_MINIMA", nullable = false)
    private Integer minQuantity = 0;

    @Column(name = "URL_IMAGEM", length = 500)
    private String imageUrl;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "EMPRESA_ID", nullable = false)
    private Empresa company;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "CATEGORIA_ID")
    private Categoria category;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "FORNECEDOR_ID")
    private Fornecedor supplier;

    @CreationTimestamp
    @Column(name = "CRIADO_EM", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "ATUALIZADO_EM")
    private LocalDateTime updatedAt;

    public boolean isLowStock() {
        return this.quantity <= this.minQuantity;
    }
}