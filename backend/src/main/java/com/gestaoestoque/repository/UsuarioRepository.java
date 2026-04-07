package com.gestaoestoque.repository;

import com.gestaoestoque.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    Optional<Usuario> findByEmail(String email);

    List<Usuario> findAllByEmail(String email);

    boolean existsByEmail(String email);

    Optional<Usuario> findByResetToken(String resetToken);

    List<Usuario> findByEmpresaId(Long empresaId);

    List<Usuario> findByEmpresaIdAndAtivoTrue(Long empresaId);
}
