package com.gestaoestoque.entity;

import com.gestaoestoque.enums.TipoMovimentacao;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "MOVIMENTACOES_ESTOQUE")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MovimentacaoEstoque {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "EMPRESA_ID", nullable = false)
    private Empresa company;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "PRODUTO_ID", nullable = false)
    private Produto product;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "USUARIO_ID", nullable = false)
    private Usuario user;

    @Enumerated(EnumType.STRING)
    @Column(name = "TIPO", nullable = false)
    private TipoMovimentacao type;

    @Column(name = "QUANTIDADE", nullable = false)
    private Integer quantity;

    @Column(name = "MOTIVO", length = 255)
    private String reason;

    @CreationTimestamp
    @Column(name = "CRIADO_EM", updatable = false)
    private LocalDateTime createdAt;
}