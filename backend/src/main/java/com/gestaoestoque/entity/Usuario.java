package com.gestaoestoque.entity;

import com.gestaoestoque.enums.Perfil;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "usuarios")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "empresa_id", nullable = false)
    private Empresa company;

    @Column(name = "nome", nullable = false, length = 150)
    private String name;

    @Column(name = "email", nullable = false, unique = true, length = 150)
    private String email;

    @Column(name = "senha", nullable = false, length = 255)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(name = "perfil", nullable = false, length = 20)
    private Perfil role = Perfil.OPERADOR;

    @Column(name = "ativo", nullable = false)
    private Boolean active = true;

    @Column(name = "token_recuperacao")
    private String resetToken;

    @Column(name = "token_recuperacao_expiracao")
    private LocalDateTime resetTokenExpiry;

    @CreationTimestamp
    @Column(name = "criado_em", nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
