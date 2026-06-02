package com.gestaoestoque.entity;

import com.gestaoestoque.enums.Perfil;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "USUARIOS")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "EMPRESA_ID", nullable = false)
    private Empresa empresa;

    @Column(name = "NOME", nullable = false, length = 150)
    private String nome;

    @Column(name = "EMAIL", nullable = false, length = 150)
    private String email;

    @Column(name = "SENHA", nullable = false, length = 255)
    private String senha;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(name = "PERFIL", nullable = false, length = 20)
    private Perfil perfil = Perfil.OPERADOR;

    @Builder.Default
    @Column(name = "ATIVO", nullable = false)
    private Boolean ativo = true;

    @Column(name = "TOKEN_RECUPERACAO")
    private String tokenRecuperacao;

    @Column(name = "TOKEN_RECUPERACAO_EXPIRACAO")
    private LocalDateTime tokenRecuperacaoExpiracao;

    @CreationTimestamp
    @Column(name = "CRIADO_EM", nullable = false, updatable = false)
    private LocalDateTime criadoEm;
}
