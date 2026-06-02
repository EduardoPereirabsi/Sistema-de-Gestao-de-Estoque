package com.gestaoestoque.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "FORNECEDORES")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Fornecedor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "EMPRESA_ID", nullable = false)
    private Empresa empresa;

    @Column(name = "NOME", nullable = false, length = 150)
    private String nome;

    @Column(name = "CNPJ", length = 18)
    private String cnpj;

    @Column(name = "EMAIL", length = 150)
    private String email;

    @Column(name = "TELEFONE", length = 20)
    private String telefone;

    @Column(name = "ENDERECO", length = 255)
    private String endereco;

    @Builder.Default
    @Column(name = "ATIVO", nullable = false)
    private Boolean ativo = true;

    @Column(name = "CRIADO_EM", nullable = false, updatable = false)
    private LocalDateTime criadoEm;

    @PrePersist
    protected void prePersist() {
        this.criadoEm = LocalDateTime.now();
    }
}