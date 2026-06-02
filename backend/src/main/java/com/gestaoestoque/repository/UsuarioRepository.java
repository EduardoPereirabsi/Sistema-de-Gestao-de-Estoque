package com.gestaoestoque.repository;

import com.gestaoestoque.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    List<Usuario> findAllByEmail(String email);

    boolean existsByEmailAndEmpresaId(String email, Long empresaId);

    Optional<Usuario> findByTokenRecuperacao(String tokenRecuperacao);

    List<Usuario> findByEmpresaId(Long empresaId);

    List<Usuario> findByEmpresaIdAndAtivoTrue(Long empresaId);

    Optional<Usuario> findByIdAndEmpresaId(Long id, Long empresaId);
}
